/** Carlos 30 â€“ Wishlist backend
 * Google Apps Script bound to the Google Sheet used for the catalog and reservations.
 * Keep the existing Regalos and Reservas tabs. Run setupSheets() once after installing.
 */
const SPREADSHEET_ID = '15Epqic7csGhOpFfHdO_FcnrtpBlfsA51CsOzqmRLdrU';
const FRONTEND_URL = 'https://carlostorrescubila.github.io/carlos30-website/';
const APP_TITLE = 'Carlos 30 â€“ Wishlist';
const PENDING_MINUTES = 15;
const GIFT_HEADERS = ['id', 'nombre', 'tipo', 'max_plazas', 'precio', 'enlace', 'imagen', 'activo'];
const BOOKING_HEADERS = [
  'id_reserva', 'id_regalo', 'nombre_invitado', 'email_invitado', 'telefono_invitado',
  'fecha', 'estado', 'token_verificacion', 'token_cancelacion', 'fecha_expiracion',
  'grupo_notificado', 'token_acceso_grupo', 'consentimiento_grupal', 'modo_reserva'
];
const RSVP_HEADERS = [
  'fecha_respuesta', 'nombre', 'apellido', 'email', 'viene_con_acompanante',
  'acompanante_nombre', 'acompanante_apellido', 'numero_personas'
];
const RSVP_DEADLINE = '2027-01-10';
const ACTIVE_STATES = ['pendiente', 'confirmada'];

function doGet(e) {
  const p = (e && e.parameter) || {};
  const action = String(p.action || '');
  const token = String(p.token || '');
  if (action === 'wishlist') return wishlistJsonp_(String(p.callback || ''));
  if (['verify', 'cancel', 'group'].includes(action)) return redirectToFrontend_(action, token, p.lang);
  return redirectToFrontendHome_();
}

