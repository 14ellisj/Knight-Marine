document.querySelectorAll('.nav-links').forEach((navigation) => {
  if (navigation.querySelector('a[href="stories.html"]')) return;
  const link = document.createElement('a');
  link.href = 'stories.html';
  link.textContent = 'Stories';
  const refitLink = navigation.querySelector('a[href="yacht-refit.html"]');
  navigation.insertBefore(link, refitLink || null);
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
