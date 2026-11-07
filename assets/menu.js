const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-nav');

if (menuButton && siteNav) {
  const isOpen = () => menuButton.getAttribute('aria-expanded') === 'true';
  const closeMenu = () => menuButton.setAttribute('aria-expanded', 'false');

  menuButton.hidden = false;
  menuButton.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', String(!isOpen()));
  });
  siteNav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  menuButton.closest('.mast').addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen() && menuButton.getClientRects().length) {
      closeMenu();
      menuButton.focus();
    }
  });
}
