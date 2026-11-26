import { Menu, Pause, Play, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

const NAV_ITEMS = [
  { id: 'esai', label: 'Esai Ale' },
  { id: 'video-hidup', label: 'Video Hidup' },
  { id: 'galeri', label: 'Galeri Foto' },
  { id: 'playlist', label: 'Playlist' },
  { id: 'interaksi', label: 'Interaksi' },
  { id: 'tim-pembuat', label: 'Tim' },
];

export function Header({ isPlaying, onToggleAudio }: HeaderProps) {
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const ids = ['beranda', ...NAV_ITEMS.map((item) => item.id)];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0.1, 0.3, 0.6] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#1E2B48] bg-[#070B14]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-3.5">
        <a
          href="#beranda"
          onClick={() => setMobileOpen(false)}
          className="font-editorial text-2xl font-semibold tracking-tight text-[#EEF3FC] whitespace-nowrap shrink-0 transition-colors hover:text-[#7AB3FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7AB3FF]"
        >
          Blue Moon Journal
        </a>

        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#94A3C8]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#EEF3FC] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7AB3FF] ${
                  isActive ? 'text-[#EEF3FC]' : ''
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute right-0 -bottom-0.5 left-0 h-[2px] rounded-full bg-[#7AB3FF]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onToggleAudio}
            aria-label={isPlaying ? 'Jeda pemutaran musik' : 'Putar lagu Let Down'}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold text-[#EEF3FC] whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
              isPlaying
                ? 'border-[#7AB3FF]/70 bg-[#1D2D4F] shadow-[0_0_18px_rgba(122,179,255,0.2)]'
                : 'border-[#7AB3FF]/40 bg-[#131E36] hover:bg-[#1D2D4F]'
            }`}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 text-[#7AB3FF]" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5 text-[#7AB3FF]" aria-hidden="true" />
            )}
            <span>{isPlaying ? 'Jeda Musik' : 'Putar Let Down'}</span>
            {isPlaying && (
              <span className="ml-0.5 flex h-3 items-end gap-0.5" aria-hidden="true">
                {[0, 1, 2].map((bar) => (
                  <motion.span
                    key={bar}
                    className="w-0.5 rounded-full bg-[#7AB3FF]"
                    animate={{ height: ['30%', '100%', '45%', '90%', '30%'] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: bar * 0.18,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </span>
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E2B48] bg-[#0D1526] text-[#EEF3FC] md:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            aria-label="Navigasi seluler"
            className="overflow-hidden border-t border-[#1E2B48] bg-[#0B111F] md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#1D2D4F] text-[#EEF3FC]'
                      : 'text-[#94A3C8] hover:bg-[#131E36] hover:text-[#EEF3FC]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Blue Moon Scroll Progress Line */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="h-[2px] w-full bg-gradient-to-r from-[#7AB3FF] via-[#A9CEFF] to-[#E5A95E]"
        aria-hidden="true"
      />
    </header>
  );
}