function redirectToFrontendHome_() {
  const target = FRONTEND_URL;
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=' + escapeHtml_(target) + '"></head><body><script>location.replace(' + JSON.stringify(target) + ');</script><a href="' + escapeHtml_(target) + '">Continuar</a></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function redirectToFrontend_(action, token, language) {
  const target = frontendActionUrl_(action, token, normalizePageLanguage_(language));
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=' + escapeHtml_(target) + '"></head><body><script>location.replace(' + JSON.stringify(target) + ');</script><a href="' + escapeHtml_(target) + '">Continuar</a></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/** Public JSONP endpoint for the static GitHub Pages frontend. */
function wishlistJsonp_(callback) {
  if (!/^wishlistCallback\d+$/.test(callback)) {
    return ContentService.createTextOutput('/* Invalid callback */').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  const payload = JSON.stringify(getWishlist()).replace(/</g, '\\u003c');
  return ContentService.createTextOutput(callback + '(' + payload + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/** Reservation form endpoint. The static site submits to a hidden iframe and receives a postMessage. */
function doPost(e) {
  const p = (e && e.parameter) || {};
  const action = String(p.action || '');
  const requestId = String(p.requestId || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100);
  let result;
  let resultType = 'carlos30-reservation-result';
  try {
    if (action === 'reserve') {
      result = reserveGift(
        String(p.giftId || ''), String(p.name || ''), String(p.email || ''), String(p.phone || ''),
        String(p.groupConsent || '').toLowerCase() === 'true', String(p.reservationMode || ''), String(p.language || 'de')
      );
    } else if (action === 'rsvp') {
      resultType = 'carlos30-rsvp-result';
      result = saveRsvp_(p);
    } else if (action === 'verify') {
      resultType = 'carlos30-page-action-result';
      const verification = verifyReservation_(String(p.token || ''), normalizePageLanguage_(p.language));
      result = { success: !!verification.ok, message: verification.message || '' };
    } else if (action === 'cancel') {
      resultType = 'carlos30-page-action-result';
      result = cancelReservation(String(p.token || ''));
    } else if (action === 'group') {
      resultType = 'carlos30-page-action-result';
      result = { success: true, data: getGroupContacts(String(p.token || '')) };
    } else {
      throw new Error('Solicitud no válida. Actualiza la página e inténtalo de nuevo.');
    }
    result = { success: result.success !== false, message: result.message || '', code: result.code || '', data: result.data || null };
  } catch (err) {
    result = { success: false, message: err && err.message ? String(err.message) : 'Die Reservierung konnte nicht verarbeitet werden.' };
  }
  const message = JSON.stringify({ type: resultType, requestId: requestId, success: !!result.success, message: result.message || '', code: result.code || '' }).replace(/</g, '\\u003c');
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body><script>window.top.postMessage(' + message + ', "*");</script></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Run once. Adds missing headers at the end; never deletes existing data. */
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureHeaders_(ss, 'Regalos', GIFT_HEADERS);
  ensureHeaders_(ss, 'Reservas', BOOKING_HEADERS);
  let attendanceSheet = ss.getSheetByName('Asistencia');
  if (!attendanceSheet) attendanceSheet = ss.insertSheet('Asistencia');
  ensureHeaders_(ss, 'Asistencia', RSVP_HEADERS);
  return 'ConfiguraciÃ³n completada. No se han borrado datos.';
}

function saveRsvp_(params) {
  const firstName = clean_(params.firstName, 100);
  const lastName = clean_(params.lastName, 100);
  const email = clean_(params.email, 200).toLowerCase();
  const hasGuest = String(params.hasGuest || '').toLowerCase() === 'true';
  const language = String(params.language || '').toLowerCase() === 'es' ? 'es' : 'de';
  const guestFirstName = hasGuest ? clean_(params.guestFirstName, 100) : '';
  const guestLastName = hasGuest ? clean_(params.guestLastName, 100) : '';

  if (!firstName || !lastName) throw new Error('Introduce tu nombre y apellido.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Introduce un correo electrónico válido.');
  if (hasGuest && (!guestFirstName || !guestLastName)) throw new Error('Introduce el nombre y apellido de tu acompañante.');
  if (Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd') >= RSVP_DEADLINE) {
    throw new Error('El plazo para confirmar asistencia ya terminó.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Asistencia');
    if (!sheet) sheet = ss.insertSheet('Asistencia');
    ensureHeaders_(ss, 'Asistencia', RSVP_HEADERS);

    const responses = readObjects_(sheet);
    const existingIndex = responses.findIndex(row => String(row.email || '').trim().toLowerCase() === email);
    const response = {
      fecha_respuesta: new Date(),
      nombre: firstName,
      apellido: lastName,
      email,
      viene_con_acompanante: hasGuest ? 'sí' : 'no',
      acompanante_nombre: guestFirstName,
      acompanante_apellido: guestLastName,
      numero_personas: hasGuest ? 2 : 1
    };

    const wasUpdated = existingIndex >= 0;
    if (wasUpdated) {
      updateObject_(sheet, existingIndex + 2, response);
    } else {
      appendObject_(sheet, RSVP_HEADERS, response);
    }

    const emailSent = sendRsvpConfirmation_(email, firstName, lastName, hasGuest, guestFirstName, guestLastName, language);
    if (!emailSent) {
      return {
        success: true,
        code: 'email_failed',
        message: language === 'es'
          ? 'Tu asistencia quedó guardada, pero no se pudo enviar el correo de confirmación'
          : 'Deine Teilnahme wurde gespeichert, aber die Bestätigungs-E-Mail konnte nicht gesendet werden'
      };
    }
    return {
      success: true,
      code: wasUpdated ? 'updated' : 'confirmed',
      message: language === 'es'
        ? (wasUpdated ? 'Tu confirmación se actualizó. Se te envió un correo' : 'Tu asistencia está confirmada. Se te envió un correo')
        : (wasUpdated ? 'Deine Teilnahme wurde aktualisiert. Du hast eine E-Mail erhalten' : 'Deine Teilnahme ist bestätigt. Du hast eine E-Mail erhalten')
    };
  } finally {
    lock.releaseLock();
  }
}

function sendRsvpConfirmation_(email, firstName, lastName, hasGuest, guestFirstName, guestLastName, language) {
  const calendarUrl = calendarEventUrl_(language);
  const subject = language === 'es' ? 'Asistencia confirmada · Carlos 30' : 'Teilnahme bestätigt · Carlos 30';
  const greeting = language === 'es' ? '¡Hola ' + firstName + '!' : 'Hallo ' + firstName + '!';
  const thankYou = language === 'es'
    ? (hasGuest
      ? '¡Muchas gracias por confirmar tu asistencia! ¡Qué ilusión!'
      : '¡Muchas gracias por confirmar tu asistencia! Me hace mucha ilusión saber que vas a acompañarme en este día tan especial. 🥳')
    : (hasGuest
      ? 'Vielen Dank, dass du deine Teilnahme bestätigt hast. Ich freue mich riesig!'
      : 'Vielen Dank, dass du deine Teilnahme bestätigt hast. Es bedeutet mir sehr viel, dass du mich an diesem besonderen Tag begleitest. 🥳');
  const reunion = language === 'es'
    ? (hasGuest
      ? 'Tengo muchísimas ganas de celebrar este día contigo y con ' + guestFirstName + '. Estoy deseando que llegue el momento de reunirnos y disfrutar juntos. 🥳'
      : '¡Ya queda menos para celebrarlo juntos!')
    : (hasGuest
      ? 'Ich freue mich sehr darauf, diesen besonderen Tag mit dir und ' + guestFirstName + ' zu feiern. Ich kann es kaum erwarten, dass wir zusammenkommen und eine schöne Zeit haben. 🥳'
      : 'Der Tag, an dem wir gemeinsam feiern, rückt immer näher!');
  const calendarLabel = language === 'es' ? 'Añadir a Google Calendar' : 'Zu Google Kalender hinzufügen';
  const closing = language === 'es' ? '¡Nos vemos muy pronto!\n\nUn abrazo,\nCarlos' : 'Bis ganz bald!\n\nLiebe Grüße,\nCarlos';
  const body = greeting + '\n\n' + thankYou + '\n\n' + reunion + '\n\n' + calendarLabel + '\n' + calendarUrl + '\n\n' + closing;
  const htmlBody = '<div style="max-width:560px;margin:0 auto;padding:28px;background:#fffdf8;color:#292720;font:16px/1.7 Arial,sans-serif">' +
    '<p>' + escapeHtml_(greeting) + '</p>' +
    '<p>' + escapeHtml_(thankYou) + '</p>' +
    '<p>' + escapeHtml_(reunion) + '</p>' +
    '<p style="margin:28px 0"><a href="' + escapeHtml_(calendarUrl) + '" style="display:inline-block;padding:12px 18px;border-radius:4px;background:#292720;color:#fff;text-decoration:none">' + escapeHtml_(calendarLabel) + '</a></p>' +
    '<p>' + escapeHtml_(closing).replace(/\n/g, '<br>') + '</p>' +
    '</div>';
  try {
    MailApp.sendEmail({ to: email, subject, body, htmlBody });
    return true;
  } catch (err) {
    console.error('RSVP confirmation email failed: ' + (err && err.message ? err.message : err));
    return false;
  }
}

function calendarEventUrl_(language) {
  const title = language === 'es' ? 'Cumpleaños de Carlos · 30' : 'Carlos · 30. Geburtstag';
  const details = language === 'es'
    ? 'Celebración de cumpleaños de Carlos'
    : 'Geburtstagsfeier von Carlos';
  const location = 'Pinneberger Str. 31, Wedel';
  const dates = '20270109T160000/20270109T230000';
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(title) +
    '&dates=' + encodeURIComponent(dates) +
    '&details=' + encodeURIComponent(details) +
    '&location=' + encodeURIComponent(location) +
    '&ctz=Europe%2FBerlin';
}

function ensureHeaders_(ss, name, expected) {
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('No existe la pestaÃ±a Â«' + name + 'Â».');
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, expected.length).setValues([expected]);
    sh.setFrozenRows(1);
    return;
  }
  const existing = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getDisplayValues()[0]
    .map(v => String(v || '').trim());
  expected.forEach(header => {
    if (existing.indexOf(header) === -1) {
      const nextCol = sh.getLastColumn() + 1;
      sh.getRange(1, nextCol).setValue(header);
      existing.push(header);
    }
  });
  sh.setFrozenRows(1);
}

function getWishlist() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const giftSheet = ss.getSheetByName('Regalos');
  const bookingSheet = ss.getSheetByName('Reservas');
  if (!giftSheet || !bookingSheet) throw new Error('Faltan las pestaÃ±as Regalos o Reservas. Ejecuta setupSheets().');
  const gifts = readObjects_(giftSheet);
  const bookings = readObjects_(bookingSheet);
  const now = Date.now();
  return gifts.filter(g => String(g.id || '').trim() && isActive_(g.activo)).map(g => {
    const type = normalizeGiftType_(g.tipo);
    const max = type === 'grupal' ? Math.max(1, parseInt(g.max_plazas, 10) || 1) : 1;
    const active = bookings.filter(b => String(b.id_regalo) === String(g.id) && isHolding_(b, now));
    const soloReserved = type === 'grupal' && active.some(b => ['solo', 'allein', 'alleine', 'individual', 'individuell', 'individually'].includes(String(b.modo_reserva || '').trim().toLowerCase()));
    const reserved = soloReserved ? max : Math.min(active.length, max);
    return {
      id: String(g.id), name: String(g.nombre || ''), type,
      price: String(g.precio || '').trim(), link: safeHttpUrl_(g.enlace), image: safeHttpUrl_(g.imagen),
      max, reserved, available: reserved < max && !soloReserved, soloAvailable: type === 'grupal' && active.length === 0 && !soloReserved, soloReserved,
      remaining: Math.max(0, max - reserved)
    };
  });
}

function reserveGift(giftId, name, email, phone, groupConsent, reservationMode, language) {
  giftId = clean_(giftId, 150); name = clean_(name, 100);
  email = clean_(email, 200).toLowerCase(); phone = clean_(phone, 35);
  language = normalizePageLanguage_(language);
  if (!giftId) throw new Error('No se ha identificado el regalo. Actualiza la pÃ¡gina e intÃ©ntalo de nuevo.');
  if (!name) throw new Error('Introduce tu nombre.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Introduce un correo electrÃ³nico vÃ¡lido.');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  let booking, gift;
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const gifts = readObjects_(ss.getSheetByName('Regalos'));
    const bookingSheet = ss.getSheetByName('Reservas');
    const bookings = readObjects_(bookingSheet);
    const now = Date.now();
    gift = gifts.find(g => String(g.id) === giftId && isActive_(g.activo));
    if (!gift) throw new Error('Este regalo ya no estÃ¡ disponible. Actualiza la pÃ¡gina.');
    const isGroup = normalizeGiftType_(gift.tipo) === 'grupal';
    const mode = isGroup ? (String(reservationMode || 'grupo').toLowerCase() === 'solo' ? 'solo' : 'grupo') : 'individual';
    if (isGroup && mode === 'grupo' && !/^[+0-9()\s./-]{6,35}$/.test(phone)) throw new Error('Introduce un nÃºmero de telÃ©fono vÃ¡lido.');
    if (isGroup && mode === 'grupo' && groupConsent !== true) throw new Error('Para reservar una plaza grupal, confirma el consentimiento sobre los datos de contacto.');
    const duplicate = bookings.some(b => String(b.email_invitado || '').toLowerCase() === email && isHolding_(b, now));
    if (duplicate) throw new Error('Este correo ya tiene una reserva pendiente o confirmada. Revisa tu correo para gestionarla.');
    const capacity = isGroup ? Math.max(1, parseInt(gift.max_plazas, 10) || 1) : 1;
    const occupants = bookings.filter(b => String(b.id_regalo) === giftId && isHolding_(b, now));
    const hasSoloBooking = occupants.some(b => ['solo', 'allein', 'alleine', 'individual', 'individuell', 'individually'].includes(String(b.modo_reserva || '').trim().toLowerCase()));
    if (isGroup && mode === 'solo' && occupants.length > 0) throw new Error('Este regalo grupal ya tiene una plaza reservada y no se puede reservar en solitario.');
    if (isGroup && mode === 'grupo' && hasSoloBooking) throw new Error('Este regalo ya estÃ¡ reservado en solitario.');
    if (occupants.length >= capacity) throw new Error('Este regalo acaba de completarse. Actualiza la disponibilidad para ver otras opciones.');
    const verification = newToken_(), cancelToken = newToken_(), groupToken = newToken_();
    booking = {
      id_reserva: Utilities.getUuid(), id_regalo: giftId, nombre_invitado: name,
      email_invitado: email, telefono_invitado: phone, fecha: new Date(), estado: 'pendiente',
      token_verificacion: verification, token_cancelacion: cancelToken,
      fecha_expiracion: new Date(now + PENDING_MINUTES * 60000), grupo_notificado: false,
      token_acceso_grupo: groupToken, consentimiento_grupal: isGroup && mode === 'grupo' ? 'sÃ­' : 'no aplica',
      modo_reserva: mode
    };
    appendObject_(bookingSheet, BOOKING_HEADERS, booking);
  } finally { lock.releaseLock(); }

  const verifyUrl = frontendActionUrl_('verify', booking.token_verificacion, language);
  try {
    const verificationSent = sendGiftEmail_(
      email,
      'Confirma tu reserva \u2013 Carlos 30',
      [
        'Hola, ' + name + ':',
        'Has iniciado una reserva para \u00ab' + String(gift.nombre || 'tu regalo') + '\u00bb.',
        'Conf\u00edrmala en los pr\u00f3ximos ' + PENDING_MINUTES + ' minutos abriendo el enlace. Si no has solicitado esta reserva, ignora este correo. La plaza provisional caducar\u00e1 autom\u00e1ticamente.'
      ],
      [{ label: 'Confirmar reserva', url: verifyUrl }]
    );
    if (!verificationSent) throw new Error('No se pudo enviar el correo de verificaciÃ³n.');
  } catch (err) {
    cancelById_(booking.id_reserva);
    throw new Error('No se pudo enviar el correo de verificaciÃ³n. La plaza provisional se ha liberado. IntÃ©ntalo mÃ¡s tarde.');
  }
  return { success: true, message: 'Te hemos enviado un correo. Abre el enlace en los prÃ³ximos 15 minutos para confirmar la reserva.' };
}

