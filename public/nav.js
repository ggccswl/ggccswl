(function () {
  var path = (typeof location !== 'undefined' && location.pathname.split('/').pop()) || '';
  if (!path || path === '') path = 'index.html';

  function active(href) {
    var file = href.split('/').pop();
    return path === file ? 'text-emerald-700 font-bold' : 'text-gray-600 hover:text-emerald-600';
  }

  var html =
    '<header class="sticky top-0 z-[60] shadow-md bg-white/90 backdrop-blur-md border-b border-emerald-100/80">' +
    '<div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">' +
    '<a href="index.html" class="flex items-center gap-2 group shrink-0">' +
    '<span class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-105 transition-transform">GG</span>' +
    '<span class="leading-tight"><span class="block font-extrabold text-emerald-800 text-sm sm:text-base">GGCC Sahiwal</span><span class="block text-[10px] sm:text-xs text-gray-500 font-medium">Prospectus 2025–26</span></span></a>' +
    '<nav class="hidden xl:flex flex-wrap items-center justify-end gap-x-1 gap-y-1 text-xs font-medium">' +
    link('index.html', 'Home') +
    link('about.html', 'About') +
    link('messages.html', 'Messages') +
    link('academics.html', 'Programs') +
    link('lessons.html', 'Lessons') +
    link('students.html', 'Lists') +
    link('courses.html', 'Courses') +
    link('faculty.html', 'Faculty') +
    link('admissions.html', 'Admissions') +
    link('student-life.html', 'Student Life') +
    link('facilities.html', 'Facilities') +
    link('conduct.html', 'Rules') +
    link('results.html', 'Results') +
    link('online-classes.html', 'Gallery') +
    link('events.html', 'Events') +
    '</nav>' +
    '<button type="button" id="nav-toggle" class="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800" aria-expanded="false" aria-controls="mobile-menu-panel">' +
    '<span class="sr-only">Menu</span><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button>' +
    '</div>' +
    '<div id="mobile-menu-panel" class="xl:hidden border-t border-emerald-100 bg-white/98">' +
    '<div class="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm font-medium">' +
    mlink('index.html', 'Home') +
    mlink('about.html', 'About') +
    mlink('messages.html', 'Messages') +
    mlink('academics.html', 'Programs') +
    mlink('lessons.html', 'Lessons') +
    mlink('students.html', 'Lists') +
    mlink('courses.html', 'Courses') +
    mlink('faculty.html', 'Faculty') +
    mlink('admissions.html', 'Admissions') +
    mlink('student-life.html', 'Student Life') +
    mlink('facilities.html', 'Facilities') +
    mlink('conduct.html', 'Rules') +
    mlink('results.html', 'Results') +
    mlink('online-classes.html', 'Gallery') +
    mlink('events.html', 'Events') +
    '</div></div></header>';

  function link(href, label) {
    return (
      '<a href="' +
      href +
      '" class="px-2 py-1.5 rounded-lg transition-colors ' +
      active(href) +
      '">' +
      label +
      '</a>'
    );
  }

  function mlink(href, label) {
    return (
      '<a href="' +
      href +
      '" class="block px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition ' +
      active(href) +
      '">' +
      label +
      '</a>'
    );
  }

  var mount = document.getElementById('nav-root');
  if (mount) {
    mount.outerHTML = html;
    var btn = document.getElementById('nav-toggle');
    var panel = document.getElementById('mobile-menu-panel');
    if (btn && panel) {
      btn.addEventListener('click', function () {
        var open = panel.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  }
})();
