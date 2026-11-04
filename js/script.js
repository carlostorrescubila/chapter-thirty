const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? getText('menuClose') : getText('menuOpen'));
    menuButton.textContent = isOpen ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', getText('menuOpen'));
    menuButton.textContent = '☰';
  }));
}

const translations = {
  es: {
    pageTitle: 'Carlos · 30 años', wordmark: 'CARLOS · 30 AÑOS', menuOpen: 'Abrir menú', menuClose: 'Cerrar menú',
    home: 'INICIO', wishlist: 'WISHLIST',
    rsvpTitle: 'Confirma tu asistencia',
    rsvpClosed: 'El plazo para confirmar asistencia ya terminó.',
    rsvpFirstName: 'Nombre', rsvpLastName: 'Apellido', rsvpEmail: 'Correo electrónico', rsvpHasGuest: 'Vengo con alguien',
    rsvpGuestFirstName: 'Nombre del acompañante', rsvpGuestLastName: 'Apellido del acompañante',
    rsvpSubmit: 'Confirmar asistencia',
    rsvpSending: 'Enviando confirmación…', rsvpSuccess: 'Tu asistencia está confirmada. Te enviamos un correo',
    rsvpSuccessUpdated: 'Tu confirmación se actualizó. Se te envió un correo',
    rsvpEmailFailed: 'Tu asistencia quedó guardada, pero no se pudo enviar el correo de confirmación',
    rsvpError: 'No se pudo enviar la confirmación. Inténtalo de nuevo más tarde.',
    wishlistTitle: 'Si quieres tener un detalle',
    wishlistLead1: 'Los regalos no son obligatorios. Aun así, siempre se agradecen y se reciben con mucha ilusión.',
    wishlistLead2: 'Si quieres tener un detalle y no sabes qué regalarme, aquí tienes algunas ideas. También puedes sorprenderme con cualquier otro regalo.',
    wishlistLead3: 'Sobre todo, recuerda que lo más importante no es el regalo. Lo importante es compartir un momento alegre, disfrutar de la celebración y crear bonitos recuerdos.',
    giftFiltersLabel: 'Filtrar regalos', filterAll: 'Todos', filterIndividual: 'Individuales', filterGroup: 'Grupales', filterVoucher: 'Tarjetas regalo',
    wishlistFilterEmpty: 'No hay regalos en esta categoría.',
    wishlistLoading: 'Cargando la wishlist …', wishlistEmpty: 'Ahora mismo no hay regalos disponibles.',
    wishlistError: 'No se ha podido cargar la wishlist. Inténtalo de nuevo más tarde.',
    wishlistDataError: 'Apps Script no pudo leer los datos. Comprueba que existan las pestañas Regalos y Reservas y que el proyecto tenga acceso a la hoja.',
    wishlistConnectionError: 'No se pudo conectar con Apps Script. Comprueba que la implementación esté activa y permita el acceso a cualquiera.',
    wishlistNote: 'Gracias por celebrar conmigo ♡',
    giftIndividual: 'Regalo individual', giftGroup: 'Regalo grupal', giftVoucher: 'Tarjeta regalo', giftIndividualAvailable: 'Regalo disponible', giftVoucherAvailable: 'Tarjeta regalo disponible', giftVoucherRecommendation: 'Recomiéndame tu restaurante favorito; yo pongo el apetito.', giftAvailable: n => `${n} plazas disponibles`,
    giftReserved: 'Ya reservado', giftSoloTaken: 'Regalo reservado por una persona', giftReserve: 'Reservar regalo', giftReserveSlot: 'Reservar una plaza', giftReserveSolo: 'Regalarlo yo solo', giftDetails: 'Ver regalo',
    giftName: 'Tu nombre', giftEmail: 'Correo electrónico', giftPhone: 'Teléfono',
    giftConsent: 'Acepto que mis datos de contacto se compartan con los demás participantes cuando el grupo esté completo.',
    giftCommitment: 'Al confirmar, me comprometo a regalar este artículo. Quedará reservado para mí y otros invitados no podrán elegirlo. Si cambio de opinión, cancelaré la reserva para que otra persona pueda regalarlo.',
    giftGroupCommitment: 'Al confirmar, me comprometo a participar en este regalo grupal. Mi plaza quedará reservada y contará para completar el grupo. Si cambio de opinión, cancelaré la reserva para que otra persona pueda ocuparla.',
    giftSubmit: 'Solicitar reserva', giftCancel: 'Cancelar', giftSending: 'Enviando …',
    giftSuccess: 'Te enviamos un correo para confirmar que te comprometes a regalar este artículo. Al confirmar, quedará reservado para ti. Si cambias de opinión, podrás cancelarlo desde el enlace del correo.',
    giftGroupSuccess: 'Te enviamos un correo para confirmar tu compromiso de participar en este regalo grupal. Al confirmar, tu plaza quedará reservada. Si cambias de opinión, podrás cancelarla desde el enlace del correo.',
    giftNoSlots: 'Ya reservado', giftPrice: 'Precio',
    eyebrow: 'CARLOS · 30 AÑOS', headline: '¡Brindemos por mis 30!', cakeAlt: 'Tarta de cumpleaños',
    subtitle: 'Una nueva década y la ocasión perfecta para reunirnos, brindar y celebrar juntos.',
    dateLabel: 'Fecha', timeLabel: 'Hora', placeLabel: 'Lugar', directions: 'CÓMO LLEGAR',
    giftsOptional: 'Los regalos son completamente opcionales.',
    footer: '¡Nos vemos pronto!', backToTop: 'Volver arriba ↑'
  },
  de: {
    pageTitle: 'Carlos · 30 Jahre', wordmark: 'CARLOS · 30 JAHRE', menuOpen: 'Menü öffnen', menuClose: 'Menü schließen',
    home: 'START', wishlist: 'WUNSCHLISTE',
    rsvpTitle: 'Bitte bestätige deine Teilnahme',
    rsvpClosed: 'Die Frist für die Teilnahmebestätigung ist abgelaufen.',
    rsvpFirstName: 'Vorname', rsvpLastName: 'Nachname', rsvpEmail: 'E-Mail-Adresse', rsvpHasGuest: 'Ich komme in Begleitung',
    rsvpGuestFirstName: 'Vorname der Begleitperson', rsvpGuestLastName: 'Nachname der Begleitperson',
    rsvpSubmit: 'Teilnahme bestätigen',
    rsvpSending: 'Bestätigung wird gesendet…', rsvpSuccess: 'Deine Teilnahme ist bestätigt. Du hast eine E-Mail erhalten',
    rsvpSuccessUpdated: 'Deine Teilnahme wurde aktualisiert. Du hast eine E-Mail erhalten',
    rsvpEmailFailed: 'Deine Teilnahme wurde gespeichert, aber die Bestätigungs-E-Mail konnte nicht gesendet werden',
    rsvpError: 'Die Bestätigung konnte nicht gesendet werden. Bitte versuche es später erneut.',
    wishlistTitle: 'Falls du mir etwas schenken möchtest',
    wishlistLead1: 'Geschenke sind absolut kein Muss, aber ich freue mich natürlich immer sehr darüber und nehme sie mit großer Freude entgegen.',
    wishlistLead2: 'Falls du mir etwas schenken möchtest und noch keine Idee hast, findest du hier ein paar Vorschläge. Natürlich kannst du mich auch mit etwas anderem überraschen.',
    wishlistLead3: 'Und vor allem zählt, dass wir gemeinsam eine schöne Zeit verbringen, die Feier genießen und schöne Erinnerungen schaffen. Ein Geschenk ist dabei nicht das Wichtigste.',
    giftFiltersLabel: 'Geschenke filtern', filterAll: 'Alle', filterIndividual: 'Einzelgeschenke', filterGroup: 'Gruppengeschenke', filterVoucher: 'Gutscheine',
    wishlistFilterEmpty: 'In dieser Kategorie gibt es keine Geschenke.',
    wishlistLoading: 'Die Wunschliste wird geladen …', wishlistEmpty: 'Im Moment sind keine Geschenke verfügbar.',
    wishlistError: 'Die Wunschliste konnte nicht geladen werden. Bitte versuche es später erneut.',
    wishlistDataError: 'Apps Script konnte die Daten nicht lesen. Prüfe, ob die Tabellenblätter Regalos und Reservas vorhanden sind und das Projekt Zugriff auf die Tabelle hat.',
    wishlistConnectionError: 'Es konnte keine Verbindung zu Apps Script hergestellt werden. Prüfe, ob die Bereitstellung aktiv ist und für alle zugänglich ist.',
    wishlistNote: 'Danke, dass du mit mir feierst ♡',
    giftIndividual: 'Einzelgeschenk', giftGroup: 'Gruppengeschenk', giftVoucher: 'Gutschein', giftIndividualAvailable: 'Geschenk verfügbar', giftVoucherAvailable: 'Gutschein verfügbar', giftVoucherRecommendation: 'Verrate mir dein Lieblingsrestaurant, ich bringe den Appetit mit.', giftAvailable: n => `${n} Plätze verfügbar`,
    giftReserved: 'Bereits reserviert', giftSoloTaken: 'Als Einzelgeschenk reserviert', giftReserve: 'Geschenk reservieren', giftReserveSlot: 'Platz reservieren', giftReserveSolo: 'Geschenk allein übernehmen', giftDetails: 'Geschenk ansehen',
    giftName: 'Dein Name', giftEmail: 'E-Mail-Adresse', giftPhone: 'Telefonnummer',
    giftConsent: 'Ich bin einverstanden, dass meine Kontaktdaten mit den anderen Teilnehmenden geteilt werden, wenn die Gruppe vollständig ist.',
    giftCommitment: 'Mit der Bestätigung verpflichte ich mich, diesen Artikel zu schenken. Er wird für mich reserviert und ist für andere Gäste nicht mehr verfügbar. Falls ich es mir anders überlege, storniere ich die Reservierung, damit ein anderer Gast ihn schenken kann.',
    giftGroupCommitment: 'Mit der Bestätigung verpflichte ich mich, an diesem Gruppengeschenk teilzunehmen. Mein Platz wird reserviert und zählt zur Vervollständigung der Gruppe. Falls ich es mir anders überlege, storniere ich die Reservierung, damit jemand anderes meinen Platz übernehmen kann.',
    giftSubmit: 'Reservierung anfragen', giftCancel: 'Abbrechen', giftSending: 'Wird gesendet …',
    giftSuccess: 'Wir haben dir eine E-Mail geschickt. Bitte bestätige dort, dass du diesen Artikel schenken möchtest. Danach ist er für dich reserviert. Falls du es dir anders überlegst, kannst du über den Link in der E-Mail stornieren.',
    giftGroupSuccess: 'Wir haben dir eine E-Mail geschickt. Bitte bestätige dort deine Teilnahme an diesem Gruppengeschenk. Danach ist dein Platz reserviert. Falls du es dir anders überlegst, kannst du über den Link in der E-Mail stornieren.',
    giftNoSlots: 'Bereits reserviert', giftPrice: 'Preis',
    eyebrow: 'CARLOS · 30 JAHRE', headline: 'Auf die 30!', cakeAlt: 'Geburtstagstorte',
    subtitle: 'Ein neues Jahrzehnt – der perfekte Anlass, um zusammenzukommen, anzustoßen und gemeinsam zu feiern.',
    dateLabel: 'Datum', timeLabel: 'Uhrzeit', placeLabel: 'Ort', directions: 'ANFAHRT',
    giftsOptional: 'Geschenke sind vollkommen optional.',
    footer: 'Wir sehen uns bald!', backToTop: 'Nach oben ↑'
  }
};
let currentLanguage = 'de';

