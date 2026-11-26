export function Footer() {
  return (
    <footer className="border-t border-[#1E2B48] bg-[#050810] py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <p className="font-editorial text-xl font-semibold text-[#EEF3FC]">
            Blue Moon Journal
          </p>
          <p className="mt-1 text-xs text-[#94A3C8]">
            Arsip esai film, foto adegan, dan ruang dengar untuk{' '}
            <em>Seporsi Mie Ayam Sebelum Mati</em>.
          </p>
        </div>

        <nav
          aria-label="Tautan bagian halaman"
          className="flex flex-wrap items-center gap-6 text-xs text-[#94A3C8]"
        >
          <a href="#esai" className="hover:text-[#EEF3FC] transition-colors">
            Esai Ale
          </a>
          <a
            href="#video-hidup"
            className="hover:text-[#EEF3FC] transition-colors"
          >
            Video Hidup
          </a>
          <a href="#galeri" className="hover:text-[#EEF3FC] transition-colors">
            Galeri Foto
          </a>
          <a href="#playlist" className="hover:text-[#EEF3FC] transition-colors">
            Playlist Let Down
          </a>
          <a
            href="#interaksi"
            className="hover:text-[#EEF3FC] transition-colors"
          >
            Catatan Penonton
          </a>
          <a
            href="#tim-pembuat"
            className="hover:text-[#EEF3FC] transition-colors"
          >
            Tim Pembuat
          </a>
        </nav>

        <p className="text-xs text-[#6E7FA3]">
          © 2026 Edisi Blue Moon · Hangat sampai suapan terakhir.
        </p>
      </div>
    </footer>
  );
}
