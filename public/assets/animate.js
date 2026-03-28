(function () {
  var io;
  function ensureObserver() {
    if (!('IntersectionObserver' in window)) return null;
    if (io) return io;
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    return io;
  }
  function observeNew() {
    var els = document.querySelectorAll('[data-animate]:not(.is-visible)');
    if (!els.length) return;
    var observer = ensureObserver();
    if (!observer) {
      els.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    els.forEach(function (el) {
      observer.observe(el);
    });
  }
  function init() {
    observeNew();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('ggcc-dom-updated', observeNew);
})();