function verifyReservation_(token, language) {
  if (!token || token.length > 200) return { ok: false, message: 'El enlace no es vÃ¡lido o ha caducado.' };
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  let booking, gift, groupIsFull = false;
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Reservas');
    const bookings = readObjects_(sheet), gifts = readObjects_(ss.getSheetByName('Regalos'));
    const index = bookings.findIndex(b => String(b.token_verificacion) === token && String(b.estado) === 'pendiente');
    if (index < 0) {
      const already = bookings.find(b => String(b.token_verificacion) === token && String(b.estado) === 'confirmada');
      return already ? { ok: true, message: 'Esta reserva ya est\u00e1 confirmada. \u00a1Gracias!' } : { ok: false, message: 'El enlace no es v\u00e1lido, ya se ha usado o ha caducado.' };
    }
    booking = bookings[index];
    if (!(new Date(booking.fecha_expiracion).getTime() > Date.now())) {
      updateBooking_(sheet, index + 2, { estado: 'expirada', token_verificacion: '' });
      return { ok: false, message: 'El enlace ha caducado. Vuelve a reservar el regalo si sigue disponible.' };
    }
    const emailDuplicate = bookings.some(b => String(b.email_invitado || '').toLowerCase() === String(booking.email_invitado || '').toLowerCase() && String(b.id_reserva) !== String(booking.id_reserva) && isHolding_(b, Date.now()));
    if (emailDuplicate) {
      updateBooking_(sheet, index + 2, { estado: 'cancelada', token_verificacion: '' });
      return { ok: false, message: 'Este correo ya tiene otra reserva activa. Esta reserva provisional se ha liberado.' };
    }
    gift = gifts.find(g => String(g.id) === String(booking.id_regalo));
    if (!gift || !isActive_(gift.activo)) {
      updateBooking_(sheet, index + 2, { estado: 'cancelada', token_verificacion: '' });
      return { ok: false, message: 'Este regalo ya no estÃ¡ disponible. La plaza se ha liberado.' };
    }
    const isGroup = normalizeGiftType_(gift.tipo) === 'grupal';
    const isSoloGroup = isGroup && ['solo', 'allein', 'alleine', 'individual', 'individuell', 'individually'].includes(String(booking.modo_reserva || '').trim().toLowerCase());
    const capacity = isGroup ? Math.max(1, parseInt(gift.max_plazas, 10) || 1) : 1;
    const occupants = bookings.filter(b => String(b.id_regalo) === String(gift.id) && String(b.id_reserva) !== String(booking.id_reserva) && isHolding_(b, Date.now()));
    const hasSoloBooking = occupants.some(b => ['solo', 'allein', 'alleine', 'individual', 'individuell', 'individually'].includes(String(b.modo_reserva || '').trim().toLowerCase()));
    if (occupants.length >= capacity || (isGroup && ((isSoloGroup && occupants.length > 0) || (!isSoloGroup && hasSoloBooking)))) {
      updateBooking_(sheet, index + 2, { estado: 'expirada', token_verificacion: '' });
      return { ok: false, message: 'El regalo se ha completado antes de confirmar. La plaza se ha liberado.' };
    }
    updateBooking_(sheet, index + 2, { estado: 'confirmada' });
    booking.estado = 'confirmada';
    if (isGroup && !isSoloGroup) {
      const confirmedAfter = bookings.filter(b => String(b.id_regalo) === String(gift.id) && (String(b.id_reserva) === String(booking.id_reserva) || String(b.estado) === 'confirmada'));
      groupIsFull = confirmedAfter.length >= capacity;
    }
  } finally { lock.releaseLock(); }

  const cancelUrl = frontendActionUrl_('cancel', booking.token_cancelacion, language);
  if (normalizeGiftType_(gift.tipo) === 'grupal' && String(booking.modo_reserva || '') !== 'solo') {
    sendGiftEmail_(booking.email_invitado, 'Tu plaza est\u00e1 confirmada \u2013 Carlos 30', [
      'Hola, ' + booking.nombre_invitado + ':',
      'Tu plaza para \u00ab' + gift.nombre + '\u00bb est\u00e1 confirmada.',
      'Cuando el grupo est\u00e9 completo, recibir\u00e1s un correo para coordinaros.'
    ], [{ label: 'Cancelar reserva', url: cancelUrl }]);
    if (groupIsFull) notifyFullGroup_(String(gift.id));
  } else {
    sendGiftEmail_(booking.email_invitado, 'Tu regalo est\u00e1 reservado \u2013 Carlos 30', [
      'Hola, ' + booking.nombre_invitado + ':',
      'Tu reserva de \u00ab' + gift.nombre + '\u00bb est\u00e1 confirmada.',
      'Si necesitas cancelar, utiliza este enlace privado.'
    ], [{ label: 'Cancelar reserva', url: cancelUrl }]);
  }
  return { ok: true, message: '\u00a1Correo verificado! Tu reserva est\u00e1 confirmada.' };
}