function getText(key) {
  return translations[currentLanguage]?.[key] ?? translations.de[key] ?? key;
}

let rsvpMessageKey = null;

function setLanguage(language) {
  if (!translations[language]) return;
  currentLanguage = language;
  document.documentElement.lang = language;

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (translations[language][key] && typeof translations[language][key] === 'string') element.textContent = translations[language][key];
  });
  updateGiftAvailabilityLanguage_();

  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    const key = element.dataset.i18nAriaLabel;
    if (translations[language][key]) element.setAttribute('aria-label', translations[language][key]);
  });

  document.querySelectorAll('[data-lang]').forEach(button => {
    const selected = button.dataset.lang === language;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  document.querySelectorAll('.nav a').forEach(link => link.classList.toggle('active', link.dataset.view === (location.hash === '#wishlist' ? 'wishlist' : 'home')));
  if (menuButton) menuButton.setAttribute('aria-label', getText(nav?.classList.contains('open') ? 'menuClose' : 'menuOpen'));
  const rsvpStatus = document.getElementById('rsvp-message');
  if (rsvpMessageKey && rsvpStatus) rsvpStatus.textContent = getText(rsvpMessageKey);
}

// Language selector: delegated handler also works if the header is re-rendered.
document.addEventListener('click', event => {
  const button = event.target.closest('[data-lang]');
  if (!button) return;

  const language = button.dataset.lang;
  if (!translations[language]) return;

  setLanguage(language);
  try { localStorage.setItem('carlos30-language', language); } catch (_) {}
});

// Restore the last selected language, falling back to German.
try {
  const savedLanguage = localStorage.getItem('carlos30-language');
  if (savedLanguage && translations[savedLanguage]) currentLanguage = savedLanguage;
} catch (_) {}
setLanguage(currentLanguage);


// Configure this once with the deployed Apps Script Web App URL ending in /exec.
const WISHLIST_API_URL = 'https://script.google.com/macros/s/AKfycby_jVAk8CFPaHnrLSjy-ByQEx0GU5y3_oOl_x85UkjSWzszn4j3G231bfh4b7-mb80Rcw/exec';
const wishlistSection = document.getElementById('wishlist');
const heroSection = document.getElementById('inicio');
const giftGrid = document.getElementById('gift-grid');
const wishlistStatus = document.getElementById('wishlist-status');
let currentGiftFilter = 'all';
let giftFilterAnimationId = 0;
document.querySelectorAll('[data-gift-filter]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.giftFilter === currentGiftFilter) return;
  currentGiftFilter = button.dataset.giftFilter;
  document.querySelectorAll('[data-gift-filter]').forEach(filterButton => {
    const selected = filterButton === button;
    filterButton.classList.toggle('is-active', selected);
    filterButton.setAttribute('aria-pressed', String(selected));
  });
  if (wishlistLoaded) renderGiftsWithTransition(lastLoadedGifts);
}));
let wishlistLoaded = false;
let lastLoadedGifts = [];
let openGiftFormId = null;
let openGiftFormMode = null;
let reservationFormSnapshot = null;
const confirmedGiftIds = new Set();
let requestCounter = 0;
const pendingRequests = new Map();
const rsvpForm = document.getElementById('rsvp-form');
const rsvpMessage = document.getElementById('rsvp-message');
const rsvpClosed = document.getElementById('rsvp-closed');
const rsvpHasGuest = document.getElementById('rsvp-has-guest');
const rsvpGuestFields = document.getElementById('rsvp-guest-fields');
let pendingRsvp = null;

