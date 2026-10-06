const primaryNavigation = [
  ['index.html', 'Home'],
  ['marine-electrical.html', 'Marine electrical'],
  ['electronics.html', 'Navigation systems'],
  ['power-systems.html', 'Onboard power'],
  ['calibration-commissioning.html', 'Calibration'],
  ['yacht-refit.html', 'Refit'],
  ['stories.html', 'Projects'],
  ['meet-the-team.html', 'Meet the team'],
];

document.querySelectorAll('.nav-links').forEach((navigation) => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navigation.replaceChildren(...primaryNavigation.map(([href, label]) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (href === currentPage) link.setAttribute('aria-current', 'page');
    return link;
  }));
});

document.querySelectorAll('a[href="meet-the-team.html"]').forEach((link) => {
  if (/^about(?: the team)?$/i.test(link.textContent.trim())) link.textContent = 'Meet the team';
});

document.querySelectorAll('.topbar > span').forEach((location) => {
  const link = document.createElement('a');
  link.className = 'topbar-location';
  link.href = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') ? '#location' : 'index.html#location';
  link.setAttribute('aria-label', 'Find Knight Marine at Universal Marina on the River Hamble');
  link.innerHTML = '<span>Based at</span><strong>Universal Marina · River Hamble</strong>';
  location.replaceWith(link);
});

document.querySelectorAll('.nav-cta').forEach((callToAction) => {
  callToAction.textContent = 'Get a quote';
});

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
  }));
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const pageHero = document.querySelector('main .page-hero');

if (pageHero) {
  const brandCards = [
    ['victron', 'power-systems.html', 'Victron Energy', 'assets/logos/victron-energy.png', 'Explore Victron Energy power systems'],
    ['garmin', 'electronics.html', 'Garmin', 'assets/logos/garmin-logo-official.png', 'Explore Garmin marine electronics'],
    ['raymarine', 'electronics.html', 'Raymarine', 'assets/logos/raymarine.jpg', 'Explore Raymarine marine electronics'],
    ['simrad', 'electronics.html', 'Simrad', 'assets/logos/simrad.png', 'Explore Simrad marine electronics'],
    ['fusion', 'fusion-audio.html', 'Fusion', 'assets/logos/fusion.png', 'Explore Fusion marine audio'],
    ['bg', 'electronics.html', 'B&G', 'assets/logos/bg.png', 'Explore B and G marine electronics'],
  ];

  const renderBrandCards = (hidden = false) => brandCards.map(([brandClass, href, alt, src, label]) => (
    `<a class="brand-carousel-card ${brandClass}" href="${href}"${hidden ? ' tabindex="-1"' : ` aria-label="${label}"`}><img src="${src}" alt="${hidden ? '' : alt}"></a>`
  )).join('');

  const brandStrip = document.createElement('section');
  brandStrip.className = 'page-brand-strip';
  brandStrip.setAttribute('aria-label', 'Marine technology brands Knight Marine installs and supports');
  brandStrip.innerHTML = `
    <div class="wrap page-brand-strip-inner">
      <div class="page-brand-strip-copy">
        <p class="eyebrow">Technology we install &amp; support</p>
        <strong>Trusted systems. Properly integrated.</strong>
      </div>
      <div class="brand-carousel page-brand-strip-carousel">
        <div class="brand-carousel-track">
          <div class="brand-carousel-set">${renderBrandCards()}</div>
          <div class="brand-carousel-set" aria-hidden="true">${renderBrandCards(true)}</div>
        </div>
      </div>
    </div>`;
  pageHero.insertAdjacentElement('afterend', brandStrip);
}

/*
  Reusable boat / project enquiry
  --------------------------------
  Set window.KM_ENQUIRY_CONFIG.endpoint before this file loads when a form
  endpoint is available. The UI and payload are deliberately isolated here so
  the backend can be connected without editing every page.
*/
const enquiryConfig = {
  endpoint: window.KM_ENQUIRY_CONFIG?.endpoint?.trim() || '',
};