function cancelReservation(token) {
  if (!token || token.length > 200) return { success: false, message: 'El enlace no es vÃ¡lido.' };
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  let booking, gift, remaining = [];
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID), sheet = ss.getSheetByName('Reservas');
    const bookings = readObjects_(sheet), index = bookings.findIndex(b => String(b.token_cancelacion) === token && ACTIVE_STATES.includes(String(b.estado)));
    if (index < 0) return { success: false, message: 'Esta reserva ya se ha cancelado o el enlace no es vÃ¡lido.' };
    booking = bookings[index];
    gift = readObjects_(ss.getSheetByName('Regalos')).find(g => String(g.id) === String(booking.id_regalo));
    updateBooking_(sheet, index + 2, { estado: 'cancelada', token_verificacion: '', token_cancelacion: '' });
    remaining = bookings.filter(b => String(b.id_regalo) === String(booking.id_regalo) && String(b.id_reserva) !== String(booking.id_reserva) && String(b.estado) === 'confirmada' && String(b.modo_reserva || '') !== 'solo');
  } finally { lock.releaseLock(); }
  sendGiftEmail_(booking.email_invitado, 'Reserva cancelada \u2013 Carlos 30', [
    'Hola, ' + booking.nombre_invitado + ':',
    'Tu reserva de \u00ab' + (gift ? gift.nombre : 'regalo') + '\u00bb se ha cancelado y la plaza vuelve a estar disponible.',
    'Gracias por avisar.'
  ], [{ label: 'Volver a la wishlist', url: FRONTEND_URL }]);
  if (gift && normalizeGiftType_(gift.tipo) === 'grupal' && String(booking.modo_reserva || '') !== 'solo') remaining.forEach(b => sendGiftEmail_(b.email_invitado, 'Actualizaci\u00f3n del regalo grupal \u2013 Carlos 30', [
    'Hola, ' + b.nombre_invitado + ':',
    'Una persona ha cancelado su plaza para \u00ab' + gift.nombre + '\u00bb.',
    'La disponibilidad del grupo ha cambiado.'
  ], [{ label: 'Ver wishlist', url: FRONTEND_URL }]));
  return { success: true, message: 'Reserva cancelada. Te hemos enviado una confirmaciÃ³n por correo.' };
}

