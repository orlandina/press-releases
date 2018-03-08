require('../scss/main.scss');

document.addEventListener('DOMContentLoaded', () => {

  const navigationElement = document.querySelector('#opt-navigation');

  if (navigationElement) {
    const nonExistingLinkElements = Array.from(navigationElement.querySelectorAll('a'))
    .filter(anchorElement => document.querySelector(`[name="${anchorElement.dataset['href']}"]`) == null);

    nonExistingLinkElements.forEach(linkElement => linkElement.remove());
    if (navigationElement.querySelectorAll('a').length <= 1) {
      navigationElement.style.display = 'none';
    }
    window.showcar.spyNavigation();
    if (window.teaser) window.teaser.init();
  }

  const generateUUID = require('./generate-uuid');

  const createAS24VisitorCookie = () => {
    if (document.cookie.indexOf('as24Visitor') > -1) return;

    const [origin] = window.location.host.match(/(?:autoscout24\.[^.]+|localhost)/i);
    const uuid = generateUUID();
    document.cookie = `as24Visitor=${uuid}; domain=${origin}; path=/; max-age=${365 * 24 * 60 * 60};`;
  };

  createAS24VisitorCookie();

  // require('./showcar-carousel.js');

});
