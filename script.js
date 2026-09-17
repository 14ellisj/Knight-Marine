document.querySelectorAll('.nav-links').forEach((navigation) => {
  if (navigation.querySelector('a[href="stories.html"]')) return;
  const link = document.createElement('a');
  link.href = 'stories.html';
  link.textContent = 'Stories';
  const refitLink = navigation.querySelector('a[href="yacht-refit.html"]');
  navigation.insertBefore(link, refitLink || null);
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
          <label class="enquiry-wide"><span>Type of work required</span><select name="workType"><option value="">Please select</option><option>Navigation electronics</option><option>Power management</option><option>Boat care</option><option>Yacht refit</option><option>Commercial marine</option><option>Other</option></select></label>
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

const enquiryDialog = document.querySelector('#boat-enquiry');
const enquiryForm = enquiryDialog?.querySelector('.enquiry-form');
const enquirySource = enquiryForm?.querySelector('input[name="enquirySource"]');
const enquiryStatus = enquiryDialog?.querySelector('.enquiry-status');
const enquiryClose = enquiryDialog?.querySelector('.enquiry-close');
let enquiryOpener = null;

const enquiryTextPattern = /tell us about|start an enquiry|request a quote|ask our team|discuss|ask about your project|plan your|make a commercial enquiry|request antifouling|request detailing|start an email enquiry/i;

const openEnquiry = (trigger) => {
  if (!enquiryDialog || !enquiryForm) return;
  enquiryOpener = trigger;
  enquiryForm.reset();
  enquiryStatus.textContent = '';
  const requestedSource = trigger.dataset.enquirySource || `${document.title} — ${trigger.textContent.trim()}`;
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

  if (!isProjectAction || href.startsWith('tel:')) return;
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

enquiryForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  const submit = enquiryForm.querySelector('[type="submit"]');
  const data = Object.fromEntries(new FormData(enquiryForm).entries());
  if (data.website) return;
  delete data.website;

  submit.disabled = true;
  enquiryStatus.textContent = 'Preparing your enquiry…';

  if (!enquiryConfig.endpoint) {
    sessionStorage.setItem('knightMarineEnquiryDraft', JSON.stringify(data));
    enquiryStatus.innerHTML = 'Online sending is being connected. Your details are saved in this browser; please call <a href="tel:02381112032">02381 112 032</a> for now.';
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
    enquiryForm.reset();
    enquiryStatus.textContent = 'Thank you. Your project details have been sent to Knight Marine.';
  } catch (error) {
    enquiryStatus.innerHTML = 'We could not send that just now. Please call <a href="tel:02381112032">02381 112 032</a> or try again.';
  } finally {
    submit.disabled = false;
  }
});
