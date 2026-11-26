import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { ESSAY_CHAPTERS } from '../data/filmContent';

export function EssaySection() {
  const [activeId, setActiveId] = useState(ESSAY_CHAPTERS[0].id);
  const current =
    ESSAY_CHAPTERS.find((chap) => chap.id === activeId) ?? ESSAY_CHAPTERS[0];

  return (
    <section id="esai" className="border-b border-[#1E2B48] bg-[#070B14] py-16 lg:py-22">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col justify-between gap-6 border-b border-[#1E2B48] pb-8 md:flex-row md:items-end"
        >
          <div>
            <p className="text-xs font-medium text-[#7AB3FF]">
              Esai Film &amp; Bedah Babak
            </p>
            <h2
              className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#EEF3FC] lg:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Menunda Sunyi Demi Semangkuk Hangat
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Pilih babak esai Ale"
            className="flex flex-wrap gap-1.5 rounded-lg border border-[#1E2B48] bg-[#0D1526] p-1"
          >
            {ESSAY_CHAPTERS.map((chap) => {
              const selected = chap.id === current.id;
              return (
                <button
                  key={chap.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setActiveId(chap.id)}
                  className={`relative min-h-[38px] rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                    selected
                      ? 'text-[#EEF3FC]'
                      : 'text-[#94A3C8] hover:text-[#EEF3FC]'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="essay-tab-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-md bg-[#1D2D4F]"
                    />
                  )}
                  <span className="relative z-10">
                    {chap.index}. {chap.timeStamp.split(' · ')[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 70 / 30 Asymmetric Editorial Reading Canvas */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.article
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-2 text-xs text-[#94A3C8]">
                  <span className="font-mono tabular-nums text-[#7AB3FF]">
                    Babak {current.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{current.timeStamp}</span>
                </div>

                <h3 className="font-editorial mt-3 text-3xl font-semibold text-[#EEF3FC] lg:text-4xl">
                  {current.title}
                </h3>

                {/* Pull quote separated with hairline top/bottom dividers */}
                <blockquote className="my-8 border-y border-[#1E2B48] py-6">
                  <p className="font-editorial text-2xl italic leading-snug text-[#D6E4FF] lg:text-[26px]">
                    {current.quote}
                  </p>
                </blockquote>

                <div className="max-w-prose space-y-5 text-[16px] leading-[1.8] text-[#C5D2EA]">
                  {current.paragraphs.map((paragraph, idx) => (
                    <p
                      key={`${current.id}-p-${idx}`}
                      className={
                        idx === 0
                          ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-editorial first-letter:text-5xl first-letter:font-semibold first-letter:leading-none first-letter:text-[#7AB3FF]'
                          : ''
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-xl border border-[#1E2B48] bg-[#0D1526] p-6">
              <p className="text-xs font-medium text-[#7AB3FF]">
                Catatan Pinggir Redaksi
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`note-${current.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                  <h4 className="font-editorial mt-2 text-2xl font-semibold text-[#EEF3FC]">
                    {current.marginNoteTitle}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#94A3C8]">
                    {current.marginNoteBody}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 border-t border-[#1E2B48] pt-5">
                <p className="text-xs text-[#94A3C8]">Daftar Babak Lengkap</p>
                <ul className="mt-3 space-y-2">
                  {ESSAY_CHAPTERS.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                          item.id === current.id
                            ? 'translate-x-1 bg-[#131E36] font-semibold text-[#EEF3FC]'
                            : 'text-[#94A3C8] hover:translate-x-0.5 hover:bg-[#131E36]/60 hover:text-[#EEF3FC]'
                        }`}
                      >
                        <span className="truncate pr-3">
                          {item.index}. {item.title}
                        </span>
                        <span className="font-mono text-[11px] tabular-nums shrink-0 text-[#7AB3FF]">
                          {item.timeStamp.split(' · ')[0]}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
