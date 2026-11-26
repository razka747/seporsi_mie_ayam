import type { PlaylistTrack } from '../data/filmContent';

export interface AudioFrameState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  levels: number[];
  errorMessage: string | null;
}

export class BlueMoonAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private vizTimer: number | null = null;
  private currentTrack: PlaylistTrack;
  private isPlaying = false;
  private currentTime = 0;
  private duration: number;
  private volume = 0.85;
  private errorMessage: string | null = null;
  private onUpdate: (state: AudioFrameState) => void;
  private onTrackEnd: () => void;

  constructor(
    initialTrack: PlaylistTrack,
    onUpdate: (state: AudioFrameState) => void,
    onTrackEnd: () => void,
  ) {
    this.currentTrack = initialTrack;
    this.duration = initialTrack.durationSec;
    this.onUpdate = onUpdate;
    this.onTrackEnd = onTrackEnd;

    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.volume = this.volume;
      audio.src = initialTrack.audioUrl;

      audio.addEventListener('loadedmetadata', this.handleMetadata);
      audio.addEventListener('durationchange', this.handleMetadata);
      audio.addEventListener('timeupdate', this.handleTimeUpdate);
      audio.addEventListener('ended', this.handleEnded);
      audio.addEventListener('pause', this.handlePauseEvent);
      audio.addEventListener('playing', this.handlePlayingEvent);
      audio.addEventListener('error', this.handleError);

      this.audio = audio;
    }
  }

  private handleMetadata = (): void => {
    if (!this.audio) return;
    if (Number.isFinite(this.audio.duration) && this.audio.duration > 0) {
      this.duration = this.audio.duration;
      this.emitState();
    }
  };

  private handleTimeUpdate = (): void => {
    if (!this.audio) return;
    this.currentTime = this.audio.currentTime || 0;
    if (Number.isFinite(this.audio.duration) && this.audio.duration > 0) {
      this.duration = this.audio.duration;
    }
    this.emitState();
  };

  private handlePlayingEvent = (): void => {
    this.isPlaying = true;
    this.errorMessage = null;
    this.startVizLoop();
    this.emitState();
  };

  private handlePauseEvent = (): void => {
    this.isPlaying = false;
    this.stopVizLoop();
    this.emitState();
  };

  private handleEnded = (): void => {
    this.isPlaying = false;
    this.currentTime = 0;
    this.stopVizLoop();
    this.emitState();
    this.onTrackEnd();
  };

  private handleError = (): void => {
    this.isPlaying = false;
    this.stopVizLoop();
    this.errorMessage =
      'Gagal memuat aliran audio penuh. Coba tekan putar kembali atau gunakan pemutar alternatif Spotify di bawah.';
    this.emitState();
  };

  public setTrack(track: PlaylistTrack, autoPlay = false): void {
    const shouldPlay = autoPlay || this.isPlaying;
    this.currentTrack = track;
    this.currentTime = 0;
    this.duration = track.durationSec;
    this.errorMessage = null;

    if (this.audio) {
      this.audio.pause();
      this.audio.src = track.audioUrl;
      this.audio.load();
    }

    this.emitState();

    if (shouldPlay) {
      this.play();
    }
  }

  public setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  public seek(seconds: number): void {
    const clamped = Math.max(0, Math.min(this.duration, seconds));
    this.currentTime = clamped;
    if (this.audio) {
      this.audio.currentTime = clamped;
    }
    this.emitState();
  }

  public play(): void {
    if (!this.audio) return;
    this.errorMessage = null;
    this.audio.volume = this.volume;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.startVizLoop();
          this.emitState();
        })
        .catch((err: unknown) => {
          const name =
            err && typeof err === 'object' && 'name' in err
              ? String((err as { name: unknown }).name)
              : '';
          if (name === 'AbortError') return;
          this.isPlaying = false;
          this.stopVizLoop();
          this.errorMessage =
            'Pemutaran audio memerlukan interaksi tombol putar secara langsung di peramban ini.';
          this.emitState();
        });
    }
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.stopVizLoop();
    this.emitState();
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public destroy(): void {
    this.stopVizLoop();
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('loadedmetadata', this.handleMetadata);
      this.audio.removeEventListener('durationchange', this.handleMetadata);
      this.audio.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.audio.removeEventListener('ended', this.handleEnded);
      this.audio.removeEventListener('pause', this.handlePauseEvent);
      this.audio.removeEventListener('playing', this.handlePlayingEvent);
      this.audio.removeEventListener('error', this.handleError);
      this.audio.src = '';
      this.audio = null;
    }
  }

  private startVizLoop(): void {
    this.stopVizLoop();
    this.vizTimer = window.setInterval(() => {
      if (this.audio && this.isPlaying) {
        this.currentTime = this.audio.currentTime || this.currentTime;
        if (Number.isFinite(this.audio.duration) && this.audio.duration > 0) {
          this.duration = this.audio.duration;
        }
        this.emitState();
      }
    }, 180);
  }

  private stopVizLoop(): void {
    if (this.vizTimer !== null) {
      window.clearInterval(this.vizTimer);
      this.vizTimer = null;
    }
  }

  private emitState(): void {
    const bars = 24;
    const levels: number[] = [];
    const t = this.currentTime;

    for (let i = 0; i < bars; i++) {
      if (this.isPlaying) {
        const wave =
          0.26 +
          0.38 * Math.abs(Math.sin(t * 4.4 + i * 0.55)) +
          0.26 * Math.abs(Math.cos(t * 2.2 - i * 0.32));
        levels.push(Math.min(1, wave));
      } else {
        levels.push(0.14 + (i % 3) * 0.05);
      }
    }

    this.onUpdate({
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      levels,
      errorMessage: this.errorMessage,
    });
  }
}