function getGroupContacts(token) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID), bookings = readObjects_(ss.getSheetByName('Reservas')), gifts = readObjects_(ss.getSheetByName('Regalos'));
  const me = bookings.find(b => String(b.token_acceso_grupo) === String(token) && String(b.estado) === 'confirmada' && String(b.modo_reserva || '') !== 'solo');
  if (!me) throw new Error('El enlace privado no es vÃ¡lido o tu reserva ya no estÃ¡ activa.');
  const gift = gifts.find(g => String(g.id) === String(me.id_regalo));
  if (!gift || String(gift.tipo || '').toLowerCase() !== 'grupal') throw new Error('Este regalo no tiene una lista grupal.');
  const members = bookings.filter(b => String(b.id_regalo) === String(me.id_regalo) && String(b.estado) === 'confirmada' && String(b.modo_reserva || '') !== 'solo');
  const capacity = Math.max(1, parseInt(gift.max_plazas, 10) || 1);
  if (members.length < capacity) return { full: false, gift: String(gift.nombre), members: [] };
  return { full: true, gift: String(gift.nombre), members: members.map(b => ({ name: String(b.nombre_invitado || ''), phone: String(b.telefono_invitado || '') })) };
}

/** Idempotent notification: mark as sent only after attempting the sends. */
function notifyFullGroup_(giftId) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  let members, gift;
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID), sheet = ss.getSheetByName('Reservas');
    const bookings = readObjects_(sheet), gifts = readObjects_(ss.getSheetByName('Regalos'));
    gift = gifts.find(g => String(g.id) === String(giftId));
    if (!gift) return;
    const capacity = Math.max(1, parseInt(gift.max_plazas, 10) || 1);
    members = bookings.filter(b => String(b.id_regalo) === giftId && String(b.estado) === 'confirmada' && String(b.modo_reserva || '') !== 'solo');
    if (members.length < capacity || members.some(b => String(b.grupo_notificado).toLowerCase() === 'true')) return;
    // Claim the group under lock to avoid two simultaneous verifications sending duplicates.
    members.forEach(b => {
      const row = bookings.findIndex(x => String(x.id_reserva) === String(b.id_reserva));
      updateBooking_(sheet, row + 2, { grupo_notificado: true });
    });
  } finally { lock.releaseLock(); }
  members.forEach(b => {
    const url = frontendActionUrl_('group', b.token_acceso_grupo, 'de'), cancelUrl = frontendActionUrl_('cancel', b.token_cancelacion, 'de');
    sendGiftEmail_(b.email_invitado, '\u00a1El grupo est\u00e1 completo! \u2013 Carlos 30', [
      'Hola, ' + b.nombre_invitado + ':',
      'El grupo para \u00ab' + gift.nombre + '\u00bb ya est\u00e1 completo.',
      'Consulta los nombres y tel\u00e9fonos de los participantes en el enlace privado. No reenv\u00edes ese enlace.'
    ], [
      { label: 'Ver participantes', url },
      { label: 'Cancelar plaza', url: cancelUrl }
    ]);
  });
}

