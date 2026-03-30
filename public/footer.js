const footerTemplate = `
<footer class="bg-gray-900 text-white pt-14 pb-10 mt-24 relative overflow-hidden">
    <div class="absolute inset-0 opacity-[0.07] pointer-events-none" style="background-image: radial-gradient(circle at 20% 20%, #10b981 0, transparent 45%), radial-gradient(circle at 80% 60%, #059669 0, transparent 40%);"></div>
    <div class="max-w-7xl mx-auto px-4 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
            <div>
                <h3 class="text-2xl font-black text-emerald-400 mb-3 uppercase tracking-tight">GGCC Sahiwal</h3>
                <p class="text-gray-400 text-sm leading-relaxed">
                    Government Graduate College of Commerce, Sahiwal providing commerce, IT, and professional education since 1964. Affiliated with BISE Sahiwal, PBTE Lahore, and GCUF Faisalabad.
                </p>
                <p class="mt-4 text-sm text-gray-500"><strong class="text-gray-300">Phone:</strong> 040-9200401</p>
                <p class="text-sm text-gray-500"><strong class="text-gray-300">Main Campus:</strong> Liaquat Road, Sahiwal</p>
                <p class="text-sm text-gray-500"><strong class="text-gray-300">New Campus:</strong> Harappah Road, Sahiwal</p>
            </div>
            <div>
                <h4 class="text-lg font-bold mb-4 border-b border-gray-700 pb-2 text-white">College</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="about.html" class="hover:text-emerald-400 transition">About &amp; History</a></li>
                    <li><a href="messages.html" class="hover:text-emerald-400 transition">Leadership Messages</a></li>
                    <li><a href="faculty.html" class="hover:text-emerald-400 transition">Faculty</a></li>
                    <li><a href="facilities.html" class="hover:text-emerald-400 transition">Facilities &amp; Services</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-lg font-bold mb-4 border-b border-gray-700 pb-2 text-white">Study</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="academics.html" class="hover:text-emerald-400 transition">Programs Overview</a></li>
                    <li><a href="lessons.html" class="hover:text-emerald-400 transition">Lessons &amp; Media</a></li>
                    <li><a href="courses.html" class="hover:text-emerald-400 transition">Course Outlines</a></li>
                    <li><a href="admissions.html" class="hover:text-emerald-400 transition">Admissions</a></li>
                    <li><a href="students.html" class="hover:text-emerald-400 transition">Admission / Result PDFs</a></li>
                    <li><a href="results.html" class="hover:text-emerald-400 font-semibold text-emerald-300/90">Examination Results</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-lg font-bold mb-4 border-b border-gray-700 pb-2 text-white">Students</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="student-life.html" class="hover:text-emerald-400 transition">Uniform &amp; Timings</a></li>
                    <li><a href="conduct.html" class="hover:text-emerald-400 transition">Rules &amp; Discipline</a></li>
                    <li><a href="online-classes.html" class="hover:text-emerald-400 transition">Media Gallery</a></li>
                    <li><a href="events.html" class="hover:text-emerald-400 transition">Events</a></li>
                </ul>
                <div class="flex space-x-3 mt-6">
                    <a href="https://wa.me/923001234567" target="_blank" rel="noopener" class="bg-gray-800 p-3 rounded-full hover:bg-green-600 transition" aria-label="WhatsApp">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <a href="https://facebook.com/yourcollege" target="_blank" rel="noopener" class="bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition" aria-label="Facebook">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v4h2v9h4v-9h3.6l.4-4H13V6.7c0-.8.4-1.2 1.1-1.2H16V1h-3.3C10.1 1 9 2.5 9 4.8V8z"/></svg>
                    </a>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-gray-500">
            <p>&copy; 2026 Government Graduate College of Commerce, Sahiwal. Affiliated with GCUF, PBTE Lahore &amp; BISE Sahiwal.</p>
            <a href="admin/" class="text-emerald-500 hover:text-emerald-400 font-semibold">Staff admin</a>
        </div>
    </div>
</footer>
`;

var fp = document.getElementById('footer-placeholder');
if (fp) {
  fp.outerHTML = footerTemplate;
} else {
  document.body.insertAdjacentHTML('beforeend', footerTemplate);
}
