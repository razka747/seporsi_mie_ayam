import {
  BookOpen,
  Clapperboard,
  Disc3,
  Image,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  MessageSquareHeart,
  Pause,
  Play,
  Shield,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState, type MouseEvent } from 'react';
import type { AuthUser } from '../utils/authLogic';
import { scrollToSection } from '../utils/scrollToSection';

interface HeaderProps {
  isPlaying: boolean;
  isBuffering?: boolean;
  onToggleAudio: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'esai', label: 'Esai Ale', hint: '4 Babak', Icon: BookOpen },
  { id: 'video-hidup', label: 'Video Hidup', hint: 'Trailer & Kanvas', Icon: Clapperboard },
  { id: 'galeri', label: 'Galeri Foto', hint: '8 Adegan', Icon: Image },
  { id: 'playlist', label: 'Playlist', hint: 'Let Down & OST', Icon: Disc3 },
  { id: 'interaksi', label: 'Interaksi', hint: 'Catatan & Poll', Icon: MessageSquareHeart },
  { id: 'tim-pembuat', label: 'Tim', hint: '7 Kreator', Icon: Users },
];

export function Header({
  isPlaying,
  isBuffering = false,
  onToggleAudio,
  currentUser,
  onOpenAuth,
  onLogout,
}: HeaderProps) {
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
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.05, 0.25, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleDesktopNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    setActiveSection(sectionId);
    scrollToSection(sectionId);
  };

  const handleMobileNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    setActiveSection(sectionId);
    setMobileOpen(false);
    // Wait for drawer collapse animation to begin so mobile browsers don't cancel scroll
    scrollToSection(sectionId, 160);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#1E2B48] bg-[#070B14]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5">
        <a
          href="#beranda"
          onClick={(e) => {
            e.preventDefault();
            setMobileOpen(false);
            setActiveSection('beranda');
            scrollToSection('beranda');
          }}
          className="flex items-center gap-2 font-editorial text-xl font-semibold tracking-tight text-[#EEF3FC] whitespace-nowrap shrink-0 transition-colors hover:text-[#7AB3FF] sm:text-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7AB3FF]"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-full bg-[#7AB3FF] shadow-[0_0_10px_#7AB3FF]"
          />
          <span>Blue Moon Journal</span>
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
                onClick={(e) => handleDesktopNavClick(e, item.id)}
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

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleAudio}
            aria-label={isPlaying ? 'Jeda pemutaran musik' : 'Putar lagu Let Down'}
            className={`inline-flex min-h-[38px] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold text-[#EEF3FC] whitespace-nowrap shrink-0 transition-colors sm:min-h-[40px] sm:px-4 sm:py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
              isPlaying
                ? 'border-[#7AB3FF]/70 bg-[#1D2D4F] shadow-[0_0_18px_rgba(122,179,255,0.2)]'
                : 'border-[#7AB3FF]/40 bg-[#131E36] hover:bg-[#1D2D4F]'
            }`}
          >
            {isBuffering ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#7AB3FF]" aria-hidden="true" />
            ) : isPlaying ? (
              <Pause className="h-3.5 w-3.5 text-[#7AB3FF]" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5 text-[#7AB3FF]" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {isBuffering ? 'Memuat...' : isPlaying ? 'Jeda Musik' : 'Putar Let Down'}
            </span>
            <span className="sm:hidden">
              {isBuffering ? 'Memuat' : isPlaying ? 'Jeda' : 'Let Down'}
            </span>
            {isPlaying && (
              <span className="flex h-3 items-end gap-0.5" aria-hidden="true">
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

          {/* Desktop Auth Controls */}
          {currentUser ? (
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-[#1E2B48] bg-[#0D1526] px-2.5 py-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                  currentUser.role === 'admin'
                    ? 'bg-[#E5A95E]/20 text-[#E5A95E]'
                    : 'bg-[#7AB3FF]/15 text-[#7AB3FF]'
                }`}
              >
                {currentUser.role === 'admin' && (
                  <Shield className="h-2.5 w-2.5" aria-hidden="true" />
                )}
                {currentUser.role}
              </span>
              <span className="max-w-[96px] truncate text-xs font-medium text-[#EEF3FC]">
                {currentUser.name}
              </span>
              <button
                type="button"
                onClick={onLogout}
                aria-label="Keluar dari akun"
                title="Keluar"
                className="inline-flex h-6 w-6 items-center justify-center rounded text-[#94A3C8] transition-colors hover:bg-[#1D2D4F] hover:text-[#EEF3FC]"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="hidden md:inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#243456] bg-[#0D1526] px-3.5 py-2 text-xs font-semibold text-[#EEF3FC] whitespace-nowrap shrink-0 transition-colors hover:border-[#7AB3FF]/60 hover:bg-[#131E36]"
            >
              <LogIn className="h-3.5 w-3.5 text-[#7AB3FF]" aria-hidden="true" />
              <span>Masuk</span>
            </button>
          )}

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border transition-colors md:hidden ${
              mobileOpen
                ? 'border-[#7AB3FF]/60 bg-[#1D2D4F] text-[#7AB3FF]'
                : 'border-[#1E2B48] bg-[#0D1526] text-[#EEF3FC]'
            }`}
          >
            {mobileOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Upgraded Mobile Navigation Grid Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            aria-label="Navigasi seluler"
            className="overflow-hidden border-t border-[#1E2B48] bg-[#090F1D]/98 backdrop-blur-xl md:hidden"
          >
            <div className="px-4 pt-3 pb-4">
              <p className="mb-2.5 flex items-center justify-between text-[11px] font-medium text-[#94A3C8]">
                <span>PILIH BAGIAN JURNAL</span>
                <span className="font-mono text-[#7AB3FF]">EDISI BLUE MOON</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {NAV_ITEMS.map(({ id, label, hint, Icon }) => {
                  const isActive = activeSection === id;
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={(e) => handleMobileNavClick(e, id)}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all active:scale-[0.98] ${
                        isActive
                          ? 'border-[#7AB3FF]/60 bg-[#16233E] text-[#EEF3FC] shadow-[0_0_16px_rgba(122,179,255,0.14)]'
                          : 'border-[#1E2B48] bg-[#0D1526]/80 text-[#C5D2EA] hover:border-[#2C3F68]'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isActive
                            ? 'bg-[#7AB3FF]/20 text-[#7AB3FF]'
                            : 'bg-[#131E36] text-[#94A3C8]'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold">
                          {label}
                        </span>
                        <span className="block truncate text-[10px] text-[#94A3C8]">
                          {hint}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Mobile Auth Bar */}
              <div className="mt-3 border-t border-[#1E2B48] pt-3">
                {currentUser ? (
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-[#1E2B48] bg-[#0D1526] px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                          currentUser.role === 'admin'
                            ? 'bg-[#E5A95E]/20 text-[#E5A95E]'
                            : 'bg-[#7AB3FF]/15 text-[#7AB3FF]'
                        }`}
                      >
                        {currentUser.role === 'admin' && (
                          <Shield className="h-2.5 w-2.5" aria-hidden="true" />
                        )}
                        {currentUser.role}
                      </span>
                      <span className="truncate text-xs font-semibold text-[#EEF3FC]">
                        {currentUser.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        onLogout();
                      }}
                      className="inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-lg border border-[#243456] bg-[#131E36] px-3 py-1.5 text-xs font-medium text-[#EEF3FC]"
                    >
                      <LogOut className="h-3.5 w-3.5 text-[#94A3C8]" aria-hidden="true" />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        onOpenAuth('login');
                      }}
                      className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#243456] bg-[#0D1526] px-3 py-2 text-xs font-semibold text-[#EEF3FC]"
                    >
                      <LogIn className="h-3.5 w-3.5 text-[#7AB3FF]" aria-hidden="true" />
                      <span>Masuk</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        onOpenAuth('register');
                      }}
                      className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#7AB3FF] px-3 py-2 text-xs font-semibold text-[#070B14]"
                    >
                      <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Registrasi</span>
                    </button>
                  </div>
                )}
              </div>
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
