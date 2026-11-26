import { Check, ChevronLeft, ChevronRight, Heart, Send, Shield, ShieldCheck, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type FormEvent } from 'react';
import {
  INITIAL_COMFORT_POLL,
  INITIAL_SCENE_POLL,
  INITIAL_VISITOR_NOTES,
} from '../data/filmContent';
import type { AuthUser } from '../utils/authLogic';
import {
  addVisitorNote,
  calculatePollPercentages,
  detectBlockedContent,
  filterCleanVisitorNotes,
  toggleNoteHeart,
  validateVisitorNote,
  type NoteMood,
  type PollOption,
  type VisitorNote,
} from '../utils/blogLogic';

const NOTES_STORAGE_KEY = 'bluemoon_visitor_notes_v1';
const LIKES_STORAGE_KEY = 'bluemoon_liked_notes_v1';
const SCENE_POLL_KEY = 'bluemoon_scene_poll_v1';
const COMFORT_POLL_KEY = 'bluemoon_comfort_poll_v1';
const NOTES_PER_SLIDE = 5;

const MOOD_OPTIONS: NoteMood[] = [
  'Hangat · Kaldu Ayam',
  'Sunyi · Gerimis',
  'Pulih · Fajar',
];

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

interface InteractiveVisitorSectionProps {
  currentUser?: AuthUser | null;
}

