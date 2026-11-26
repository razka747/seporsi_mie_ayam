import { useEffect, useRef, useState } from 'react';
import { EssaySection } from './components/EssaySection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InteractiveVisitorSection } from './components/InteractiveVisitorSection';
import { LivingVideoSection } from './components/LivingVideoSection';
import { PlaylistSection } from './components/PlaylistSection';
import { TeamSection } from './components/TeamSection';
import { PLAYLIST_TRACKS } from './data/filmContent';
import { BlueMoonAudioEngine } from './utils/blueMoonAudio';

export default function App() {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(PLAYLIST_TRACKS[0].durationSec);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.85);
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: 24 }, (_, idx) => 0.16 + (idx % 3) * 0.05),
  );

  const engineRef = useRef<BlueMoonAudioEngine | null>(null);
  const activeTrackIndexRef = useRef(activeTrackIndex);
  activeTrackIndexRef.current = activeTrackIndex;

  const activeTrack = PLAYLIST_TRACKS[activeTrackIndex] ?? PLAYLIST_TRACKS[0];

  useEffect(() => {
    const engine = new BlueMoonAudioEngine(
      PLAYLIST_TRACKS[0],
      (frame) => {
        setIsPlaying(frame.isPlaying);
        setCurrentTime(frame.currentTime);
        setDuration(frame.duration);
        setLevels(frame.levels);
        setAudioError(frame.errorMessage);
      },
      () => {
        const nextIndex =
          (activeTrackIndexRef.current + 1) % PLAYLIST_TRACKS.length;
        setActiveTrackIndex(nextIndex);
        engine.setTrack(PLAYLIST_TRACKS[nextIndex], true);
      },
    );
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleTogglePlay = () => {
    engineRef.current?.toggle();
  };

  const handlePlayLetDown = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (activeTrackIndex !== 0) {
      setActiveTrackIndex(0);
      engine.setTrack(PLAYLIST_TRACKS[0], true);
    } else {
      engine.toggle();
    }
  };

  const handleSelectTrack = (trackId: string) => {
    const idx = PLAYLIST_TRACKS.findIndex((t) => t.id === trackId);
    if (idx < 0) return;
    setActiveTrackIndex(idx);
    engineRef.current?.setTrack(PLAYLIST_TRACKS[idx], true);
  };

  const handlePrevTrack = () => {
    const prevIdx =
      (activeTrackIndex - 1 + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
    setActiveTrackIndex(prevIdx);
    engineRef.current?.setTrack(PLAYLIST_TRACKS[prevIdx], true);
  };

  const handleNextTrack = () => {
    const nextIdx = (activeTrackIndex + 1) % PLAYLIST_TRACKS.length;
    setActiveTrackIndex(nextIdx);
    engineRef.current?.setTrack(PLAYLIST_TRACKS[nextIdx], true);
  };

  const handleSeek = (seconds: number) => {
    engineRef.current?.seek(seconds);
  };

  const handleVolumeChange = (nextVol: number) => {
    setVolume(nextVol);
    engineRef.current?.setVolume(nextVol);
  };

  const handleHeaderToggleAudio = () => {
    if (isPlaying) {
      engineRef.current?.pause();
    } else {
      handlePlayLetDown();
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#EEF3FC]">
      <Header isPlaying={isPlaying} onToggleAudio={handleHeaderToggleAudio} />
      <main>
        <HeroSection
          isPlaying={isPlaying && activeTrack.id === 'let-down'}
          onPlayLetDown={handlePlayLetDown}
        />
        <EssaySection />
        <LivingVideoSection />
        <GallerySection />
        <PlaylistSection
          activeTrack={activeTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          levels={levels}
          volume={volume}
          audioError={audioError}
          onTogglePlay={handleTogglePlay}
          onSelectTrack={handleSelectTrack}
          onPrevTrack={handlePrevTrack}
          onNextTrack={handleNextTrack}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
        />
        <InteractiveVisitorSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
