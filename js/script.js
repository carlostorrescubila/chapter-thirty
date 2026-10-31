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
    wishlistTitle: 'Si quieres tener un detalle',
    wishlistLead: 'Si te apetece regalarme algo, pero no sabes muy bien qué, aquí encontrarás algunas ideas que me harían mucha ilusión',
    wishlistLoading: 'Cargando la wishlist …', wishlistEmpty: 'Ahora mismo no hay regalos disponibles.',
    wishlistError: 'No se ha podido cargar la wishlist. Inténtalo de nuevo más tarde.', wishlistNote: 'Gracias por celebrar conmigo. ♡',
    giftIndividual: 'Regalo individual', giftGroup: 'Regalo grupal', giftAvailable: n => `${n} plazas disponibles`,
    giftReserved: 'Ya reservado', giftReserve: 'Reservar regalo', giftDetails: 'Ver regalo',
    giftName: 'Tu nombre', giftEmail: 'Correo electrónico', giftPhone: 'Teléfono',
    giftConsent: 'Acepto que mis datos de contacto se compartan con los demás participantes cuando el grupo esté completo.',
    giftSubmit: 'Solicitar reserva', giftCancel: 'Cancelar', giftSending: 'Enviando …',
    giftSuccess: '¡Casi listo! Confirma la reserva mediante el enlace que te hemos enviado por correo.',
    giftNoSlots: 'No quedan plazas disponibles.', giftPrice: 'Precio',
    eyebrow: 'CARLOS · 30 AÑOS', headline: '¡Brindemos por mis 30!', cakeAlt: 'Tarta de cumpleaños',
    subtitle: 'Una nueva década y la ocasión perfecta para reunirnos, brindar y celebrar juntos.',
    dateLabel: 'Fecha', timeLabel: 'Hora', placeLabel: 'Lugar', directions: 'CÓMO LLEGAR',
    footer: '¡Nos vemos pronto!', backToTop: 'Volver arriba ↑'
  },
  de: {
    pageTitle: 'Carlos · 30 Jahre', wordmark: 'CARLOS · 30 JAHRE', menuOpen: 'Menü öffnen', menuClose: 'Menü schließen',
    home: 'START', wishlist: 'WUNSCHLISTE',
    wishlistTitle: 'Falls du mir etwas schenken möchtest',
    wishlistLead: 'Falls du mir etwas schenken möchtest, aber nicht genau weißt, was hier findest du ein paar Ideen, über die ich mich sehr freuen würde.',
    wishlistLoading: 'Die Wunschliste wird geladen …', wishlistEmpty: 'Im Moment sind keine Geschenke verfügbar.',
    wishlistError: 'Die Wunschliste konnte nicht geladen werden. Bitte versuche es später erneut.', wishlistNote: 'Danke, dass du mit mir feierst. ♡',
    giftIndividual: 'Einzelgeschenk', giftGroup: 'Gruppengeschenk', giftAvailable: n => `${n} Plätze verfügbar`,
    giftReserved: 'Bereits reserviert', giftReserve: 'Geschenk reservieren', giftDetails: 'Geschenk ansehen',
    giftName: 'Dein Name', giftEmail: 'E-Mail-Adresse', giftPhone: 'Telefonnummer',
    giftConsent: 'Ich bin einverstanden, dass meine Kontaktdaten mit den anderen Teilnehmenden geteilt werden, wenn die Gruppe vollständig ist.',
    giftSubmit: 'Reservierung anfragen', giftCancel: 'Abbrechen', giftSending: 'Wird gesendet …',
    giftSuccess: 'Fast geschafft! Bitte bestätige deine Reservierung über den Link in der E-Mail.',
    giftNoSlots: 'Keine Plätze mehr verfügbar.', giftPrice: 'Preis',
    eyebrow: 'CARLOS · 30 JAHRE', headline: 'Auf die 30!', cakeAlt: 'Geburtstagstorte',
    subtitle: 'Ein neues Jahrzehnt – der perfekte Anlass, um zusammenzukommen, anzustoßen und gemeinsam zu feiern.',
    dateLabel: 'Datum', timeLabel: 'Uhrzeit', placeLabel: 'Ort', directions: 'ANFAHRT',
    footer: 'Wir sehen uns bald!', backToTop: 'Nach oben ↑'
  }
};
let currentLanguage = 'de';

function getText(key) {
  return translations[currentLanguage]?.[key] ?? translations.de[key] ?? key;
}