function closeRsvpIfExpired() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const localDate = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const expired = `${localDate.year}-${localDate.month}-${localDate.day}` >= '2027-01-10';
  rsvpForm.hidden = expired;
  rsvpClosed.hidden = !expired;
  return expired;
}

closeRsvpIfExpired();
setInterval(closeRsvpIfExpired, 60000);
document.addEventListener('visibilitychange', closeRsvpIfExpired);

if (rsvpHasGuest && rsvpGuestFields) rsvpHasGuest.addEventListener('change', () => {
  const enabled = rsvpHasGuest.checked;
  rsvpGuestFields.hidden = !enabled;
  rsvpGuestFields.querySelectorAll('input').forEach(input => {
    input.disabled = !enabled;
    input.required = enabled;
    if (!enabled) input.value = '';
  });
});

if (rsvpForm) rsvpForm.addEventListener('submit', event => {
  event.preventDefault();
  if (closeRsvpIfExpired()) return;
  if (!apiConfigured() || pendingRsvp) return;
  const data = new FormData(rsvpForm);
  const requestId = 'a' + Date.now() + '_' + (++requestCounter);
  const hiddenForm = document.createElement('form');
  hiddenForm.method = 'POST'; hiddenForm.action = WISHLIST_API_URL;
  hiddenForm.target = 'wishlist-api-frame'; hiddenForm.style.display = 'none';
  const values = {action:'rsvp', firstName:data.get('firstName'), lastName:data.get('lastName'), email:data.get('email'), hasGuest:rsvpHasGuest.checked ? 'true' : 'false', guestFirstName:data.get('guestFirstName'), guestLastName:data.get('guestLastName'), language:currentLanguage, requestId};
  Object.entries(values).forEach(([name, value]) => {
    const input = document.createElement('input'); input.type = 'hidden'; input.name = name;
    input.value = String(value ?? ''); hiddenForm.appendChild(input);
  });
  document.body.appendChild(hiddenForm);
  pendingRsvp = {requestId, hiddenForm};
  rsvpMessageKey = 'rsvpSending';
  rsvpMessage.textContent = getText(rsvpMessageKey);
  rsvpForm.querySelector('[type="submit"]').disabled = true;
  hiddenForm.submit();
  setTimeout(() => {
    if (!pendingRsvp || pendingRsvp.requestId !== requestId) return;
    pendingRsvp.hiddenForm.remove(); pendingRsvp = null;
    rsvpForm.querySelector('[type="submit"]').disabled = false;
    rsvpMessageKey = 'rsvpError';
    rsvpMessage.textContent = getText(rsvpMessageKey); rsvpMessage.classList.add('error');
  }, 25000);
});

