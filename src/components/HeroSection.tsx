import { ArrowDown, Disc3, Play, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { HERO_IMAGE_URL } from '../data/filmContent';
import { scrollToSection } from '../utils/scrollToSection';

interface HeroSectionProps {
  isPlaying: boolean;
  onPlayLetDown: () => void;
}

const HERO_QUOTES = [
  '“Di hari ulang tahunku yang ke-37, aku hanya ingin makan seporsi mie ayam favoritku sebelum semuanya selesai.”',
  '“Kadang semesta menunda kehancuran kita hanya dengan satu hal sepele: warung mie ayam langganan yang tutup.”',
  '“Hidup tidak tiba-tiba menjadi mudah. Ia hanya terasa cukup layak untuk dicoba lagi esok pagi.”',
];

const NIGHT_MOTES = [
  { left: '8%', top: '18%', size: 4, delay: 0, duration: 7 },
  { left: '22%', top: '65%', size: 3, delay: 1.2, duration: 8.5 },
  { left: '42%', top: '26%', size: 5, delay: 0.6, duration: 9 },
  { left: '68%', top: '14%', size: 3, delay: 1.8, duration: 7.5 },
  { left: '84%', top: '58%', size: 4, delay: 0.9, duration: 8 },
  { left: '91%', top: '24%', size: 3, delay: 2.1, duration: 9.5 },
];

export function HeroSection({ isPlaying, onPlayLetDown }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const cycleQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % HERO_QUOTES.length);
  };

  return (
    <section
      id="beranda"
      className="relative overflow-hidden border-b border-[#1E2B48] bg-[#070B14]"
    >
      {/* Ambient Blue Moon Glow & Drifting Night Motes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-[#7AB3FF]/12 blur-[120px]"
        />
        <motion.div
          animate={{ opacity: [0.18, 0.32, 0.18], scale: [1, 1.08, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute right-10 bottom-12 h-[300px] w-[300px] rounded-full bg-[#E5A95E]/10 blur-[110px]"
        />
        {NIGHT_MOTES.map((mote, i) => (
          <motion.span
            key={i}
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.15, 0.65, 0.15],
            }}
            transition={{
              duration: mote.duration,
              repeat: Infinity,
              delay: mote.delay,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full bg-[#A9CEFF]"
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 pt-8 pb-10 sm:px-6 lg:pt-16 lg:pb-14">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#94A3C8]"
              >
                <span>Arsip Film Resmi · 12 November 2026</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#7AB3FF]">Edisi Blue Moon</span>
                <span aria-hidden="true">·</span>
                <span>Kisah Ale</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="font-editorial mt-5 text-[clamp(2.5rem,4.4vw,4rem)] font-semibold leading-[1.06] tracking-tight text-[#EEF3FC]"
                style={{ textWrap: 'balance' }}
              >
                Seporsi Mie Ayam Sebelum Mati
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-[#B6C4E0]"
              >
                Jurnal visual film arahan Kuntz Agus yang dibintangi Benidictus
                Siregar sebagai Ale—pria 37 tahun yang menunda niatnya mengakhiri
                hidup demi seporsi mie ayam terakhir, ditemani lagu asli{' '}
                <em className="font-editorial text-lg italic text-[#EEF3FC]">
                  Let Down
                </em>{' '}
                dari Radiohead yang memeluk luka sekaligus harapannya.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onPlayLetDown}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2.5 rounded-lg bg-[#7AB3FF] px-5 py-2.5 text-sm font-semibold text-[#070B14] whitespace-nowrap shrink-0 shadow-[0_0_24px_rgba(122,179,255,0.28)] transition-colors hover:bg-[#9CC7FF] sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
              >
                {isPlaying ? (
                  <Disc3 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4" aria-hidden="true" />
                )}
                <span>
                  {isPlaying
                    ? 'Sedang Memutar: Let Down'
                    : 'Putar Let Down — Radiohead'}
                </span>
              </motion.button>

              <motion.a
                href="#esai"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('esai');
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#243456] bg-[#0D1526] px-5 py-2.5 text-sm font-medium text-[#EEF3FC] whitespace-nowrap shrink-0 transition-colors hover:border-[#7AB3FF]/50 hover:bg-[#131E36] sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
              >
                <span>Baca Esai Film</span>
                <ArrowDown className="h-4 w-4 text-[#94A3C8]" aria-hidden="true" />
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14 }}
            className="lg:col-span-6"
          >
            <figure className="group relative h-[300px] overflow-hidden rounded-2xl border border-[#1E2B48] bg-[#0D1526] shadow-[0_20px_60px_rgba(0,0,0,0.55)] transition-colors hover:border-[#7AB3FF]/40 sm:h-[400px] lg:h-[450px]">
              {!imgError ? (
                <img
                  src={HERO_IMAGE_URL}
                  alt="Benidictus Siregar sebagai Ale berdiri di samping gerobak mie ayam biru dalam cuplikan film Seporsi Mie Ayam Sebelum Mati"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-[50%_28%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-gradient-to-br from-[#0D1526] via-[#131E36] to-[#070B14] p-8 text-center">
                  <p className="font-editorial text-2xl text-[#EEF3FC]">
                    Seporsi Mie Ayam Sebelum Mati
                  </p>
                  <p className="mt-2 text-xs text-[#94A3C8]">
                    Cuplikan Adegan Resmi · Ale di Gerobak Mie Ayam
                  </p>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B14]/95 via-[#070B14]/25 to-transparent"
              />
              <figcaption className="absolute right-0 bottom-0 left-0 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs text-[#94A3C8]">
                    ADEGAN FILM · BENIDICTUS SIREGAR SEBAGAI ALE
                  </p>
                  <button
                    type="button"
                    onClick={cycleQuote}
                    className="inline-flex items-center gap-1 rounded-full border border-[#2C3F68] bg-[#0D1526]/85 px-2.5 py-1 text-[11px] font-medium text-[#7AB3FF] backdrop-blur-sm transition-colors hover:border-[#7AB3FF] hover:text-[#EEF3FC]"
                  >
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    <span>Kutipan {quoteIdx + 1}/{HERO_QUOTES.length}</span>
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-1.5 text-sm font-medium text-[#EEF3FC]"
                  >
                    {HERO_QUOTES[quoteIdx]}
                  </motion.p>
                </AnimatePresence>
              </figcaption>
            </figure>
          </motion.div>
        </div>

        {/* Keterangan Film Resmi */}
        <div className="mt-10 border-t border-[#1E2B48] pt-7 sm:mt-12 sm:pt-8">
          <p className="text-xs font-medium text-[#7AB3FF]">Keterangan Film</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {[
              { dt: 'Adaptasi & Penulis', dd: 'Novel Brian Khrisna' },
              { dt: 'Sutradara & Produksi', dd: 'Kuntz Agus · Sinergi' },
              { dt: 'Rilis Bioskop & Genre', dd: '12 Nov 2026 · Drama' },
              { dt: 'Pemeran Utama', dd: 'Benidictus Siregar' },
            ].map((item, idx) => (
              <motion.div
                key={item.dt}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="rounded-xl border border-[#1E2B48]/70 bg-[#0D1526]/50 px-3.5 py-3 transition-colors hover:border-[#7AB3FF]/40 hover:bg-[#0D1526] sm:px-4"
              >
                <dt className="text-[11px] text-[#94A3C8] sm:text-xs">{item.dt}</dt>
                <dd className="mt-1 font-editorial text-lg font-semibold leading-snug text-[#EEF3FC] sm:text-xl">
                  {item.dd}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* Ringkasan Keterangan & Jajaran Pemeran Film */}
      <div className="relative border-t border-[#1E2B48] bg-[#0B111F] py-4">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-3 px-4 text-xs leading-relaxed text-[#B6C4E0] sm:px-6 md:flex-row md:items-center">
          <p className="max-w-3xl">
            <span className="font-semibold text-[#EEF3FC]">Sinopsis Film:</span>{' '}
            Tepat di ulang tahun ke-37, Ale berniat mengakhiri hidupnya namun
            memutuskan menyantap seporsi mie ayam terakhir lebih dulu—perjalanan
            yang mempertemukannya dengan Murad, Juleha, Pram, dan pelukan sang
            ibu.
          </p>
          <p className="shrink-0 text-[#94A3C8]">
            Dibintangi bersama Dewi Irawan, Teuku Rifnu Wikana, Zulfa Maharani &amp;
            Chicco Kurniawan
          </p>
        </div>
      </div>
    </section>
  );
}