export function InteractiveVisitorSection({
  currentUser = null,
}: InteractiveVisitorSectionProps) {
  const [notes, setNotes] = useState<VisitorNote[]>(() => {
    const loaded = loadJson(NOTES_STORAGE_KEY, INITIAL_VISITOR_NOTES);
    return filterCleanVisitorNotes(loaded).cleanNotes;
  });
  const [likedIds, setLikedIds] = useState<string[]>(() =>
    loadJson(LIKES_STORAGE_KEY, []),
  );

  const [author, setAuthor] = useState(() => currentUser?.name ?? '');
  const [mood, setMood] = useState<NoteMood>('Hangat · Kaldu Ayam');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ author?: string; message?: string }>({});
  const [submitNotice, setSubmitNotice] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (currentUser?.name) {
      setAuthor(currentUser.name);
    }
  }, [currentUser]);

  // Interactive Polls state
  const [scenePoll, setScenePoll] = useState<PollOption[]>(() =>
    loadJson(SCENE_POLL_KEY, INITIAL_SCENE_POLL),
  );
  const [selectedSceneVote, setSelectedSceneVote] = useState<string | null>(() =>
    loadJson(`${SCENE_POLL_KEY}_choice`, null),
  );

  const [comfortPoll, setComfortPoll] = useState<PollOption[]>(() =>
    loadJson(COMFORT_POLL_KEY, INITIAL_COMFORT_POLL),
  );
  const [selectedComfortVote, setSelectedComfortVote] = useState<string | null>(
    () => loadJson(`${COMFORT_POLL_KEY}_choice`, null),
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      window.localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedIds));
    } catch {
      // Ignore storage quota issues
    }
  }, [notes, likedIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SCENE_POLL_KEY, JSON.stringify(scenePoll));
      window.localStorage.setItem(
        `${SCENE_POLL_KEY}_choice`,
        JSON.stringify(selectedSceneVote),
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [scenePoll, selectedSceneVote]);

  useEffect(() => {
    try {
      window.localStorage.setItem(COMFORT_POLL_KEY, JSON.stringify(comfortPoll));
      window.localStorage.setItem(
        `${COMFORT_POLL_KEY}_choice`,
        JSON.stringify(selectedComfortVote),
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [comfortPoll, selectedComfortVote]);

  const handleSubmitNote = (event: FormEvent) => {
    event.preventDefault();
    const check = validateVisitorNote({ author, mood, message });
    if (!check.valid) {
      setErrors(check.errors);
      setSubmitNotice('');
      if (detectBlockedContent(author) !== null) {
        setAuthor('');
      }
      if (detectBlockedContent(message) !== null) {
        setMessage('');
      }
      return;
    }

    setErrors({});
    const updated = addVisitorNote(notes, check.sanitized, 'Baru saja');
    setNotes(updated);
    setCurrentSlide(0);
    setAuthor('');
    setMessage('');
    setSubmitNotice('Pesanmu telah ditempelkan di meja catatan untuk Ale.');
  };

  const handleHeartToggle = (noteId: string) => {
    const result = toggleNoteHeart(notes, noteId, likedIds);
    setNotes(result.notes);
    setLikedIds(result.likedIds);
  };

  const handleDeleteNote = (noteId: string) => {
    if (!isAdmin) return;
    setNotes((prev) => prev.filter((item) => item.id !== noteId));
    setLikedIds((prev) => prev.filter((id) => id !== noteId));
  };

  const handleVoteScene = (optionId: string) => {
    if (selectedSceneVote === optionId) return;
    setScenePoll((prev) =>
      prev.map((opt) => {
        if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
        if (opt.id === selectedSceneVote)
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        return opt;
      }),
    );
    setSelectedSceneVote(optionId);
  };

  const handleVoteComfort = (optionId: string) => {
    if (selectedComfortVote === optionId) return;
    setComfortPoll((prev) =>
      prev.map((opt) => {
        if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
        if (opt.id === selectedComfortVote)
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        return opt;
      }),
    );
    setSelectedComfortVote(optionId);
  };

  const scenePollResults = calculatePollPercentages(scenePoll);
  const totalSceneVotes = scenePoll.reduce((sum, item) => sum + item.votes, 0);

  const comfortPollResults = calculatePollPercentages(comfortPoll);
  const totalComfortVotes = comfortPoll.reduce((sum, item) => sum + item.votes, 0);

  const totalSlides = Math.max(1, Math.ceil(notes.length / NOTES_PER_SLIDE));
  const safeSlide = Math.min(currentSlide, totalSlides - 1);
  const visibleNotes = notes.slice(
    safeSlide * NOTES_PER_SLIDE,
    (safeSlide + 1) * NOTES_PER_SLIDE,
  );

  return (
    <section id="interaksi" className="bg-[#070B14] py-12 sm:py-16 lg:py-22">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#7AB3FF]">
            Ruang Interaksi Pengunjung
          </p>
          <h2
            className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#EEF3FC] lg:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Tinggalkan Catatan &amp; Suarakan Refleksimu
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#94A3C8]">
            Sebagaimana warung mie ayam menjadi tempat singgah bagi Ale, ruang
            ini terbuka untuk siapa saja yang ingin menulis pesan hangat atau
            memilih adegan yang paling membekas.
          </p>
        </div>

        {/* Interaction 1: Meja Catatan untuk Ale (Guestbook + Reactions) */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <form
            onSubmit={handleSubmitNote}
            noValidate
            className="rounded-2xl border border-[#1E2B48] bg-[#0D1526] p-6 lg:col-span-5"
          >
            <h3 className="font-editorial text-2xl font-semibold text-[#EEF3FC]">
              Meja Catatan untuk Ale
            </h3>
            <p className="mt-1 text-xs text-[#94A3C8]">
              Tulis pesan untuk Ale atau bagi pengunjung lain yang sedang
              berjuang malam ini.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="visitor-name"
                  className="block text-xs font-medium text-[#D6E4FF]"
                >
                  Nama atau Inisial
                </label>
                <input
                  id="visitor-name"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Ardianta"
                  className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[#243456] bg-[#070B14] px-3.5 py-2 text-sm text-[#EEF3FC] placeholder:text-[#637499] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                />
                {errors.author && (
                  <p role="alert" className="mt-1.5 text-xs text-[#F59E0B]">
                    {errors.author}
                  </p>
                )}
              </div>

              <div>
                <span className="block text-xs font-medium text-[#D6E4FF]">
                  Nuansa Pesan
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {MOOD_OPTIONS.map((item) => {
                    const active = mood === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setMood(item)}
                        aria-pressed={active}
                        className={`min-h-[36px] rounded-md border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                          active
                            ? 'border-[#7AB3FF]/60 bg-[#1D2D4F] text-[#EEF3FC]'
                            : 'border-[#1E2B48] bg-[#070B14] text-[#94A3C8] hover:text-[#EEF3FC]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="visitor-message"
                  className="block text-xs font-medium text-[#D6E4FF]"
                >
                  Pesan atau Refleksi
                </label>
                <textarea
                  id="visitor-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan perasaanmu setelah menonton atau mendengarkan kisah Ale..."
                  className="mt-1.5 w-full rounded-lg border border-[#243456] bg-[#070B14] px-3.5 py-2.5 text-sm leading-relaxed text-[#EEF3FC] placeholder:text-[#637499] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                />
                {errors.message && (
                  <p role="alert" className="mt-1.5 text-xs text-[#F59E0B]">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#7AB3FF] px-5 py-2.5 text-sm font-semibold text-[#070B14] transition-colors hover:bg-[#9CC7FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>Kirim Pesan untuk Ale</span>
              </button>

              <p className="flex items-center gap-1.5 text-[11px] text-[#94A3C8]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#7AB3FF]" aria-hidden="true" />
                <span>
                  Perlindungan otomatis aktif: komentar 18+, kata kasar, rasis, atau SARA akan otomatis dihapus.
                </span>
              </p>

              {submitNotice && (
                <p
                  role="status"
                  className="flex items-center gap-2 text-xs text-[#7AB3FF]"
                >
                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{submitNotice}</span>
                </p>
              )}
            </div>
          </form>

          {/* Visitor Notes Wall */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2B48] pb-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-editorial text-2xl font-semibold text-[#EEF3FC]">
                  Dinding Catatan Penonton
                </h3>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#E5A95E]/50 bg-[#E5A95E]/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#E5A95E]">
                    <Shield className="h-3 w-3" aria-hidden="true" />
                    <span>MODE ADMIN</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 font-mono text-xs text-[#94A3C8] tabular-nums">
                {totalSlides > 1 && (
                  <span className="rounded-md border border-[#1E2B48] bg-[#0D1526] px-2 py-0.5 text-[#7AB3FF]">
                    Slide {safeSlide + 1}/{totalSlides}
                  </span>
                )}
                <span>{notes.length} catatan tersimpan</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.ul
                key={`notes-slide-${safeSlide}`}
                data-testid="visitor-notes-list"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="mt-5 space-y-4"
              >
                {visibleNotes.map((note) => {
                  const isLiked = likedIds.includes(note.id);
                  return (
                    <motion.li
                      layout
                      key={note.id}
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.22 }}
                      className="rounded-xl border border-[#1E2B48] bg-[#0D1526] p-4 transition-colors hover:border-[#2C3F68] sm:p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3C8]">
                          <span className="font-semibold text-[#EEF3FC]">
                            {note.author}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{note.mood}</span>
                          <span aria-hidden="true">·</span>
                          <span>{note.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.86 }}
                            onClick={() => handleHeartToggle(note.id)}
                            aria-pressed={isLiked}
                            aria-label={`Sukai catatan dari ${note.author}`}
                            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                              isLiked
                                ? 'border-[#7AB3FF]/60 bg-[#1D2D4F] text-[#EEF3FC]'
                                : 'border-[#1E2B48] bg-[#070B14] text-[#94A3C8] hover:text-[#EEF3FC]'
                            }`}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 transition-transform ${
                                isLiked ? 'scale-110 fill-[#7AB3FF] text-[#7AB3FF]' : ''
                              }`}
                              aria-hidden="true"
                            />
                            <span>{note.hearts}</span>
                          </motion.button>

                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteNote(note.id)}
                              aria-label={`Hapus catatan dari ${note.author}`}
                              title="Hapus komentar (Admin)"
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-[#E5A95E]/40 bg-[#1A1510] px-2.5 py-1 text-xs font-medium text-[#F5D3A1] transition-colors hover:border-[#E5A95E] hover:bg-[#2A2016]"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="hidden sm:inline">Hapus</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-[#C5D2EA]">
                        {note.message}
                      </p>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>

            {totalSlides > 1 && (
              <div
                aria-label="Navigasi slide catatan pengunjung"
                className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E2B48] bg-[#0D1526] px-3.5 py-2.5"
              >
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                  disabled={safeSlide === 0}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-[#243456] bg-[#131E36] px-3 py-1.5 text-xs font-medium text-[#EEF3FC] transition-colors hover:bg-[#1D2D4F] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex flex-wrap items-center gap-1.5">
                  {Array.from({ length: totalSlides }, (_, idx) => {
                    const active = idx === safeSlide;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Buka slide catatan ${idx + 1}`}
                        aria-current={active ? 'page' : undefined}
                        className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg border px-2 font-mono text-xs font-medium tabular-nums transition-colors ${
                          active
                            ? 'border-[#7AB3FF]/70 bg-[#7AB3FF] text-[#070B14]'
                            : 'border-[#1E2B48] bg-[#070B14] text-[#94A3C8] hover:border-[#2C3F68] hover:text-[#EEF3FC]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))
                  }
                  disabled={safeSlide >= totalSlides - 1}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-[#243456] bg-[#131E36] px-3 py-1.5 text-xs font-medium text-[#EEF3FC] transition-colors hover:bg-[#1D2D4F] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Interaction 2: Jajak Rasa & Refleksi Penonton */}
        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-[#1E2B48] pt-12 lg:grid-cols-2">
          {/* Poll A */}
          <div className="rounded-2xl border border-[#1E2B48] bg-[#0D1526] p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-editorial text-2xl font-semibold text-[#EEF3FC]">
                Adegan Paling Menggetarkan
              </h3>
              <span className="font-mono text-xs text-[#94A3C8] tabular-nums">
                {totalSceneVotes} suara
              </span>
            </div>
            <p className="mt-1 text-xs text-[#94A3C8]">
              Pilih satu momen dalam film yang paling melekat di ingatanmu.
            </p>

            <div className="mt-5 space-y-3">
              {scenePollResults.map((option) => {
                const chosen = selectedSceneVote === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleVoteScene(option.id)}
                    aria-pressed={chosen}
                    className={`relative block w-full overflow-hidden rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                      chosen
                        ? 'border-[#7AB3FF]/70 bg-[#131E36]'
                        : 'border-[#1E2B48] bg-[#070B14]/60 hover:border-[#2C3F68]'
                    }`}
                  >
                    <motion.div
                      aria-hidden="true"
                      initial={false}
                      animate={{ scaleX: option.percentage / 100 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                      className="pointer-events-none absolute inset-y-0 left-0 w-full origin-left bg-[#7AB3FF]/14"
                    />
                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#EEF3FC]">
                          {option.label}
                        </p>
                        <p className="mt-0.5 text-xs text-[#94A3C8]">
                          {option.detail}
                        </p>
                      </div>
                      <div className="text-right font-mono text-xs tabular-nums shrink-0">
                        <span className="block font-semibold text-[#7AB3FF]">
                          {option.percentage}%
                        </span>
                        <span className="text-[11px] text-[#94A3C8]">
                          {option.votes}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Poll B */}
          <div className="rounded-2xl border border-[#1E2B48] bg-[#0D1526] p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-editorial text-2xl font-semibold text-[#EEF3FC]">
                Penghangat Saat Hari Berat
              </h3>
              <span className="font-mono text-xs text-[#94A3C8] tabular-nums">
                {totalComfortVotes} suara
              </span>
            </div>
            <p className="mt-1 text-xs text-[#94A3C8]">
              Jika malam terasa seperti malamnya Ale, hal kecil apa yang paling
              sering menolongmu bertahan?
            </p>

            <div className="mt-5 space-y-3">
              {comfortPollResults.map((option) => {
                const chosen = selectedComfortVote === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleVoteComfort(option.id)}
                    aria-pressed={chosen}
                    className={`relative block w-full overflow-hidden rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                      chosen
                        ? 'border-[#7AB3FF]/70 bg-[#131E36]'
                        : 'border-[#1E2B48] bg-[#070B14]/60 hover:border-[#2C3F68]'
                    }`}
                  >
                    <motion.div
                      aria-hidden="true"
                      initial={false}
                      animate={{ scaleX: option.percentage / 100 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                      className="pointer-events-none absolute inset-y-0 left-0 w-full origin-left bg-[#E5A95E]/16"
                    />
                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#EEF3FC]">
                          {option.label}
                        </p>
                        <p className="mt-0.5 text-xs text-[#94A3C8]">
                          {option.detail}
                        </p>
                      </div>
                      <div className="text-right font-mono text-xs tabular-nums shrink-0">
                        <span className="block font-semibold text-[#E5A95E]">
                          {option.percentage}%
                        </span>
                        <span className="text-[11px] text-[#94A3C8]">
                          {option.votes}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