const enquiryMarkup = `
  <dialog class="enquiry-dialog" id="boat-enquiry" aria-labelledby="enquiry-title">
    <div class="enquiry-shell">
      <button class="enquiry-close" type="button" aria-label="Close enquiry form">×</button>
      <div class="enquiry-heading">
        <p class="eyebrow">Start a conversation</p>
        <h2 id="enquiry-title">Tell us about your boat.</h2>
        <p>A few useful details will help the Knight Marine team understand your project.</p>
      </div>
      <form class="enquiry-form" novalidate>
        <input type="hidden" name="enquirySource" value="General website enquiry">
        <div class="enquiry-grid">
          <label><span>Name *</span><input name="name" autocomplete="name" required></label>
          <label><span>Email *</span><input type="email" name="email" autocomplete="email" required></label>
          <label><span>Phone number</span><input type="tel" name="phone" autocomplete="tel"></label>
          <label><span>Preferred contact</span><select name="preferredContact"><option>Email</option><option>Phone</option><option>Either</option></select></label>
          <label><span>Boat name</span><input name="boatName" autocomplete="off"></label>
          <label><span>Boat make / model</span><input name="boatModel" autocomplete="off"></label>
          <label><span>Boat length</span><input name="boatLength" placeholder="e.g. 40 ft" autocomplete="off"></label>
          <label><span>Current marina / location</span><input name="boatLocation" autocomplete="off"></label>
          <label class="enquiry-wide"><span>Type of work required</span><select name="workType"><option value="">Please select</option><option>Marine electrical assessment</option><option>Electrical diagnostics / repair</option><option>Onboard power system</option><option>Navigation electronics</option><option>Calibration / commissioning</option><option>Connectivity / networking</option><option>Yacht refit</option><option>Boat care</option><option>Commercial marine</option><option>Other</option></select></label>
          <label class="enquiry-wide"><span>Brief project description *</span><textarea name="projectDescription" rows="4" required placeholder="What would you like to improve, repair or install?"></textarea></label>
          <label class="enquiry-trap" aria-hidden="true"><span>Leave this empty</span><input name="website" tabindex="-1" autocomplete="off"></label>
        </div>
        <p class="enquiry-note">Or call our team directly on <a href="tel:02381112032">02381 112 032</a>.</p>
        <div class="enquiry-footer">
          <p class="enquiry-status" role="status" aria-live="polite"></p>
          <button class="button primary" type="submit">Send project details</button>
        </div>
      </form>
    </div>
  </dialog>`;

document.body.insertAdjacentHTML('beforeend', enquiryMarkup);

const enquiryWorkTypes = [
  'Marine electrical assessment',
  'Electrical diagnostics / repair',
  'Onboard power system',
  'Navigation electronics',
  'Calibration / commissioning',
  'Connectivity / networking',
  'Marine audio',
  'Yacht refit',
  'Boat care',
  'Commercial marine',
  'Other',
];

const pageWorkTypes = {
  'antifouling.html': 'Boat care',
  'calibration-commissioning.html': 'Calibration / commissioning',
  'detailing.html': 'Boat care',
  'electronics.html': 'Navigation electronics',
  'fusion-audio.html': 'Marine audio',
  'marine-electrical.html': 'Electrical diagnostics / repair',
  'power-systems.html': 'Onboard power system',
  'smart-boat.html': 'Connectivity / networking',
  'yacht-refit.html': 'Yacht refit',
};

const escapeMarkup = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

document.querySelectorAll('.side-card').forEach((sideCard) => {
  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  const heading = sideCard.querySelector('h2')?.textContent.trim() || 'Tell us about your boat.';
  const introduction = sideCard.querySelector('p')?.textContent.trim() || 'Share a few details and our team will get back to you.';
  const selectedWorkType = pageWorkTypes[pageName] || '';
  const workTypeOptions = enquiryWorkTypes.map((workType) => (
    `<option${workType === selectedWorkType ? ' selected' : ''}>${escapeMarkup(workType)}</option>`
  )).join('');

  sideCard.classList.add('side-card-form');
  sideCard.id = 'page-enquiry';
  sideCard.innerHTML = `
    <div class="side-form-heading">
      <p class="eyebrow">Start an enquiry</p>
      <h2>${escapeMarkup(heading)}</h2>
      <p>${escapeMarkup(introduction)}</p>
    </div>
    <form class="enquiry-form compact-enquiry-form" novalidate>
      <input type="hidden" name="enquirySource" value="${escapeMarkup(document.title)} - Page enquiry form">
      <div class="enquiry-grid">
        <label><span>Name *</span><input name="name" autocomplete="name" required></label>
        <label><span>Email *</span><input type="email" name="email" autocomplete="email" required></label>
        <label><span>Phone number</span><input type="tel" name="phone" autocomplete="tel"></label>
        <label><span>Preferred contact</span><select name="preferredContact"><option>Email</option><option>Phone</option><option>Either</option></select></label>
        <label><span>Boat make / model</span><input name="boatModel" autocomplete="off"></label>
        <label><span>Boat length</span><input name="boatLength" placeholder="e.g. 40 ft" autocomplete="off"></label>
        <label class="enquiry-wide"><span>Marina / location</span><input name="boatLocation" autocomplete="off"></label>
        <label class="enquiry-wide"><span>What can we help with? *</span><select name="workType" required>${workTypeOptions}</select></label>
        <label class="enquiry-wide"><span>Tell us about the problem or project *</span><textarea name="projectDescription" rows="5" required placeholder="What would you like to diagnose, repair, install or upgrade?"></textarea></label>
        <label class="enquiry-trap" aria-hidden="true"><span>Leave this empty</span><input name="website" tabindex="-1" autocomplete="off"></label>
      </div>
      <div class="enquiry-footer">
        <p class="enquiry-status" role="status" aria-live="polite">Required fields are marked *</p>
        <button class="button primary" type="submit">Send Enquiry</button>
      </div>
      <a class="side-form-phone" href="tel:02381112032">Prefer to talk? Call 02381 112 032</a>
    </form>`;
});

