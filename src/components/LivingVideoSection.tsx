import {
  Clapperboard,
  CloudRain,
  Film,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { LIVING_SCENES, OFFICIAL_FILM_VIDEOS } from '../data/filmContent';
import { formatAudioTime } from '../utils/blogLogic';

interface SteamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface RainDrop {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
}

type VideoSectionMode = 'trailer' | 'kanvas';

export function LivingVideoSection() {
  const [activeMode, setActiveMode] = useState<VideoSectionMode>('trailer');
  const [activeVideoId, setActiveVideoId] = useState(
    OFFICIAL_FILM_VIDEOS[0].id,
  );

  const [activeSceneId, setActiveSceneId] = useState(LIVING_SCENES[0].id);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showRain, setShowRain] = useState(true);
  const [showSteam, setShowSteam] = useState(true);
  const [elapsedSec, setElapsedSec] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageLoadedRef = useRef(false);
  const timeAccumRef = useRef(0);

  const activeVideo =
    OFFICIAL_FILM_VIDEOS.find((item) => item.id === activeVideoId) ??
    OFFICIAL_FILM_VIDEOS[0];

  const scene =
    LIVING_SCENES.find((item) => item.id === activeSceneId) ?? LIVING_SCENES[0];

  const activeCaption =
    [...scene.captions]
      .reverse()
      .find((cap) => elapsedSec >= cap.atSec) ?? scene.captions[0];

  // Load crisp film still whenever active canvas scene changes
  useEffect(() => {
    if (activeMode !== 'kanvas') return;
    imageLoadedRef.current = false;
    const img = new Image();
    img.src = scene.imageUrl;
    img.onload = () => {
      imageRef.current = img;
      imageLoadedRef.current = true;
    };
    timeAccumRef.current = 0;
    setElapsedSec(0);
  }, [activeMode, scene]);

  const handleSelectScene = (sceneId: string) => {
    setActiveSceneId(sceneId);
    timeAccumRef.current = 0;
    setElapsedSec(0);
    setIsPlaying(true);
  };

  const handleJumpToCue = (atSec: number) => {
    timeAccumRef.current = atSec;
    setElapsedSec(atSec);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestartScene = () => {
    timeAccumRef.current = 0;
    setElapsedSec(0);
    setIsPlaying(true);
  };

  // Real-time opaque atmospheric film canvas (Ken Burns drift, steam, rain, Blue Moon halo, letterbox bars)
  useEffect(() => {
    if (activeMode !== 'kanvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const puffCanvas = document.createElement('canvas');
    puffCanvas.width = 64;
    puffCanvas.height = 64;
    const puffCtx = puffCanvas.getContext('2d');
    if (puffCtx) {
      const pGrad = puffCtx.createRadialGradient(32, 32, 2, 32, 32, 32);
      pGrad.addColorStop(0, 'rgba(224, 236, 255, 0.28)');
      pGrad.addColorStop(1, 'rgba(224, 236, 255, 0)');
      puffCtx.fillStyle = pGrad;
      puffCtx.fillRect(0, 0, 64, 64);
    }

    const steamParticles: SteamParticle[] = Array.from({ length: 18 }, () => ({
      x: 0.44 + Math.random() * 0.22,
      y: 0.56 + Math.random() * 0.14,
      vx: (Math.random() - 0.5) * 0.0007,
      vy: -0.0018 - Math.random() * 0.0018,
      radius: 22 + Math.random() * 28,
      alpha: 0.22 + Math.random() * 0.34,
      life: Math.random() * 110,
      maxLife: 100 + Math.random() * 70,
    }));

    const rainDrops: RainDrop[] = Array.from({ length: 65 }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 12 + Math.random() * 20,
      speed: 0.012 + Math.random() * 0.014,
      alpha: 0.14 + Math.random() * 0.22,
    }));

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    let rafId = 0;
    let lastTs = performance.now();
    let lastDrawTs = 0;
    let driftTime = 0;

    const drawFrame = (now: number) => {
      rafId = window.requestAnimationFrame(drawFrame);
      if (!isVisible && lastDrawTs > 0) return;
      if (lastDrawTs > 0 && now - lastDrawTs < 33) return;
      const dt = Math.min(0.06, (now - lastTs) / 1000);
      lastTs = now;
      lastDrawTs = now;

      if (isPlaying) {
        driftTime += dt;
        timeAccumRef.current =
          (timeAccumRef.current + dt) % scene.durationSec;
        const whole = Math.floor(timeAccumRef.current);
        setElapsedSec((prev) => (prev === whole ? prev : whole));
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Opaque cinema still backdrop with slow Ken Burns motion
      if (imageLoadedRef.current && imageRef.current) {
        const img = imageRef.current;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = w / h;
        const zoom = 1.03 + 0.03 * Math.sin(driftTime * 0.35);
        let drawW = w * zoom;
        let drawH = h * zoom;
        if (imgAspect > canvasAspect) {
          drawW = drawH * imgAspect;
        } else {
          drawH = drawW / imgAspect;
        }
        const panX = Math.sin(driftTime * 0.22) * 14;
        const dx = (w - drawW) / 2 + panX;
        const dy = (h - drawH) * 0.26;
        ctx.drawImage(img, dx, dy, drawW, drawH);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#091224');
        bgGrad.addColorStop(1, '#070B14');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Blue Moon ambient grade wash
      const moonPulse = 0.88 + 0.12 * Math.sin(now * 0.0014);
      const moonGrad = ctx.createRadialGradient(
        w * 0.22,
        h * 0.18,
        10,
        w * 0.22,
        h * 0.18,
        w * 0.45,
      );
      moonGrad.addColorStop(
        0,
        `rgba(122, 179, 255, ${0.2 * scene.moonGlow * moonPulse})`,
      );
      moonGrad.addColorStop(1, 'rgba(7, 11, 20, 0.25)');
      ctx.fillStyle = moonGrad;
      ctx.fillRect(0, 0, w, h);

      // Warm street lamp glow
      const flicker = 0.85 + 0.15 * Math.sin(now * 0.007) * Math.cos(now * 0.003);
      const warmGrad = ctx.createRadialGradient(
        w * 0.56,
        h * 0.46,
        8,
        w * 0.56,
        h * 0.46,
        w * 0.28,
      );
      warmGrad.addColorStop(0, `rgba(229, 169, 94, ${0.14 * flicker})`);
      warmGrad.addColorStop(1, 'rgba(229, 169, 94, 0)');
      ctx.fillStyle = warmGrad;
      ctx.fillRect(0, 0, w, h);

      // Rising animated steam particles using cached sprite
      if (showSteam && scene.steamLevel > 0) {
        ctx.save();
        for (const p of steamParticles) {
          if (isPlaying) {
            p.x += p.vx + Math.sin(now * 0.0015 + p.life) * 0.0003;
            p.y += p.vy * scene.steamLevel;
            p.life += 1;
            if (p.life > p.maxLife || p.y < 0.2) {
              p.x = 0.46 + Math.random() * 0.16;
              p.y = 0.62 + Math.random() * 0.08;
              p.life = 0;
            }
          }
          const fade = Math.sin((p.life / p.maxLife) * Math.PI);
          ctx.globalAlpha = Math.max(0, p.alpha * fade * scene.steamLevel);
          const size = p.radius * 2;
          ctx.drawImage(
            puffCanvas,
            p.x * w - p.radius,
            p.y * h - p.radius,
            size,
            size,
          );
        }
        ctx.restore();
      }

      // Slanted midnight rain streaks
      if (showRain && scene.rainLevel > 0) {
        ctx.lineWidth = 1;
        for (const drop of rainDrops) {
          if (isPlaying) {
            drop.y += drop.speed * (0.6 + scene.rainLevel);
            drop.x -= drop.speed * 0.18;
            if (drop.y > 1.05) {
              drop.y = -0.05;
              drop.x = Math.random() * 1.1;
            }
          }
          const rx = drop.x * w;
          const ry = drop.y * h;
          ctx.strokeStyle = `rgba(165, 202, 255, ${drop.alpha * scene.rainLevel})`;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 4, ry + drop.len);
          ctx.stroke();
        }
      }

      // Bottom measured contrast scrim + cinema letterbox bars
      const scrim = ctx.createLinearGradient(0, h * 0.58, 0, h);
      scrim.addColorStop(0, 'rgba(7, 11, 20, 0)');
      scrim.addColorStop(1, 'rgba(7, 11, 20, 0.88)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, h * 0.58, w, h * 0.42);

      ctx.fillStyle = '#050810';
      ctx.fillRect(0, 0, w, 24);
      ctx.fillRect(0, h - 24, w, 24);
    };

    rafId = window.requestAnimationFrame(drawFrame);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
    };
  }, [activeMode, isPlaying, scene, showRain, showSteam]);

  return (
    <section
      id="video-hidup"
      className="border-b border-[#1E2B48] bg-[#0B111F] py-16 lg:py-22"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col justify-between gap-6 border-b border-[#1E2B48] pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium text-[#7AB3FF]">
              Video Resmi Film &amp; Kanvas Bersuara Pemeran Asli
            </p>
            <h2
              className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#EEF3FC] lg:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Cuplikan Asli &amp; Kanvas Hidup Blue Moon
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#94A3C8]">
              Tonton trailer resmi atau masuk ke Mode Kanvas Hidup untuk
              menghidupkan adegan film dengan efek hujan &amp; uap malam serta
              mendengarkan suara pemeran asli film (Ale, Murad, Ibu) sesuai
              subtitle.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Pilih mode tayangan video"
            className="flex flex-wrap gap-1.5 rounded-lg border border-[#1E2B48] bg-[#0D1526] p-1"
          >
            <button
              role="tab"
              type="button"
              aria-selected={activeMode === 'trailer'}
              onClick={() => setActiveMode('trailer')}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-md px-4 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                activeMode === 'trailer'
                  ? 'bg-[#1D2D4F] text-[#EEF3FC]'
                  : 'text-[#94A3C8] hover:text-[#EEF3FC]'
              }`}
            >
              <Clapperboard
                className="h-3.5 w-3.5 text-[#7AB3FF]"
                aria-hidden="true"
              />
              <span>Trailer &amp; Cuplikan Resmi</span>
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={activeMode === 'kanvas'}
              onClick={() => setActiveMode('kanvas')}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-md px-4 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                activeMode === 'kanvas'
                  ? 'bg-[#1D2D4F] text-[#EEF3FC]'
                  : 'text-[#94A3C8] hover:text-[#EEF3FC]'
              }`}
            >
              <Sparkles
                className="h-3.5 w-3.5 text-[#E5A95E]"
                aria-hidden="true"
              />
              <span>Kanvas Hidup Blue Moon</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
        {activeMode === 'trailer' ? (
          <motion.div
            key="mode-trailer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-8"
          >
            <div className="flex flex-wrap gap-2">
              {OFFICIAL_FILM_VIDEOS.map((video) => {
                const selected = video.id === activeVideo.id;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActiveVideoId(video.id)}
                    className={`min-h-[40px] rounded-lg border px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                      selected
                        ? 'border-[#7AB3FF]/60 bg-[#1D2D4F] text-[#EEF3FC]'
                        : 'border-[#1E2B48] bg-[#0D1526] text-[#94A3C8] hover:text-[#EEF3FC]'
                    }`}
                  >
                    {video.code} · {video.channel}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[#1E2B48] bg-[#070B14]">
              <div className="relative aspect-[16/9] w-full bg-[#050810]">
                <iframe
                  key={activeVideo.youtubeId}
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0`}
                  title={activeVideo.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>

              <div className="flex flex-col justify-between gap-4 border-t border-[#1E2B48] bg-[#0D1526] px-6 py-5 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#7AB3FF]">
                    <span className="font-mono">{activeVideo.code}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#94A3C8]">{activeVideo.channel}</span>
                  </div>
                  <h3 className="font-editorial mt-1.5 text-2xl font-semibold text-[#EEF3FC]">
                    {activeVideo.title}
                  </h3>
                  <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#B6C4E0]">
                    {activeVideo.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mode-kanvas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              {LIVING_SCENES.map((item) => {
                const active = item.id === scene.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectScene(item.id)}
                    className={`min-h-[40px] rounded-lg border px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                      active
                        ? 'border-[#7AB3FF]/60 bg-[#1D2D4F] text-[#EEF3FC]'
                        : 'border-[#1E2B48] bg-[#0D1526] text-[#94A3C8] hover:text-[#EEF3FC]'
                    }`}
                  >
                    {item.code} · {item.title.split(' ').slice(0, 3).join(' ')}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[#1E2B48] bg-[#070B14]">
              {/* Opaque Blue Moon Living Canvas */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#050810]">
                <canvas
                  ref={canvasRef}
                  width={1120}
                  height={630}
                  data-testid="living-video-canvas"
                  data-playing={isPlaying ? 'true' : 'false'}
                  aria-label={`Kanvas adegan film: ${scene.title}`}
                  className="h-full w-full object-cover"
                />

                {/* Top cinema frame telemetry */}
                <div className="pointer-events-none absolute top-9 right-5 left-5 flex items-center justify-between text-xs font-mono text-[#D6E4FF]/90">
                  <span>
                    {scene.code} · {scene.title}
                  </span>
                  <span className="tabular-nums">
                    {formatAudioTime(elapsedSec)} /{' '}
                    {formatAudioTime(scene.durationSec)}
                  </span>
                </div>

                {/* Live synchronized subtitle & cast speaker label */}
                <div className="pointer-events-none absolute right-6 bottom-10 left-6 flex justify-center">
                  <div className="max-w-2xl rounded-lg border border-[#1E2B48]/80 bg-[#070B14]/85 px-5 py-2.5 text-center backdrop-blur-sm">
                    <p className="font-mono text-[11px] font-medium text-[#7AB3FF]">
                      {activeCaption.speaker}
                    </p>
                    <p className="mt-0.5 font-editorial text-lg italic text-[#EEF3FC] md:text-2xl">
                      {activeCaption.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Canvas Atmosphere Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1E2B48] bg-[#0D1526] px-5 py-3.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? 'Jeda kanvas hidup' : 'Putar kanvas hidup'}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#7AB3FF] px-4 py-2 text-xs font-semibold text-[#070B14] whitespace-nowrap shrink-0 transition-colors hover:bg-[#9CC7FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                  >
                    {isPlaying ? (
                      <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>{isPlaying ? 'Jeda Kanvas' : 'Putar Kanvas'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestartScene}
                    aria-label="Ulangi adegan kanvas dari awal"
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#243456] bg-[#131E36] px-3.5 py-2 text-xs font-medium text-[#EEF3FC] whitespace-nowrap shrink-0 transition-colors hover:bg-[#1D2D4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                  >
                    <RotateCcw
                      className="h-3.5 w-3.5 text-[#94A3C8]"
                      aria-hidden="true"
                    />
                    <span>Ulangi</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="hidden items-center gap-1.5 text-xs text-[#94A3C8] sm:inline-flex">
                    <Film className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Atmosfer:</span>
                  </span>
                  <button
                    type="button"
                    aria-pressed={showRain}
                    onClick={() => setShowRain((prev) => !prev)}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                      showRain
                        ? 'border-[#7AB3FF]/50 bg-[#131E36] text-[#EEF3FC]'
                        : 'border-[#1E2B48] bg-[#070B14] text-[#94A3C8]'
                    }`}
                  >
                    <CloudRain
                      className="h-3.5 w-3.5 text-[#7AB3FF]"
                      aria-hidden="true"
                    />
                    <span>Hujan {showRain ? 'Aktif' : 'Mati'}</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={showSteam}
                    onClick={() => setShowSteam((prev) => !prev)}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                      showSteam
                        ? 'border-[#E5A95E]/50 bg-[#131E36] text-[#EEF3FC]'
                        : 'border-[#1E2B48] bg-[#070B14] text-[#94A3C8]'
                    }`}
                  >
                    <Flame
                      className="h-3.5 w-3.5 text-[#E5A95E]"
                      aria-hidden="true"
                    />
                    <span>Uap Kuah {showSteam ? 'Aktif' : 'Mati'}</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Companion Panel: Real Cast Voice Player + Interactive Subtitle Cues */}
              <div className="grid grid-cols-1 gap-6 border-t border-[#1E2B48] bg-[#0B111F] p-5 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#7AB3FF]">
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                    <span>Suara Pemeran Asli &amp; Urutan Subtitle</span>
                  </div>
                  <p className="mt-1 text-xs text-[#94A3C8]">
                    {scene.subtitle}. Klik baris subtitle untuk lompat ke momen
                    tersebut pada kanvas:
                  </p>
                  <ul className="mt-3 space-y-2">
                    {scene.captions.map((cap) => {
                      const isCurrent =
                        cap.atSec === activeCaption.atSec &&
                        cap.speaker === activeCaption.speaker;
                      return (
                        <li key={`${scene.id}-${cap.atSec}`}>
                          <button
                            type="button"
                            onClick={() => handleJumpToCue(cap.atSec)}
                            className={`w-full rounded-lg border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                              isCurrent
                                ? 'border-[#7AB3FF]/60 bg-[#131E36]'
                                : 'border-[#1E2B48] bg-[#070B14]/60 hover:border-[#2C3F68] hover:bg-[#131E36]/60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                              <span className="text-[#7AB3FF]">
                                {cap.speaker}
                              </span>
                              <span className="text-[#94A3C8] tabular-nums">
                                {formatAudioTime(cap.atSec)}
                              </span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-[#EEF3FC]">
                              {cap.text}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-col justify-between lg:col-span-6">
                  <div>
                    <p className="text-xs font-medium text-[#7AB3FF]">
                      Pemutar Suara Pemeran Asli (Klip Resmi)
                    </p>
                    <p className="mt-1 text-xs text-[#94A3C8]">
                      Putar cuplikan video resmi di bawah untuk mendengarkan
                      suara pemeran asli film (Benidictus Siregar, Teuku Rifnu
                      Wikana &amp; Dewi Irawan) selagi kanvas hidup berjalan.
                    </p>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-xl border border-[#1E2B48] bg-[#050810]">
                    <div className="aspect-[16/9] w-full">
                      <iframe
                        key={`kanvas-voice-${scene.youtubeId}`}
                        src={`https://www.youtube.com/embed/${scene.youtubeId}?rel=0`}
                        title={`Suara pemeran asli: ${scene.title}`}
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full border-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </section>
  );
}
