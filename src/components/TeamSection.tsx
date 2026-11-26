import { ChevronLeft, ChevronRight, Expand, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { TEAM_MEMBERS } from '../data/filmContent';

export function TeamSection() {
  const [selectedId, setSelectedId] = useState(TEAM_MEMBERS[0].id);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const activeIndex = Math.max(
    0,
    TEAM_MEMBERS.findIndex((member) => member.id === selectedId),
  );
  const activeMember = TEAM_MEMBERS[activeIndex] ?? TEAM_MEMBERS[0];
  const activeImgFailed = Boolean(failedImages[activeMember.id]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [lightboxOpen]);

  const handleImageError = (memberId: string) => {
    setFailedImages((prev) => ({ ...prev, [memberId]: true }));
  };

  const handlePrevMember = () => {
    const prevIdx =
      (activeIndex - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
    setSelectedId(TEAM_MEMBERS[prevIdx].id);
  };

  const handleNextMember = () => {
    const nextIdx = (activeIndex + 1) % TEAM_MEMBERS.length;
    setSelectedId(TEAM_MEMBERS[nextIdx].id);
  };

  return (
    <section
      id="tim-pembuat"
      className="border-t border-[#1E2B48] bg-[#0B111F] py-12 sm:py-16 lg:py-22"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#7AB3FF]">
            Di Balik Layar · Kelompok 7 Kreator
          </p>
          <h2
            className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#EEF3FC] lg:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Tim Pembuat Website Kisah Ale
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#94A3C8]">
            Website arsip{' '}
            <em className="text-[#EEF3FC]">Seporsi Mie Ayam Sebelum Mati</em>
            {' '}ini disusun bersama oleh kelompok beranggotakan 7 orang yang menata esai, foto adegan, kanvas bersuara, hingga playlist Blue Moon untuk menemani perjalanan Ale.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* Left: Active Member Spotlight Portrait Card */}
          <div className="flex h-full flex-col lg:col-span-5">
            <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#1E2B48] bg-[#070B14]">
              <div className="relative aspect-[4/4.2] w-full flex-1 overflow-hidden bg-[#0D1526] lg:aspect-auto lg:min-h-[340px]">
                <AnimatePresence mode="wait">
                {!activeImgFailed ? (
                  <motion.img
                    key={activeMember.id}
                    src={activeMember.photoUrl}
                    alt={`Foto ${activeMember.name} — ${activeMember.role}`}
                    onError={() => handleImageError(activeMember.id)}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className={`absolute inset-0 h-full w-full object-cover ${activeMember.photoPosition}`}
                  />
                ) : (
                  <motion.div
                    key={`fallback-${activeMember.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#0D1526] via-[#131E36] to-[#070B14] p-8 text-center"
                  >
                    <Users
                      className="h-8 w-8 text-[#7AB3FF]"
                      aria-hidden="true"
                    />
                    <p className="font-editorial mt-3 text-2xl text-[#EEF3FC]">
                      {activeMember.name}
                    </p>
                    <p className="mt-1 text-xs text-[#94A3C8]">
                      {activeMember.role}
                    </p>
                  </motion.div>
                )}
                </AnimatePresence>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B14]/90 via-[#070B14]/15 to-transparent"
                />

                <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-[#7AB3FF]">
                      ANGGOTA {activeMember.number} · TIM KREATOR
                    </p>
                    <p className="font-editorial mt-0.5 truncate text-2xl font-semibold text-[#EEF3FC]">
                      {activeMember.name}
                    </p>
                  </div>

                  {!activeImgFailed && (
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      aria-label={`Perbesar foto ${activeMember.name}`}
                      className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg border border-[#2C3F68] bg-[#070B14]/85 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-[#EEF3FC] backdrop-blur-sm transition-colors hover:border-[#7AB3FF] hover:bg-[#131E36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                    >
                      <Expand
                        className="h-3.5 w-3.5 text-[#7AB3FF]"
                        aria-hidden="true"
                      />
                      <span>Perbesar Foto</span>
                    </button>
                  )}
                </div>
              </div>

              <figcaption className="shrink-0 border-t border-[#1E2B48] bg-[#0D1526] px-5 py-4">
                <p className="text-xs font-medium text-[#7AB3FF]">
                  {activeMember.role}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#C5D2EA]">
                  {activeMember.contribution}
                </p>
              </figcaption>
            </figure>
          </div>

          {/* Right: Interactive 7-Member Photo & Name Grid matched cleanly in height */}
          <div className="flex h-full flex-col justify-between rounded-2xl border border-[#1E2B48] bg-[#0D1526] p-6 lg:col-span-7">
            <div>
              <div className="flex items-center justify-between border-b border-[#1E2B48] pb-3.5">
                <div>
                  <h3 className="font-editorial text-2xl font-semibold text-[#EEF3FC]">
                    Foto &amp; Nama 7 Anggota Kelompok
                  </h3>
                  <p className="mt-0.5 text-xs text-[#94A3C8]">
                    Pilih anggota untuk melihat sorotan profil dan fotonya secara penuh.
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs text-[#7AB3FF] tabular-nums">
                  7 / 7
                </span>
              </div>

              <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {TEAM_MEMBERS.map((member, index) => {
                  const selected = member.id === activeMember.id;
                  const isLastOdd = index === TEAM_MEMBERS.length - 1;
                  const thumbFailed = Boolean(failedImages[member.id]);
                  return (
                    <li
                      key={member.id}
                      className={isLastOdd ? 'sm:col-span-2' : ''}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedId(member.id)}
                        aria-pressed={selected}
                        className={`flex w-full items-center gap-3.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                          selected
                            ? 'border-[#7AB3FF]/70 bg-[#131E36]'
                            : 'border-[#1E2B48] bg-[#070B14]/55 hover:border-[#2C3F68] hover:bg-[#131E36]/60'
                        }`}
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#243456] bg-[#0B111F]">
                          {!thumbFailed ? (
                            <img
                              src={member.photoUrl}
                              alt={`Foto ${member.name}`}
                              onError={() => handleImageError(member.id)}
                              className={`h-full w-full object-cover ${member.photoPosition}`}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-mono text-[#7AB3FF]">
                              {member.number}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="shrink-0 font-mono text-[11px] text-[#7AB3FF] tabular-nums">
                              {member.number}
                            </span>
                            <span className="truncate text-sm font-semibold text-[#EEF3FC]">
                              {member.name}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-[#94A3C8]">
                            {member.role}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-4 border-t border-[#1E2B48] pt-3.5 text-xs text-[#94A3C8]">
              Disusun bersama oleh Razka, Faqih, Nouval, Shakila, Daniel,
              Nashira, dan Qintara untuk blog film{' '}
              <em className="text-[#EEF3FC]">Seporsi Mie Ayam Sebelum Mati</em>.
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full Uncropped Member Portrait */}
      <dialog
        ref={dialogRef}
        onCancel={() => setLightboxOpen(false)}
        aria-label={`Tampilan penuh foto ${activeMember.name}`}
        className="m-auto max-h-[90vh] w-[92vw] max-w-2xl overflow-hidden rounded-2xl border border-[#243456] bg-[#0B111F] p-0 text-[#EEF3FC] backdrop:bg-[#04070E]/85"
      >
        <div className="flex items-center justify-between border-b border-[#1E2B48] px-5 py-3.5">
          <div>
            <p className="font-mono text-xs text-[#7AB3FF]">
              ANGGOTA {activeMember.number} · KELOMPOK 7 KREATOR
            </p>
            <h3 className="font-editorial text-xl font-semibold text-[#EEF3FC]">
              {activeMember.name} — {activeMember.role}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Tutup pratinjau foto anggota"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E2B48] bg-[#0D1526] text-[#EEF3FC] hover:bg-[#1D2D4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="bg-[#070B14] p-4">
          <img
            src={activeMember.photoUrl}
            alt={`Potret lengkap ${activeMember.name}`}
            className="mx-auto max-h-[62vh] w-full rounded-xl object-contain"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#1E2B48] pt-3.5">
            <p className="max-w-md text-xs leading-relaxed text-[#C5D2EA]">
              {activeMember.contribution}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMember}
                aria-label="Anggota sebelumnya"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#243456] bg-[#0D1526] text-[#EEF3FC] hover:bg-[#1D2D4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNextMember}
                aria-label="Anggota berikutnya"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#243456] bg-[#0D1526] text-[#EEF3FC] hover:bg-[#1D2D4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
