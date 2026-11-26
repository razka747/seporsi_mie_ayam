import { ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import type { MouseEvent } from 'react';
import { scrollToSection } from '../utils/scrollToSection';

const FOOTER_LINKS = [
  { id: 'esai', label: 'Esai Ale' },
  { id: 'video-hidup', label: 'Video Hidup' },
  { id: 'galeri', label: 'Galeri Foto' },
  { id: 'playlist', label: 'Playlist Let Down' },
  { id: 'interaksi', label: 'Catatan Penonton' },
  { id: 'tim-pembuat', label: 'Tim Pembuat' },
];

export function Footer() {
  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#1E2B48] bg-[#050810] pt-10 pb-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-44 w-[420px] -translate-x-1/2 rounded-full bg-[#7AB3FF]/8 blur-[90px]"
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full bg-[#7AB3FF] shadow-[0_0_10px_#7AB3FF]"
              />
              <p className="font-editorial text-2xl font-semibold text-[#EEF3FC]">
                Blue Moon Journal
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#94A3C8]">
              Arsip esai film, foto adegan, kanvas hidup, dan ruang dengar untuk{' '}
              <em className="text-[#EEF3FC]">Seporsi Mie Ayam Sebelum Mati</em>.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => scrollToSection('beranda')}
              className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-[#1E2B48] bg-[#0D1526] px-4 py-2 text-xs font-medium text-[#EEF3FC] transition-colors hover:border-[#7AB3FF]/50 hover:bg-[#131E36] sm:w-auto"
            >
              <span>Kembali ke Atas</span>
              <ArrowUp className="h-3.5 w-3.5 text-[#7AB3FF]" aria-hidden="true" />
            </motion.button>

            <nav
              aria-label="Tautan bagian halaman"
              className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-5"
            >
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className="flex min-h-[40px] items-center rounded-lg border border-[#1E2B48]/80 bg-[#0B111F]/80 px-3 py-2 text-xs font-medium text-[#B6C4E0] transition-colors hover:border-[#7AB3FF]/40 hover:text-[#EEF3FC] sm:min-h-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-[#94A3C8]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-[#1E2B48]/80 pt-5 text-xs text-[#6E7FA3] sm:flex-row sm:items-center">
          <p>© 2026 Edisi Blue Moon · Seporsi Mie Ayam Sebelum Mati.</p>
          <p className="text-[#94A3C8]">Hangat sampai suapan terakhir.</p>
        </div>
      </div>
    </footer>
  );
}