function showView(view, updateHash = true) {
  const wishlist = view === 'wishlist';
  if (wishlistSection) wishlistSection.hidden = !wishlist;
  if (heroSection) heroSection.hidden = wishlist;
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.dataset.view === (wishlist ? 'wishlist' : 'home')));
  if (updateHash) history.replaceState(null, '', location.pathname + location.search + (wishlist ? '#wishlist' : ''));
  if (wishlist && !wishlistLoaded) loadWishlist();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

document.querySelectorAll('[data-view="wishlist"]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault(); showView('wishlist');
}));
document.querySelectorAll('.nav a[data-view="home"], .wordmark').forEach(link => link.addEventListener('click', e => {
  e.preventDefault(); showView('home');
}));
document.querySelector('footer .back-to-top')?.addEventListener('click', event => {
  event.preventDefault();
  const wishlistIsVisible = wishlistSection && !wishlistSection.hidden;
  history.replaceState(null, '', location.pathname + location.search + (wishlistIsVisible ? '#wishlist' : ''));
  window.scrollTo({top: 0, behavior: 'smooth'});
});
window.addEventListener('hashchange', () => showView(location.hash === '#wishlist' ? 'wishlist' : 'home', false));

function apiConfigured() {
  return WISHLIST_API_URL.startsWith('https://script.google.com/macros/s/') && WISHLIST_API_URL.endsWith('/exec');
}
function loadWishlist() {
  if (!apiConfigured()) {
    wishlistStatus.textContent = currentLanguage === 'es'
      ? 'Falta configurar la URL de Google Apps Script en js/script.js.'
      : 'Bitte trage zuerst die Google-Apps-Script-URL in js/script.js ein.';
    return;
  }
  wishlistStatus.textContent = getText('wishlistLoading');
  const callback = 'wishlistCallback' + (++requestCounter);
  const script = document.createElement('script');
  const timeout = setTimeout(() => { cleanup(); wishlistStatus.textContent = getText('wishlistConnectionError'); }, 15000);
  function cleanup() { clearTimeout(timeout); delete window[callback]; script.remove(); }
  window[callback] = gifts => {
    cleanup(); wishlistLoaded = true;
    if (!Array.isArray(gifts)) { wishlistStatus.textContent = getText(gifts && gifts.error === 'backend' ? 'wishlistDataError' : 'wishlistError'); return; }
    renderGifts(gifts);
  };
  script.onerror = () => { cleanup(); wishlistStatus.textContent = getText('wishlistConnectionError'); };
  script.src = WISHLIST_API_URL + '?action=wishlist&callback=' + callback + '&_=' + Date.now();
  document.head.appendChild(script);
}
function renderGifts(gifts) {
  lastLoadedGifts = gifts;
  giftGrid.replaceChildren();
  if (!gifts.length) { wishlistStatus.dataset.i18n = 'wishlistEmpty'; wishlistStatus.textContent = getText('wishlistEmpty'); return; }
  const visibleGifts = currentGiftFilter === 'all' ? gifts : gifts.filter(gift => normalizeGiftType(gift.type) === currentGiftFilter);
  if (!visibleGifts.length) { wishlistStatus.dataset.i18n = 'wishlistFilterEmpty'; wishlistStatus.textContent = getText('wishlistFilterEmpty'); return; }
  delete wishlistStatus.dataset.i18n;
  wishlistStatus.textContent = '';
  visibleGifts.forEach(gift => {
    const giftType = normalizeGiftType(gift.type);
    const voucherName = String(gift.name || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
    const reusableGoldVoucher = giftType === 'gutschein' && voucherName.includes('dein geheimtipp fur gutes essen');
    const card = document.createElement('article'); card.className = 'gift-card';
    if (giftType === 'gutschein') card.classList.add('gift-voucher');
    const imageWrap = document.createElement('div'); imageWrap.className = 'gift-image-wrap';
    if (gift.image) { const img = document.createElement('img'); img.className = 'gift-image'; img.src = gift.image; img.alt = gift.name || ''; img.loading = 'lazy'; imageWrap.appendChild(img); }
    else { imageWrap.textContent = '♡'; imageWrap.style.fontSize = '48px'; imageWrap.style.color = '#b69a67'; }
    card.appendChild(imageWrap);
    const type = document.createElement('p'); type.className = 'gift-type'; type.dataset.i18n = giftType === 'grupal' ? 'giftGroup' : giftType === 'gutschein' ? 'giftVoucher' : 'giftIndividual'; type.textContent = getText(type.dataset.i18n); card.appendChild(type);
    const title = document.createElement('h2'); title.textContent = gift.name || 'Geschenk'; card.appendChild(title);
    if (gift.price) { const price = document.createElement('p'); price.className = 'gift-meta'; const label = document.createElement('span'); label.dataset.i18n = 'giftPrice'; label.textContent = getText('giftPrice'); price.append(label, document.createTextNode(': ' + gift.price)); card.appendChild(price); }
    const avail = document.createElement('p'); avail.className = 'gift-availability';
    avail.dataset.availability = reusableGoldVoucher ? 'giftVoucherRecommendation' : giftType === 'grupal' && gift.soloReserved ? 'giftReserved' : !gift.available ? (giftType === 'grupal' && Number(gift.reserved) > 0 ? 'giftReserved' : 'giftNoSlots') : giftType === 'grupal' ? 'giftAvailable' : giftType === 'gutschein' ? 'giftVoucherAvailable' : 'giftIndividualAvailable';
    avail.dataset.remaining = String(gift.remaining || 0);
    avail.textContent = getGiftAvailabilityText_(avail);
    card.appendChild(avail);
    const actions = document.createElement('div'); actions.className = 'gift-actions';
    if (gift.link) { const details = document.createElement('a'); details.className = 'button'; details.href = gift.link; details.target = '_blank'; details.rel = 'noopener noreferrer'; const label = document.createElement('span'); label.dataset.i18n = 'giftDetails'; label.textContent = getText('giftDetails'); details.append(label, document.createTextNode(' ↗')); actions.appendChild(details); }
    const canReserve = gift.available && !(giftType === 'grupal' && gift.soloReserved);
    const soloAvailable = giftType === 'grupal' && !gift.soloReserved && (gift.soloAvailable === undefined ? Number(gift.reserved) === 0 : gift.soloAvailable);
    const showReservationForm = mode => {
      const isSameForm = openGiftFormId === String(gift.id) && openGiftFormMode === mode;
      openGiftFormId = isSameForm ? null : String(gift.id);
      openGiftFormMode = openGiftFormId ? mode : null;
      reservationFormSnapshot = null;
      renderGifts(gifts);
      if (openGiftFormId) { const form = document.getElementById('gift-form-' + CSS.escape(openGiftFormId)); if (form) form.scrollIntoView({behavior:'smooth',block:'nearest'}); }
    };
    if (reusableGoldVoucher) {
      // This multi-store voucher does not need a reservation.
    } else if (giftType === 'grupal') {
      const reserveSlot = document.createElement('button'); reserveSlot.type = 'button'; reserveSlot.disabled = !canReserve; reserveSlot.dataset.i18n = canReserve ? 'giftReserveSlot' : 'giftReserved';
      reserveSlot.textContent = getText(reserveSlot.dataset.i18n);
      reserveSlot.addEventListener('click', () => showReservationForm('grupo'));
      const reserveSolo = document.createElement('button'); reserveSolo.type = 'button'; reserveSolo.className = 'solo-reserve'; reserveSolo.disabled = !soloAvailable; reserveSolo.dataset.i18n = soloAvailable ? 'giftReserveSolo' : 'giftReserved';
      reserveSolo.textContent = getText(reserveSolo.dataset.i18n);
      reserveSolo.addEventListener('click', () => showReservationForm('solo'));
      actions.append(reserveSlot, reserveSolo);
    } else {
      const reserve = document.createElement('button'); reserve.type = 'button'; reserve.disabled = !canReserve; reserve.dataset.i18n = canReserve ? 'giftReserve' : 'giftReserved';
      reserve.textContent = getText(reserve.dataset.i18n);
      reserve.addEventListener('click', () => showReservationForm('individual'));
      actions.appendChild(reserve);
    }
    card.appendChild(actions);
    const currentMode = giftType === 'grupal' ? openGiftFormMode : 'individual';
    const modeAllowed = currentMode === 'solo' ? soloAvailable : canReserve;
    if (openGiftFormId === String(gift.id) && modeAllowed) card.appendChild(makeReservationForm(gift, currentMode));
    giftGrid.appendChild(card);
  });
}
function getGiftAvailabilityText_(element) {
  const key = element.dataset.availability;
  return key === 'giftAvailable' ? getText(key)(Number(element.dataset.remaining) || 0) : getText(key);
}
function updateGiftAvailabilityLanguage_() {
  document.querySelectorAll('.gift-availability[data-availability]').forEach(element => {
    element.textContent = getGiftAvailabilityText_(element);
  });
}
function renderGiftsPreservingReservation() {
  const oldForm = openGiftFormId && document.getElementById('gift-form-' + CSS.escape(openGiftFormId));
  let snapshot = reservationFormSnapshot && reservationFormSnapshot.giftId === openGiftFormId ? reservationFormSnapshot : null;
  if (oldForm) {
    const oldMessage = oldForm.querySelector('.gift-form-message');
    snapshot = {
      giftId: openGiftFormId,
      fields: Array.from(oldForm.elements).filter(el => el.name).map(el => ({name:el.name, value:el.value, checked:el.checked, disabled:el.disabled})),
      message: oldMessage ? oldMessage.textContent : '',
      statusKey: oldMessage ? oldMessage.dataset.statusKey || '' : '',
      error: !!(oldMessage && oldMessage.classList.contains('error')),
      submitDisabled: !!oldForm.querySelector('[type="submit"]')?.disabled
    };
    reservationFormSnapshot = snapshot;
  }
  renderGifts(lastLoadedGifts);
  if (!snapshot || !openGiftFormId) return;
  const form = document.getElementById('gift-form-' + CSS.escape(openGiftFormId));
  if (!form) return;
  snapshot.fields.forEach(saved => {
    const field = form.elements.namedItem(saved.name);
    if (!field) return;
    if (field.type === 'checkbox' || field.type === 'radio') field.checked = saved.checked;
    else field.value = saved.value;
    field.disabled = saved.disabled;
  });
  const message = form.querySelector('.gift-form-message');
  if (message) {
    message.dataset.statusKey = snapshot.statusKey;
    message.textContent = snapshot.statusKey ? getText(snapshot.statusKey) : snapshot.message;
    message.classList.toggle('error', snapshot.error);
  }
  const submit = form.querySelector('[type="submit"]');
  if (submit) submit.disabled = snapshot.submitDisabled;
  if (confirmedGiftIds.has(String(openGiftFormId))) {
    if (message) { message.dataset.statusKey = 'giftSuccess'; message.textContent = getText('giftSuccess'); }
    if (submit) submit.disabled = true;
    form.querySelectorAll('input').forEach(input => input.disabled = true);
  }
  reservationFormSnapshot = snapshot;
  pendingRequests.forEach(pending => {
    if (pending.form.id === form.id) {
      pending.form = form;
      pending.submit = submit;
      pending.message = message;
    }
  });
}
function renderGiftsWithTransition(gifts) {
  const animationId = ++giftFilterAnimationId;
  if (!giftGrid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    renderGifts(gifts);
    return;
  }
  giftGrid.classList.add('is-filtering-out');
  window.setTimeout(() => {
    if (animationId !== giftFilterAnimationId) return;
    renderGifts(gifts);
    giftGrid.classList.remove('is-filtering-out');
    giftGrid.classList.add('is-filtering-in');
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      if (animationId === giftFilterAnimationId) giftGrid.classList.remove('is-filtering-in');
    }));
  }, 180);
}
function normalizeGiftType(type) {
  const value = String(type || '').trim().toLowerCase();
  if (['grupal', 'group', 'gruppen', 'gruppengeschenk'].includes(value)) return 'grupal';
  if (['gutschein', 'gutscheine', 'gutshein', 'gutsheine', 'voucher', 'gift card', 'giftcard', 'vale', 'vale regalo', 'cheque regalo'].includes(value)) return 'gutschein';
  return 'individual';
}
function makeReservationForm(gift, reservationMode = 'individual') {
  const form = document.createElement('form'); form.className = 'gift-form'; form.id = 'gift-form-' + gift.id;
  const needsPhone = normalizeGiftType(gift.type) === 'grupal' && reservationMode === 'grupo';
  const fields = [['name','giftName','text',100],['email','giftEmail','email',200], ...(needsPhone ? [['phone','giftPhone','tel',35]] : [])];
  fields.forEach(([name,key,type,max]) => { const label=document.createElement('label'); const caption=document.createElement('span'); caption.dataset.i18n=key; caption.textContent=getText(key); const input=document.createElement('input'); input.name=name; input.type=type; input.maxLength=max; input.required=true; if(name==='phone') input.minLength=6; label.append(caption,input); form.appendChild(label); });
  const giftType = normalizeGiftType(gift.type);
  if (giftType === 'grupal' && reservationMode === 'grupo') {
    const consentLabel=document.createElement('label'); consentLabel.className='consent'; const consentInput=document.createElement('input'); consentInput.type='checkbox'; consentInput.name='groupConsent'; consentInput.required=true; consentLabel.appendChild(consentInput); const consentText=document.createElement('span'); consentText.dataset.i18n='giftConsent'; consentText.textContent=getText('giftConsent'); consentLabel.appendChild(consentText); form.appendChild(consentLabel);
    const commitmentLabel=document.createElement('label'); commitmentLabel.className='consent gift-commitment'; const commitmentInput=document.createElement('input'); commitmentInput.type='checkbox'; commitmentInput.name='giftCommitment'; commitmentInput.required=true; commitmentLabel.appendChild(commitmentInput); const commitmentText=document.createElement('span'); commitmentText.dataset.i18n='giftGroupCommitment'; commitmentText.textContent=getText('giftGroupCommitment'); commitmentLabel.appendChild(commitmentText); form.appendChild(commitmentLabel);
  }
  if (giftType !== 'grupal' || reservationMode === 'solo') { const label=document.createElement('label'); label.className='consent gift-commitment'; const input=document.createElement('input'); input.type='checkbox'; input.name='giftCommitment'; input.required=true; label.appendChild(input); const text=document.createElement('span'); text.dataset.i18n='giftCommitment'; text.textContent=getText('giftCommitment'); label.appendChild(text); form.appendChild(label); }
  const message=document.createElement('p'); message.className='gift-form-message'; message.setAttribute('role','status'); message.setAttribute('aria-live','polite'); form.appendChild(message);
  const buttons=document.createElement('div'); buttons.className='gift-actions'; const submit=document.createElement('button'); submit.type='submit'; submit.dataset.i18n='giftSubmit'; submit.textContent=getText('giftSubmit'); const cancel=document.createElement('button'); cancel.type='button'; cancel.className='button'; cancel.dataset.i18n='giftCancel'; cancel.textContent=getText('giftCancel'); cancel.addEventListener('click',()=>{openGiftFormId=null; openGiftFormMode=null; if(wishlistLoaded) loadWishlist();}); buttons.append(submit,cancel); form.appendChild(buttons);
  if (confirmedGiftIds.has(String(gift.id))) {
    const successKey = reservationMode === 'grupo' ? 'giftGroupSuccess' : 'giftSuccess';
    message.dataset.statusKey = successKey; message.dataset.i18n = successKey; message.textContent = getText(successKey);
    submit.disabled = true;
    form.querySelectorAll('input').forEach(input => input.disabled = true);
  }
  form.addEventListener('submit', e => { e.preventDefault(); submitReservation(form,gift,submit,message,reservationMode); });
  return form;
}
function submitReservation(form,gift,submit,message,reservationMode='individual') {
  if (!apiConfigured()) { message.dataset.i18n='wishlistError'; message.textContent=getText('wishlistError'); message.classList.add('error'); return; }
  const data=new FormData(form); const requestId='r'+Date.now()+'_'+(++requestCounter); const iframe=document.getElementById('wishlist-api-frame');
  const hiddenForm=document.createElement('form'); hiddenForm.method='POST'; hiddenForm.action=WISHLIST_API_URL; hiddenForm.target='wishlist-api-frame'; hiddenForm.style.display='none';
  const values={action:'reserve',giftId:gift.id,name:data.get('name'),email:data.get('email'),phone:data.get('phone'),groupConsent:data.get('groupConsent')==='on'?'true':'false',giftCommitment:data.get('giftCommitment')==='on'?'true':'false',reservationMode,language:currentLanguage,requestId};
  Object.entries(values).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=String(value??'');hiddenForm.appendChild(input);});
  document.body.appendChild(hiddenForm); pendingRequests.set(requestId,{form,submit,message,hiddenForm,iframe}); submit.disabled=true; message.classList.remove('error'); message.dataset.statusKey='giftSending'; message.dataset.i18n='giftSending'; message.textContent=getText('giftSending'); reservationFormSnapshot = null; hiddenForm.submit();
  setTimeout(()=>{const pending=pendingRequests.get(requestId);if(pending){pendingRequests.delete(requestId);pending.hiddenForm.remove();pending.submit.disabled=false;pending.message.dataset.statusKey='wishlistError';pending.message.dataset.i18n='wishlistError';pending.message.textContent=getText('wishlistError');pending.message.classList.add('error');}},25000);
}
window.addEventListener('message', event => {
  const data=event.data; if(!data || !data.requestId) return;
  if (data.type === 'carlos30-rsvp-result' && pendingRsvp && data.requestId === pendingRsvp.requestId) {
    pendingRsvp.hiddenForm.remove(); pendingRsvp = null;
    const submit = rsvpForm.querySelector('[type="submit"]'); submit.disabled = false;
    const successKey = data.code === 'updated' ? 'rsvpSuccessUpdated' : data.code === 'email_failed' ? 'rsvpEmailFailed' : 'rsvpSuccess';
    rsvpMessageKey = data.success ? successKey : 'rsvpError';
    rsvpMessage.textContent = getText(rsvpMessageKey);
    rsvpMessage.classList.toggle('error', !data.success);
    if (data.success) { submit.disabled = true; rsvpForm.querySelectorAll('input').forEach(input => input.disabled = true); }
    return;
  }
  if(data.type!=='carlos30-reservation-result') return;
  const pending=pendingRequests.get(data.requestId); if(!pending) return;
  pendingRequests.delete(data.requestId); pending.hiddenForm.remove(); pending.submit.disabled=false;
  const successKey = pending.form.elements.namedItem('groupConsent') ? 'giftGroupSuccess' : 'giftSuccess';
  pending.message.dataset.statusKey = data.success ? successKey : '';
  if (data.success) pending.message.dataset.i18n = successKey;
  else delete pending.message.dataset.i18n;
  pending.message.textContent=data.success ? getText(successKey) : (data.message || getText('wishlistError')); pending.message.classList.toggle('error',!data.success);
  if(data.success){ confirmedGiftIds.add(String(pending.form.id.replace(/^gift-form-/,''))); pending.submit.disabled=true; pending.form.querySelectorAll('input').forEach(input=>input.disabled=true); }
  reservationFormSnapshot = null;
});