const enquiryDialog = document.querySelector('#boat-enquiry');
const enquiryForm = enquiryDialog?.querySelector('.enquiry-form');
const enquirySource = enquiryForm?.querySelector('input[name="enquirySource"]');
const enquiryStatus = enquiryDialog?.querySelector('.enquiry-status');
const enquiryClose = enquiryDialog?.querySelector('.enquiry-close');
let enquiryOpener = null;

const enquiryTextPattern = /tell us about|start an enquiry|request a quote|ask our team|discuss|ask about your project|plan your|book a marine|book electrical|book calibration|make a commercial enquiry|request antifouling|request detailing|start an email enquiry/i;

const openEnquiry = (trigger) => {
  if (!enquiryDialog || !enquiryForm) return;
  enquiryOpener = trigger;
  enquiryForm.reset();
  enquiryStatus.textContent = '';
  const requestedSource = trigger.dataset.enquirySource || `${document.title} - ${trigger.textContent.trim()}`;
  enquirySource.value = requestedSource;
  enquirySource.setAttribute('value', requestedSource);
  enquiryDialog.showModal();
  document.body.classList.add('dialog-open');
  requestAnimationFrame(() => enquiryForm.elements.name.focus());
};

document.querySelectorAll('a, button').forEach((trigger) => {
  const href = trigger.getAttribute('href') || '';
  const isProjectAction = trigger.matches('[data-enquiry-source], .nav-cta') ||
    (href === '#contact' && !trigger.closest('.topbar')) ||
    (trigger.matches('.button') && href.startsWith('mailto:info@knightmarine.co.uk')) ||
    enquiryTextPattern.test(trigger.textContent.trim());

  if (!isProjectAction || href.startsWith('tel:') || (href === '#contact' && document.querySelector('.inline-enquiry-form'))) return;
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openEnquiry(trigger);
  });
});

const closeEnquiry = () => enquiryDialog?.close();
enquiryClose?.addEventListener('click', closeEnquiry);
enquiryDialog?.addEventListener('click', (event) => {
  if (event.target === enquiryDialog) closeEnquiry();
});
enquiryDialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  enquiryOpener?.focus();
});

const submitEnquiry = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const submit = form.querySelector('[type="submit"]');
  const status = form.querySelector('.enquiry-status');
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.website) return;
  delete data.website;

  submit.disabled = true;
  status.textContent = 'Preparing your enquiry…';

  if (!enquiryConfig.endpoint) {
    const subject = `Website enquiry - ${data.workType || 'Marine project'}`;
    const body = [
      `Name: ${data.name || ''}`,
      `Email: ${data.email || ''}`,
      `Phone: ${data.phone || ''}`,
      `Boat: ${data.boatName || data.boatModel || ''}`,
      `Boat length: ${data.boatLength || ''}`,
      `Marina / location: ${data.boatLocation || ''}`,
      `Service: ${data.workType || ''}`,
      '',
      data.projectDescription || '',
    ].join('\n');
    status.textContent = 'Opening your email app with the enquiry filled in…';
    window.location.href = `mailto:info@knightmarine.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    submit.disabled = false;
    return;
  }

  try {
    const response = await fetch(enquiryConfig.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    status.textContent = 'Thank you. Your project details have been sent to Knight Marine.';
  } catch (error) {
    status.innerHTML = 'We could not send that just now. Please call <a href="tel:02381112032">02381 112 032</a> or try again.';
  } finally {
    submit.disabled = false;
  }
};

document.querySelectorAll('.enquiry-form').forEach((form) => form.addEventListener('submit', submitEnquiry));