function verifyPage_(token, language) { const lang = normalizePageLanguage_(language); const r = verifyReservation_(token, lang); return messagePage_(r.message, r.ok, lang); }
function cancelPage_(token, language) {
  const lang = normalizePageLanguage_(language);
  const safeToken = JSON.stringify(String(token));
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title data-es="Cancelar reserva · Carlos 30" data-de="Reservierung stornieren · Carlos 30">${lang === 'es' ? 'Cancelar reserva · Carlos 30' : 'Reservierung stornieren · Carlos 30'}</title>${pageStyles_()}</head><body><main class="message">${pageLanguageControl_(lang)}<p class="eyebrow">CARLOS · 30</p><h1 data-es="Cancelar reserva" data-de="Reservierung stornieren">${lang === 'es' ? 'Cancelar reserva' : 'Reservierung stornieren'}</h1><p data-es="¿Seguro que quieres cancelar tu reserva? La plaza volverá a estar disponible." data-de="Möchtest du deine Reservierung wirklich stornieren? Der Platz wird danach wieder verfügbar.">${lang === 'es' ? '¿Seguro que quieres cancelar tu reserva? La plaza volverá a estar disponible.' : 'Möchtest du deine Reservierung wirklich stornieren? Der Platz wird danach wieder verfügbar.'}</p><button id="cancel" data-es="Sí, cancelar mi reserva" data-de="Ja, meine Reservierung stornieren">${lang === 'es' ? 'Sí, cancelar mi reserva' : 'Ja, meine Reservierung stornieren'}</button><p id="msg" role="status" aria-live="polite"></p></main>${pageLanguageScript_()}<script>document.getElementById('cancel').onclick=function(){const b=this;b.disabled=true;const msg=document.getElementById('msg');msg.dataset.es='Procesando…';msg.dataset.de='Wird verarbeitet…';msg.textContent=document.documentElement.lang==='es'?msg.dataset.es:msg.dataset.de;google.script.run.withSuccessHandler(function(r){msg.dataset.es=r.success?'La reserva se ha cancelado.':'La reserva ya está cancelada o el enlace no es válido.';msg.dataset.de=r.success?'Die Reservierung wurde storniert.':'Die Reservierung ist bereits storniert oder der Link ist ungültig.';msg.textContent=document.documentElement.lang==='es'?msg.dataset.es:msg.dataset.de;}).withFailureHandler(function(){msg.dataset.es='No se pudo cancelar la reserva. Inténtalo de nuevo.';msg.dataset.de='Die Reservierung konnte nicht storniert werden. Bitte versuche es erneut.';msg.textContent=document.documentElement.lang==='es'?msg.dataset.es:msg.dataset.de;b.disabled=false;}).cancelReservation(${safeToken});};</script></body></html>`;
  return HtmlService.createHtmlOutput(html).setTitle(lang === 'es' ? 'Cancelar reserva · Carlos 30' : 'Reservierung stornieren · Carlos 30').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function groupPage_(token) {
  let data; try { data = getGroupContacts(token); } catch (err) { return messagePage_(err.message, false); }
  let body = '<h1>Regalo grupal</h1><p>' + escapeHtml_(data.gift) + '</p>';
  if (!data.full) body += '<p>El grupo todavÃ­a no estÃ¡ completo. RecibirÃ¡s un correo cuando se llenen las plazas.</p>';
  else body += '<h2>Participantes</h2><ul>' + data.members.map(m => '<li>' + escapeHtml_(m.name) + ' â€” ' + escapeHtml_(m.phone) + '</li>').join('') + '</ul><p>Usad estos datos solo para coordinar este regalo. No compartÃ¡is esta pÃ¡gina pÃºblicamente.</p>';
  return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Participantes Â· Carlos 30</title>' + pageStyles_() + '</head><body><main class="message">' + body + '</main></body></html>').setTitle('Participantes del regalo grupal').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function messagePage_(message, ok, language) {
  const lang = normalizePageLanguage_(language);
  const titleEs = ok ? 'Confirmaci\u00f3n' : 'Atenci\u00f3n';
  const titleDe = ok ? 'Best\u00e4tigung' : 'Hinweis';
  const headingEs = ok ? '\u00a1Listo!' : 'Atenci\u00f3n';
  const headingDe = ok ? 'Geschafft!' : 'Hinweis';
  const messageEs = ok ? '\u00a1Correo verificado! Tu reserva est\u00e1 confirmada.' : 'No se pudo confirmar la reserva. El enlace puede no ser v\u00e1lido o haber caducado.';
  const messageDe = ok ? 'E-Mail best\u00e4tigt! Deine Reservierung ist best\u00e4tigt.' : 'Die Reservierung konnte nicht best\u00e4tigt werden. Der Link ist m\u00f6glicherweise ung\u00fcltig oder abgelaufen.';
  const homeEs = 'Volver a la wishlist', homeDe = 'Zur Wunschliste';
  const html = '<!doctype html><html lang="' + lang + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title data-es="' + titleEs + ' · Carlos 30" data-de="' + titleDe + ' · Carlos 30">' + (lang === 'es' ? titleEs : titleDe) + ' · Carlos 30</title>' + pageStyles_() + '</head><body><main class="message">' + pageLanguageControl_(lang) + '<p class="eyebrow">CARLOS · 30</p><div class="mark">' + (ok ? '✓' : '!') + '</div><h1 data-es="' + escapeHtml_(headingEs) + '" data-de="' + escapeHtml_(headingDe) + '">' + escapeHtml_(lang === 'es' ? headingEs : headingDe) + '</h1><p data-es="' + escapeHtml_(messageEs) + '" data-de="' + escapeHtml_(messageDe) + '">' + escapeHtml_(lang === 'es' ? messageEs : messageDe) + '</p><a class="button" data-es="' + homeEs + '" data-de="' + homeDe + '" href="' + escapeHtml_(ScriptApp.getService().getUrl()) + '">' + (lang === 'es' ? homeEs : homeDe) + '</a></main>' + pageLanguageScript_() + '</body></html>';
  return HtmlService.createHtmlOutput(html).setTitle(APP_TITLE).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function normalizePageLanguage_(language) { return String(language || '').toLowerCase() === 'es' ? 'es' : 'de'; }
function pageLanguageControl_(language) {
  return '<div class="language-switch" aria-label="Language / Idioma">' +
    '<button type="button" data-page-lang="es" aria-pressed="' + (language === 'es') + '">ES</button>' +
    '<button type="button" data-page-lang="de" aria-pressed="' + (language === 'de') + '">DE</button></div>';
}
function pageLanguageScript_() {
  return '<script>(function(){function setLanguage(lang){document.documentElement.lang=lang;document.querySelectorAll("[data-es][data-de]").forEach(function(el){el.textContent=el.dataset[lang];});var title=document.querySelector("title[data-es][data-de]");if(title)document.title=title.dataset[lang];document.querySelectorAll("[data-page-lang]").forEach(function(b){var active=b.dataset.pageLang===lang;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active));});}document.querySelectorAll("[data-page-lang]").forEach(function(b){b.addEventListener("click",function(){setLanguage(b.dataset.pageLang);});});})();</script>';
}
function pageStyles_() { return '<style>@import url(https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap);*{box-sizing:border-box}body{margin:0;min-height:100vh;padding:24px;display:grid;place-items:center;background:#f8f3e9;color:#24241f;font:16px/1.6 "DM Sans",Arial,sans-serif}.message{width:min(100%,560px);padding:clamp(24px,6vw,48px);background:#fffdf8;border:1px solid #e8decd;border-radius:24px;box-shadow:0 20px 70px #392c1510}.language-switch{display:flex;justify-content:flex-end;gap:6px;margin:0 0 18px}.language-switch button{padding:6px 10px;background:transparent;color:#6e685d;border:1px solid #ded4c3;border-radius:999px;font:600 11px "DM Sans",Arial;cursor:pointer}.language-switch button.selected{background:#24241f;color:#fff;border-color:#24241f}.eyebrow{letter-spacing:.18em;font-size:11px;font-weight:600;color:#9a783c}.mark{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:#eee4d0;color:#8a6a31;font-size:25px}h1{font:500 clamp(30px,6vw,42px)/1.15 "Playfair Display",Georgia,serif;margin:12px 0}button,.button{display:inline-block;background:#24241f;color:white;border:0;border-radius:999px;padding:13px 20px;text-decoration:none;font:600 14px "DM Sans",Arial;cursor:pointer}button:disabled{opacity:.55}li{margin:8px 0}</style>'; }
function readObjects_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues(), headers = values[0].map(v => String(v || '').trim());
  return values.slice(1).filter(row => row.some(v => v !== '' && v !== null)).map(row => {
    const obj = {}; headers.forEach((h, i) => { if (h) obj[h] = row[i]; }); return obj;
  });
}
function appendObject_(sheet, headers, obj) {
  const actual = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0].map(v => String(v || '').trim());
  sheet.appendRow(actual.map(h => obj[h] === undefined ? '' : obj[h]));
}
function updateBooking_(sheet, rowNumber, changes) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0].map(v => String(v || '').trim());
  Object.keys(changes).forEach(key => { const col = headers.indexOf(key); if (col >= 0) sheet.getRange(rowNumber, col + 1).setValue(changes[key]); });
}
function updateObject_(sheet, rowNumber, values) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0].map(v => String(v || '').trim());
  headers.forEach((header, index) => {
    if (Object.prototype.hasOwnProperty.call(values, header)) {
      sheet.getRange(rowNumber, index + 1).setValue(values[header]);
    }
  });
}
function isHolding_(b, now) {
  if (String(b.estado) === 'confirmada') return true;
  if (String(b.estado) !== 'pendiente') return false;
  const expiry = new Date(b.fecha_expiracion).getTime(); return Number.isFinite(expiry) && expiry > now;
}
function isActive_(value) { return !['false', 'no', '0', 'inactivo', 'nein'].includes(String(value).trim().toLowerCase()); }
function normalizeGiftType_(value) {
  const type = String(value || '').trim().toLowerCase();
  if (['grupal', 'group', 'gruppen', 'gruppengeschenk'].includes(type)) return 'grupal';
  if (['gutschein', 'gutscheine', 'gutshein', 'gutsheine', 'voucher', 'gift card', 'giftcard', 'vale', 'vale regalo', 'cheque regalo'].includes(type)) return 'gutschein';
  return 'individual';
}
function clean_(value, max) { return String(value || '').trim().replace(/[<>\u0000-\u001F]/g, '').slice(0, max); }
function safeHttpUrl_(value) { const s = String(value || '').trim(); return /^https?:\/\/[^\s]+$/i.test(s) ? s : ''; }
function actionUrl_(action, token) { return ScriptApp.getService().getUrl() + '?action=' + encodeURIComponent(action) + '&token=' + encodeURIComponent(token); }
function frontendActionUrl_(action, token, language) { return FRONTEND_URL + '?action=' + encodeURIComponent(action) + '&token=' + encodeURIComponent(token) + '&lang=' + normalizePageLanguage_(language); }
function newToken_() { return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, ''); }
function sendGiftEmail_(to, subject, paragraphs, buttons) {
  const textBody = paragraphs.join('\n\n') + '\n\n' + buttons.map(button => button.label + ':\n' + button.url).join('\n\n');
  const htmlBody = '<div style="max-width:560px;margin:0 auto;padding:28px;background:#fffdf8;color:#292720;font:16px/1.7 Arial,sans-serif">' +
    paragraphs.map(paragraph => '<p style="margin:0 0 16px">' + escapeHtml_(paragraph) + '</p>').join('') +
    '<div style="margin:28px 0">' + buttons.map(button => '<p style="margin:0 0 12px"><a href="' + escapeHtml_(button.url) + '" style="display:inline-block;padding:12px 18px;border-radius:4px;background:#292720;color:#fff;text-decoration:none">' + escapeHtml_(button.label) + '</a></p>').join('') +
    '</div></div>';
  try {
    MailApp.sendEmail({ to, subject, body: textBody, htmlBody });
    return true;
  } catch (err) {
    console.error('No se pudo enviar el correo: ' + (err && err.message ? err.message : err));
    return false;
  }
}
function cancelById_(id) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Reservas'), bookings = readObjects_(sheet), i = bookings.findIndex(b => String(b.id_reserva) === String(id)); if (i >= 0) updateBooking_(sheet, i + 2, { estado: 'cancelada', token_verificacion: '' }); }
function escapeHtml_(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