setLanguage(currentLanguage);
if (location.hash === '#wishlist') showView('wishlist', false);
else if (location.hash === '#inicio') history.replaceState(null, '', location.pathname + location.search);

function showPublicReservationAction() {
  const params = new URLSearchParams(location.search);
  const action = params.get('action');
  const token = params.get('token') || '';
  if (!['verify', 'cancel', 'group'].includes(action)) return;

  let language = params.get('lang') === 'es' ? 'es' : 'de';
  setLanguage(language);
  document.body.classList.add('public-action-mode');

  const copy = {
    es: {
      verifyTitle:'Confirmar reserva', verifyIntro:'Estamos comprobando tu reserva', verifyBusy:'Comprobando reserva…',
      verifyOk:'Tu compromiso de regalar este artículo está confirmado. Queda reservado para ti y ya no está disponible para otros invitados. Si cambias de opinión, cancela la reserva desde el correo para que otra persona pueda elegirlo.', verifyFail:'No se pudo confirmar la reserva. El enlace puede no ser válido o haber caducado',
      verifyGroupOk:'Tu compromiso de participar en este regalo grupal está confirmado. Tu plaza queda reservada y cuenta para completar el grupo. Si cambias de opinión, cancélala desde el correo para que otra persona pueda ocuparla.',
      cancelTitle:'Cancelar reserva', cancelIntro:'¿Seguro que quieres cancelar tu reserva? La plaza volverá a estar disponible',
      cancelButton:'Sí, cancelar mi reserva', cancelBusy:'Cancelando reserva…', cancelOk:'Tu reserva se ha cancelado y la plaza vuelve a estar disponible',
      cancelFail:'No se pudo cancelar la reserva. Puede que ya esté cancelada o que el enlace no sea válido',
      groupTitle:'Regalo grupal', groupBusy:'Cargando participantes…', groupNotFull:'El grupo todavía no está completo', groupFail:'No se pudo cargar la información del grupo',
      back:'Volver a la wishlist',
    },
    de: {
      verifyTitle:'Reservierung bestätigen', verifyIntro:'Deine Reservierung wird überprüft', verifyBusy:'Reservierung wird überprüft…',
      verifyOk:'Deine Zusage, diesen Artikel zu verschenken, ist bestätigt. Er ist für dich reserviert und für andere Gäste nicht mehr verfügbar. Falls du es dir anders überlegst, storniere bitte über den Link in der E-Mail, damit ein anderer Gast ihn auswählen kann.', verifyFail:'Die Reservierung konnte nicht bestätigt werden. Der Link ist möglicherweise ungültig oder abgelaufen',
      verifyGroupOk:'Deine Zusage, an diesem Gruppengeschenk teilzunehmen, ist bestätigt. Dein Platz ist reserviert und zählt zur Vervollständigung der Gruppe. Falls du es dir anders überlegst, storniere bitte über den Link in der E-Mail, damit jemand anderes teilnehmen kann.',
      cancelTitle:'Reservierung stornieren', cancelIntro:'Möchtest du deine Reservierung wirklich stornieren? Der Platz wird danach wieder verfügbar',
      cancelButton:'Ja, meine Reservierung stornieren', cancelBusy:'Reservierung wird storniert…', cancelOk:'Deine Reservierung wurde storniert und der Platz ist wieder verfügbar',
      cancelFail:'Die Reservierung konnte nicht storniert werden. Vielleicht wurde sie bereits storniert oder der Link ist ungültig',
      groupTitle:'Gruppengeschenk', groupBusy:'Teilnehmende werden geladen…', groupNotFull:'Die Gruppe ist noch nicht vollständig', groupFail:'Die Gruppeninformationen konnten nicht geladen werden',
      back:'Zur Wunschliste',
    }
  };

  const page = document.createElement('section');
  page.className = 'public-action-page';
  const card = document.createElement('div'); card.className = 'public-action-card';
  const switcher = document.createElement('div'); switcher.className = 'public-action-languages';
  ['es','de'].forEach(lang => {
    const button = document.createElement('button'); button.type='button'; button.textContent=lang.toUpperCase(); button.classList.toggle('selected', lang === language);
    button.addEventListener('click', () => { language=lang; setLanguage(lang); switcher.querySelectorAll('button').forEach(el=>el.classList.toggle('selected',el.textContent.toLowerCase()===lang)); updateCopy(); });
    switcher.appendChild(button);
  });
  const eyebrow=document.createElement('p'); eyebrow.className='public-action-eyebrow'; eyebrow.textContent='CARLOS · 30';
  const mark=document.createElement('div'); mark.className='public-action-mark'; mark.textContent=action==='verify'?'✓':action==='cancel'?'↶':'♡';
  const title=document.createElement('h1');
  const description=document.createElement('p'); description.className='public-action-description';
  const status=document.createElement('p'); status.className='public-action-status'; status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  const participantList=document.createElement('ul'); participantList.className='public-action-participants';
  const button=document.createElement('button'); button.type='button'; button.className='public-action-button';
  const home=document.createElement('a'); home.className='public-action-home'; home.href='./';
  card.append(switcher,eyebrow,mark,title,description,participantList,button,status,home); page.appendChild(card); document.body.appendChild(page);

  let currentMessageKey = '';
  function updateCopy() {
    const t=copy[language];
    title.textContent=action==='verify'?t.verifyTitle:action==='cancel'?t.cancelTitle:t.groupTitle;
    description.textContent=action==='verify'?t.verifyIntro:action==='cancel'?t.cancelIntro:'';
    home.textContent=t.back;
    if(action==='cancel') button.textContent=t.cancelButton;
    if(currentMessageKey) status.textContent=t[currentMessageKey];
  }
  updateCopy();

  function sendCancelNotification(notificationToken, noticeLanguage) {
    const iframe = document.getElementById('wishlist-api-frame');
    if (!iframe || !apiConfigured()) return;
    const noticeForm = document.createElement('form');
    noticeForm.method = 'POST'; noticeForm.action = WISHLIST_API_URL; noticeForm.target = 'wishlist-api-frame'; noticeForm.style.display = 'none';
    const noticeId = 'cancel_notice_' + Date.now() + '_' + (++requestCounter);
    const values = { action: 'cancel-notify', token: notificationToken, language: noticeLanguage, requestId: noticeId };
    Object.entries(values).forEach(([name, value]) => {
      const input = document.createElement('input'); input.type = 'hidden'; input.name = name; input.value = String(value); noticeForm.appendChild(input);
    });
    document.body.appendChild(noticeForm);
    noticeForm.submit();
    window.setTimeout(() => noticeForm.remove(), 60000);
  }

  function submitAction() {
    if(!apiConfigured()){currentMessageKey=action==='cancel'?'cancelFail':action==='verify'?'verifyFail':'groupFail';updateCopy();return;}
    button.disabled=true;
    currentMessageKey=action==='cancel'?'cancelBusy':action==='verify'?'verifyBusy':'groupBusy';updateCopy();
    const requestId='page_'+Date.now()+'_'+(++requestCounter);
    const hiddenForm=document.createElement('form');hiddenForm.method='POST';hiddenForm.action=WISHLIST_API_URL;hiddenForm.target='wishlist-api-frame';hiddenForm.style.display='none';
    const values={action,token,language,requestId,deferNotifications:action==='cancel'?'true':''};
    Object.entries(values).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=String(value);hiddenForm.appendChild(input);});
    document.body.appendChild(hiddenForm);
    const onMessage=event=>{
      const data=event.data;if(!data||data.type!=='carlos30-page-action-result'||data.requestId!==requestId)return;
      window.removeEventListener('message',onMessage);hiddenForm.remove();button.disabled=false;
      if(action==='group'&&data.success&&data.data){
        participantList.replaceChildren();
        if(!data.data.full){currentMessageKey='groupNotFull';status.textContent=copy[language][currentMessageKey];}
        else {currentMessageKey='';status.textContent='';data.data.members.forEach(member=>{const li=document.createElement('li');li.textContent=member.phone?member.name+' · '+member.phone:member.name;participantList.appendChild(li);});}
        return;
      }
      if(action==='group'){
        currentMessageKey='groupFail';
        updateCopy();
        return;
      }
      currentMessageKey=action==='cancel'?(data.success?'cancelOk':'cancelFail'):(data.success?(data.data&&data.data.group?'verifyGroupOk':'verifyOk'):'verifyFail');
      updateCopy();
      if(action==='cancel'&&data.success&&data.data&&data.data.notificationToken) sendCancelNotification(data.data.notificationToken,language);
    };
    window.addEventListener('message',onMessage);
    hiddenForm.submit();
    window.setTimeout(()=>{
      if(!hiddenForm.isConnected)return;
      window.removeEventListener('message',onMessage);hiddenForm.remove();button.disabled=false;
      currentMessageKey=action==='cancel'?'cancelFail':action==='verify'?'verifyFail':'groupFail';updateCopy();
    },25000);
  }

  if(action==='cancel') button.addEventListener('click',submitAction);
  else { button.hidden=true; submitAction(); }
}
showPublicReservationAction();
