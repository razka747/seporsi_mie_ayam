import {
  ChevronDown,
  ChevronUp,
  Disc3,
  Loader2,
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  Youtube,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { PLAYLIST_TRACKS, type PlaylistTrack } from '../data/filmContent';
import { formatAudioTime } from '../utils/blogLogic';

interface PlaylistSectionProps {
  activeTrack: PlaylistTrack;
  isPlaying: boolean;
  isBuffering?: boolean;
  currentTime: number;
  duration: number;
  levels: number[];
  volume: number;
  audioError: string | null;
  onTogglePlay: () => void;
  onSelectTrack: (trackId: string) => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
}

export function PlaylistSection({
  activeTrack,
  isPlaying,
  isBuffering = false,
  currentTime,
  duration,
  levels,
  volume,
  audioError,
  onTogglePlay,
  onSelectTrack,
  onPrevTrack,
  onNextTrack,
  onSeek,
  onVolumeChange,
}: PlaylistSectionProps) {
  const [showSpotify, setShowSpotify] = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);

  const effectiveDuration =
    duration > 0 ? duration : activeTrack.durationSec;
  const progressPercent =
    effectiveDuration > 0
      ? Math.min(100, (currentTime / effectiveDuration) * 100)
      : 0;

  const activeLyric =
    [...activeTrack.lyrics]
      .reverse()
      .find((entry) => currentTime >= entry.atSec) ?? activeTrack.lyrics[0];

  return (
    <section
      id="playlist"
      className="border-b border-[#1E2B48] bg-[#0B111F] py-12 sm:py-16 lg:py-22"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#7AB3FF]">
            Playlist Blue Moon · Lagu Asli Durasi Penuh
          </p>
          <h2
            className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#EEF3FC] lg:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Lagu Asli “Let Down” — Radiohead &amp; Resonansi Kisah Ale
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#94A3C8]">
            Musik di bawah ini merangkum perjalanan batin Ale sepanjang malam
            ulang tahunnya yang ke-37: rasa terhimpit rutinitas dan kesepian
            dalam <em className="text-[#EEF3FC]">Let Down</em> dan{' '}
            <em className="text-[#EEF3FC]">No Surprises</em>, luapan luka
            pendam dalam <em className="text-[#EEF3FC]">Exit Music</em>, hingga
            keberanian merakit ulang hati dan pulang kepada keluarga lewat{' '}
            <em className="text-[#EEF3FC]">Ada Titik-Titik di Ujung Doa</em>.
          </p>
        </div>

        <div
          data-testid="playlist-player"
          data-playing={isPlaying ? 'true' : 'false'}
          data-track-id={activeTrack.id}
          className="mt-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12"
        >
          {/* Left: Full-Track Official Console + Embedded YouTube Stream */}
          <div className="flex h-full flex-col justify-between rounded-2xl border border-[#1E2B48] bg-[#0D1526] p-4 sm:p-6 lg:col-span-7">
            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Tactile Blue Moon Vinyl Disc */}
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#2C3F68] bg-gradient-to-br from-[#131E36] via-[#070B14] to-[#1A2948]">
                  {isPlaying && (
                    <motion.span
                      aria-hidden="true"
                      animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.7, 0.35] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -inset-1.5 rounded-full bg-[#7AB3FF]/20 blur-md"
                    />
                  )}
                  <Disc3
                    className={`relative z-10 h-12 w-12 text-[#7AB3FF] ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '6s' }}
                    aria-hidden="true"
                  />
                  <span className="sr-only">Piringan Blue Moon</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3C8]">
                    <span className="font-mono tabular-nums text-[#7AB3FF]">
                      Trek {activeTrack.trackNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeTrack.keyLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {activeTrack.artistLabel}
                    </span>
                  </div>

                  <h3 className="font-editorial mt-1.5 text-2xl font-semibold text-[#EEF3FC] lg:text-3xl">
                    {activeTrack.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#94A3C8]">
                    {activeTrack.subtitle}
                  </p>
                </div>
              </div>

              {/* Real-time Audio Frequency Visualizer */}
              <div
                aria-hidden="true"
                className="mt-6 flex h-12 items-end gap-1.5 rounded-xl border border-[#1E2B48] bg-[#070B14] px-4 py-2.5"
              >
                {levels.map((level, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-sm bg-[#7AB3FF] transition-transform duration-150"
                    style={{
                      height: '100%',
                      transformOrigin: 'bottom',
                      transform: `scaleY(${Math.max(0.12, Math.min(1, level))})`,
                      opacity: isPlaying ? 0.45 + level * 0.55 : 0.25,
                    }}
                  />
                ))}
              </div>

              {/* Full-Song Synchronized Lyric & Ale Context */}
              <div className="mt-4 rounded-xl border border-[#1E2B48] bg-[#070B14]/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium text-[#7AB3FF]">
                    Lirik Penuh &amp; Kisah Ale Saat Ini
                  </p>
                  <span className="font-mono text-[11px] text-[#94A3C8]">
                    Durasi Penuh 0:00 – {formatAudioTime(effectiveDuration)}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTrack.id}-${activeLyric.atSec}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="font-editorial mt-1.5 text-xl italic text-[#EEF3FC]">
                      “{activeLyric.lyric}”
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#94A3C8]">
                      {activeLyric.aleNote}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {audioError && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-[#E5A95E]/40 bg-[#1A1510] px-3.5 py-2.5 text-xs text-[#F5D3A1]"
              >
                {audioError}
              </p>
            )}

            {/* Full-Length Scrubber + Transport Controls */}
            <div className="mt-5 border-t border-[#1E2B48] pt-5">
              <div className="flex items-center gap-3">
                <span className="w-11 font-mono text-xs text-[#94A3C8] tabular-nums">
                  {formatAudioTime(currentTime)}
                </span>
                <input
                  type="range"
                  aria-label="Atur posisi waktu lagu"
                  min={0}
                  max={Math.max(1, Math.floor(effectiveDuration))}
                  value={Math.min(
                    Math.floor(effectiveDuration),
                    Math.floor(currentTime),
                  )}
                  onChange={(e) => onSeek(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer accent-[#7AB3FF]"
                />
                <span className="w-11 text-right font-mono text-xs text-[#94A3C8] tabular-nums">
                  {formatAudioTime(effectiveDuration)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onPrevTrack}
                    aria-label="Lagu sebelumnya"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#243456] bg-[#131E36] text-[#EEF3FC] transition-colors hover:bg-[#1D2D4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                  >
                    <SkipBack className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onTogglePlay}
                    aria-label={
                      isBuffering
                        ? 'Sedang memuat lagu'
                        : isPlaying
                          ? 'Jeda musik'
                          : 'Putar lagu penuh'
                    }
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#7AB3FF] px-5 py-2.5 text-sm font-semibold text-[#070B14] whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(122,179,255,0.22)] transition-colors hover:bg-[#9CC7FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                  >
                    {isBuffering ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : isPlaying ? (
                      <Pause className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Play className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>
                      {isBuffering
                        ? 'Memuat Audio...'
                        : isPlaying
                          ? 'Jeda Lagu'
                          : 'Putar Lagu Penuh'}
                    </span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={onNextTrack}
                    aria-label="Lagu berikutnya"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#243456] bg-[#131E36] text-[#EEF3FC] transition-colors hover:bg-[#1D2D4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                  >
                    <SkipForward className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <Volume2
                    className="h-4 w-4 text-[#94A3C8]"
                    aria-hidden="true"
                  />
                  <label htmlFor="playlist-volume" className="sr-only">
                    Volume musik
                  </label>
                  <input
                    id="playlist-volume"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="h-1.5 w-24 cursor-pointer accent-[#7AB3FF]"
                  />
                  <span className="w-9 font-mono text-xs text-[#94A3C8] tabular-nums">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-[#1E2B48] pt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-expanded={showYoutube}
                    onClick={() => {
                      setShowYoutube((prev) => !prev);
                      setShowSpotify(false);
                    }}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                      showYoutube
                        ? 'border-[#7AB3FF]/60 bg-[#1D2D4F] text-[#EEF3FC]'
                        : 'border-[#243456] bg-[#131E36] text-[#EEF3FC] hover:border-[#7AB3FF]/50 hover:bg-[#1D2D4F]'
                    }`}
                  >
                    <Youtube
                      className="h-3.5 w-3.5 text-[#7AB3FF]"
                      aria-hidden="true"
                    />
                    <span>Putar via YouTube</span>
                    {showYoutube ? (
                      <ChevronUp className="h-3.5 w-3.5 text-[#94A3C8]" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-[#94A3C8]" aria-hidden="true" />
                    )}
                  </button>

                  {activeTrack.spotifyTrackId && (
                    <button
                      type="button"
                      aria-expanded={showSpotify}
                      onClick={() => {
                        setShowSpotify((prev) => !prev);
                        setShowYoutube(false);
                      }}
                      className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                        showSpotify
                          ? 'border-[#7AB3FF]/60 bg-[#1D2D4F] text-[#EEF3FC]'
                          : 'border-[#243456] bg-[#131E36] text-[#EEF3FC] hover:border-[#7AB3FF]/50 hover:bg-[#1D2D4F]'
                      }`}
                    >
                      <Music2
                        className="h-3.5 w-3.5 text-[#7AB3FF]"
                        aria-hidden="true"
                      />
                      <span>Pemutar Spotify</span>
                      {showSpotify ? (
                        <ChevronUp
                          className="h-3.5 w-3.5 text-[#94A3C8]"
                          aria-hidden="true"
                        />
                      ) : (
                        <ChevronDown
                          className="h-3.5 w-3.5 text-[#94A3C8]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )}
                </div>

                {showYoutube && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-[#1E2B48] bg-[#070B14]">
                    <div className="aspect-[16/9] w-full">
                      <iframe
                        key={`yt-audio-${activeTrack.youtubeId}`}
                        src={`https://www.youtube.com/embed/${activeTrack.youtubeId}?rel=0`}
                        title={`Pemutar YouTube untuk ${activeTrack.title}`}
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full border-0"
                      />
                    </div>
                  </div>
                )}

                {showSpotify && activeTrack.spotifyTrackId && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-[#1E2B48] bg-[#070B14]">
                    <iframe
                      key={`spotify-${activeTrack.spotifyTrackId}`}
                      src={`https://open.spotify.com/embed/track/${activeTrack.spotifyTrackId}?utm_source=generator&theme=0`}
                      width="100%"
                      height="152"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={`Pemutar Spotify untuk ${activeTrack.title}`}
                      className="border-0"
                    />
                  </div>
                )}
              </div>

              <div className="sr-only" aria-live="polite">
                {isPlaying
                  ? `Memutar penuh ${activeTrack.title} pada ${Math.round(progressPercent)} persen`
                  : `Lagu dijeda: ${activeTrack.title}`}
              </div>
            </div>
          </div>

          {/* Right: Tracklist & Story Liner Notes */}
          <div className="flex h-full flex-col justify-between rounded-2xl border border-[#1E2B48] bg-[#0D1526] p-6 lg:col-span-5">
            <div>
              <h3 className="font-editorial text-2xl font-semibold text-[#EEF3FC]">
                Daftar Putar Kisah Ale
              </h3>
              <p className="mt-1 text-xs text-[#94A3C8]">
                Pilih lagu untuk memutar versi penuh dari awal sampai selesai.
              </p>

              <ul className="mt-4 space-y-2">
                {PLAYLIST_TRACKS.map((track) => {
                  const selected = track.id === activeTrack.id;
                  return (
                    <li key={track.id}>
                      <button
                        type="button"
                        onClick={() => onSelectTrack(track.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                          selected
                            ? 'border-[#7AB3FF]/60 bg-[#131E36]'
                            : 'border-[#1E2B48] bg-[#070B14]/50 hover:border-[#2C3F68] hover:bg-[#131E36]/60'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-[#94A3C8]">
                            <span className="font-mono tabular-nums text-[#7AB3FF]">
                              {track.trackNumber}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{track.keyLabel}</span>
                          </div>
                          <p className="mt-0.5 truncate text-sm font-medium text-[#EEF3FC]">
                            {track.title}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-[#94A3C8]">
                            {track.storyContext}
                          </p>
                        </div>

                        <span className="shrink-0 font-mono text-xs text-[#94A3C8] tabular-nums">
                          {formatAudioTime(track.durationSec)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-4 border-t border-[#1E2B48] pt-3.5 text-xs leading-relaxed text-[#94A3C8]">
              Semua trek memutar rekaman asli secara utuh (0:00–selesai) dan
              berlanjut otomatis ke lagu berikutnya.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