function setLanguage(language) {
  if (!translations[language]) return;
  currentLanguage = language;
  document.documentElement.lang = language;

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (translations[language][key] && typeof translations[language][key] === 'string') element.textContent = translations[language][key];
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    const key = element.dataset.i18nAriaLabel;
    if (translations[language][key]) element.setAttribute('aria-label', translations[language][key]);
  });

  document.querySelectorAll('[data-lang]').forEach(button => {
    const selected = button.dataset.lang === language;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  document.querySelectorAll('.nav a').forEach(link => link.classList.toggle('active', location.hash === '#wishlist' ? link.dataset.view === 'wishlist' : link.getAttribute('href') === '#inicio'));
  if (menuButton) menuButton.setAttribute('aria-label', getText(nav?.classList.contains('open') ? 'menuClose' : 'menuOpen'));
}

// Language selector: delegated handler also works if the header is re-rendered.
document.addEventListener('click', event => {
  const button = event.target.closest('[data-lang]');
  if (!button) return;

  const language = button.dataset.lang;
  if (!translations[language]) return;

  setLanguage(language);
  try { localStorage.setItem('carlos30-language', language); } catch (_) {}
  if (wishlistLoaded) renderGifts(lastLoadedGifts);
});

// Restore the last selected language, falling back to German.
try {
  const savedLanguage = localStorage.getItem('carlos30-language');
  if (savedLanguage && translations[savedLanguage]) currentLanguage = savedLanguage;
} catch (_) {}
setLanguage(currentLanguage);


// Configure this once with the deployed Apps Script Web App URL ending in /exec.
const WISHLIST_API_URL = 'https://script.google.com/macros/s/AKfycby44bNyy8dBlbwChf7CBkd9OuSipqe3Dc67bC1b2GpvLqx0EnJto5M7L0NPhIVRwpociA/exec';
const wishlistSection = document.getElementById('wishlist');
const heroSection = document.getElementById('inicio');
const giftGrid = document.getElementById('gift-grid');
const wishlistStatus = document.getElementById('wishlist-status');
let wishlistLoaded = false;
let lastLoadedGifts = [];
let openGiftFormId = null;
let requestCounter = 0;
const pendingRequests = new Map();

function showView(view, updateHash = true) {
  const wishlist = view === 'wishlist';
  if (wishlistSection) wishlistSection.hidden = !wishlist;
  if (heroSection) heroSection.hidden = wishlist;
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', wishlist ? a.dataset.view === 'wishlist' : a.getAttribute('href') === '#inicio'));
  if (updateHash) history.replaceState(null, '', wishlist ? '#wishlist' : '#inicio');
  if (wishlist && !wishlistLoaded) loadWishlist();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

document.querySelectorAll('[data-view="wishlist"]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault(); showView('wishlist');
}));
document.querySelectorAll('.nav a[href="#inicio"], .wordmark, footer a[href="#inicio"]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault(); showView('home');
}));
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
  const timeout = setTimeout(() => { cleanup(); wishlistStatus.textContent = getText('wishlistError'); }, 15000);
  function cleanup() { clearTimeout(timeout); delete window[callback]; script.remove(); }
  window[callback] = gifts => {
    cleanup(); wishlistLoaded = true;
    if (!Array.isArray(gifts)) { wishlistStatus.textContent = getText('wishlistError'); return; }
    renderGifts(gifts);
  };
  script.onerror = () => { cleanup(); wishlistStatus.textContent = getText('wishlistError'); };
  script.src = WISHLIST_API_URL + '?action=wishlist&callback=' + callback + '&_=' + Date.now();
  document.head.appendChild(script);
}
function renderGifts(gifts) {
  lastLoadedGifts = gifts;
  giftGrid.replaceChildren();
  if (!gifts.length) { wishlistStatus.textContent = getText('wishlistEmpty'); return; }
  wishlistStatus.textContent = '';
  gifts.forEach(gift => {
    const card = document.createElement('article'); card.className = 'gift-card';
    const imageWrap = document.createElement('div'); imageWrap.className = 'gift-image-wrap';
    if (gift.image) { const img = document.createElement('img'); img.className = 'gift-image'; img.src = gift.image; img.alt = gift.name || ''; img.loading = 'lazy'; imageWrap.appendChild(img); }
    else { imageWrap.textContent = '♡'; imageWrap.style.fontSize = '48px'; imageWrap.style.color = '#b69a67'; }
    card.appendChild(imageWrap);
    const type = document.createElement('p'); type.className = 'gift-type'; type.textContent = gift.type === 'grupal' ? getText('giftGroup') : getText('giftIndividual'); card.appendChild(type);
    const title = document.createElement('h2'); title.textContent = gift.name || 'Geschenk'; card.appendChild(title);
    if (gift.price) { const price = document.createElement('p'); price.className = 'gift-meta'; price.textContent = getText('giftPrice') + ': ' + gift.price; card.appendChild(price); }
    const avail = document.createElement('p'); avail.className = 'gift-availability'; avail.textContent = gift.available ? getText('giftAvailable')(gift.remaining) : getText('giftNoSlots'); card.appendChild(avail);
    const actions = document.createElement('div'); actions.className = 'gift-actions';
    if (gift.link) { const details = document.createElement('a'); details.className = 'button'; details.href = gift.link; details.target = '_blank'; details.rel = 'noopener noreferrer'; details.textContent = getText('giftDetails') + ' ↗'; actions.appendChild(details); }
    const reserve = document.createElement('button'); reserve.type = 'button'; reserve.disabled = !gift.available; reserve.textContent = gift.available ? getText('giftReserve') : getText('giftReserved');
    reserve.addEventListener('click', () => { openGiftFormId = openGiftFormId === String(gift.id) ? null : String(gift.id); renderGifts(gifts); if (openGiftFormId) { const form = document.getElementById('gift-form-' + CSS.escape(openGiftFormId)); if (form) form.scrollIntoView({behavior:'smooth',block:'nearest'}); } });
    actions.appendChild(reserve); card.appendChild(actions);
    if (openGiftFormId === String(gift.id) && gift.available) card.appendChild(makeReservationForm(gift));
    giftGrid.appendChild(card);
  });
}
function makeReservationForm(gift) {
  const form = document.createElement('form'); form.className = 'gift-form'; form.id = 'gift-form-' + gift.id;
  const fields = [['name','giftName','text',100],['email','giftEmail','email',200],['phone','giftPhone','tel',35]];
  fields.forEach(([name,key,type,max]) => { const label=document.createElement('label'); label.textContent=getText(key); const input=document.createElement('input'); input.name=name; input.type=type; input.maxLength=max; input.required=true; if(name==='phone') input.minLength=6; label.appendChild(input); form.appendChild(label); });
  if (gift.type === 'grupal') { const label=document.createElement('label'); label.className='consent'; const input=document.createElement('input'); input.type='checkbox'; input.name='groupConsent'; input.required=true; label.appendChild(input); const text=document.createElement('span'); text.textContent=getText('giftConsent'); label.appendChild(text); form.appendChild(label); }
  const message=document.createElement('p'); message.className='gift-form-message'; message.setAttribute('role','status'); message.setAttribute('aria-live','polite'); form.appendChild(message);
  const buttons=document.createElement('div'); buttons.className='gift-actions'; const submit=document.createElement('button'); submit.type='submit'; submit.textContent=getText('giftSubmit'); const cancel=document.createElement('button'); cancel.type='button'; cancel.className='button'; cancel.textContent=getText('giftCancel'); cancel.addEventListener('click',()=>{openGiftFormId=null; if(wishlistLoaded) loadWishlist();}); buttons.append(submit,cancel); form.appendChild(buttons);
  form.addEventListener('submit', e => { e.preventDefault(); submitReservation(form,gift,submit,message); });
  return form;
}
function submitReservation(form,gift,submit,message) {
  if (!apiConfigured()) { message.textContent=getText('wishlistError'); message.classList.add('error'); return; }
  const data=new FormData(form); const requestId='r'+Date.now()+'_'+(++requestCounter); const iframe=document.getElementById('wishlist-api-frame');
  const hiddenForm=document.createElement('form'); hiddenForm.method='POST'; hiddenForm.action=WISHLIST_API_URL; hiddenForm.target='wishlist-api-frame'; hiddenForm.style.display='none';
  const values={action:'reserve',giftId:gift.id,name:data.get('name'),email:data.get('email'),phone:data.get('phone'),groupConsent:data.get('groupConsent')==='on'?'true':'false',requestId};
  Object.entries(values).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=String(value??'');hiddenForm.appendChild(input);});
  document.body.appendChild(hiddenForm); pendingRequests.set(requestId,{form,submit,message,hiddenForm,iframe}); submit.disabled=true; message.classList.remove('error'); message.textContent=getText('giftSending'); hiddenForm.submit();
  setTimeout(()=>{if(pendingRequests.has(requestId)){pendingRequests.delete(requestId);hiddenForm.remove();submit.disabled=false;message.textContent=getText('wishlistError');message.classList.add('error');}},25000);
}
window.addEventListener('message', event => {
  const data=event.data; if(!data || data.type!=='carlos30-reservation-result' || !data.requestId) return;
  const pending=pendingRequests.get(data.requestId); if(!pending) return;
  pendingRequests.delete(data.requestId); pending.hiddenForm.remove(); pending.submit.disabled=false;
  pending.message.textContent=data.message || getText('wishlistError'); pending.message.classList.toggle('error',!data.success);
  if(data.success){ pending.submit.disabled=true; pending.form.querySelectorAll('input').forEach(input=>input.disabled=true); if(data.message) pending.message.textContent=getText('giftSuccess'); }
});

setLanguage(currentLanguage);
if (location.hash === '#wishlist') showView('wishlist', false);
