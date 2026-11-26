export type PhotoCategory =
  | 'Semua'
  | 'Sosok Ale'
  | 'Warung & Pertemuan'
  | 'Keluarga & Harapan';

export interface FilmPhoto {
  id: string;
  title: string;
  category: Exclude<PhotoCategory, 'Semua'>;
  imageUrl: string;
  frameCode: string;
  lensMeta: string;
  aspect: 'wide' | 'standard';
  caption: string;
  directorNote: string;
}

export type NoteMood = 'Hangat · Kaldu Ayam' | 'Sunyi · Gerimis' | 'Pulih · Fajar';

export interface VisitorNote {
  id: string;
  author: string;
  mood: NoteMood;
  message: string;
  createdAt: string;
  hearts: number;
}

export interface NoteInput {
  author: string;
  mood: NoteMood;
  message: string;
}

export interface NoteValidationResult {
  valid: boolean;
  errors: {
    author?: string;
    message?: string;
  };
  sanitized: NoteInput;
}

export interface PollOption {
  id: string;
  label: string;
  detail: string;
  votes: number;
}

export interface PollOptionWithPercent extends PollOption {
  percentage: number;
}

export function filterPhotosByScene(
  photos: FilmPhoto[],
  category: PhotoCategory,
): FilmPhoto[] {
  if (category === 'Semua') {
    return photos;
  }
  return photos.filter((photo) => photo.category === category);
}

export function validateVisitorNote(input: NoteInput): NoteValidationResult {
  const author = input.author.trim();
  const message = input.message.trim();
  const errors: NoteValidationResult['errors'] = {};

  if (author.length < 2) {
    errors.author = 'Nama minimal 2 karakter.';
  } else if (author.length > 48) {
    errors.author = 'Nama maksimal 48 karakter.';
  }

  if (message.length < 8) {
    errors.message = 'Tulis pesan minimal 8 karakter untuk Ale atau pembaca lain.';
  } else if (message.length > 360) {
    errors.message = 'Pesan maksimal 360 karakter.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      author,
      mood: input.mood,
      message,
    },
  };
}

export function addVisitorNote(
  existingNotes: VisitorNote[],
  input: NoteInput,
  nowLabel = 'Baru saja',
): VisitorNote[] {
  const newNote: VisitorNote = {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    author: input.author.trim(),
    mood: input.mood,
    message: input.message.trim(),
    createdAt: nowLabel,
    hearts: 1,
  };
  return [newNote, ...existingNotes];
}

export function toggleNoteHeart(
  notes: VisitorNote[],
  noteId: string,
  likedIds: string[],
): { notes: VisitorNote[]; likedIds: string[] } {
  const alreadyLiked = likedIds.includes(noteId);
  const nextLikedIds = alreadyLiked
    ? likedIds.filter((id) => id !== noteId)
    : [...likedIds, noteId];

  const nextNotes = notes.map((note) => {
    if (note.id !== noteId) {
      return note;
    }
    const delta = alreadyLiked ? -1 : 1;
    return {
      ...note,
      hearts: Math.max(0, note.hearts + delta),
    };
  });

  return { notes: nextNotes, likedIds: nextLikedIds };
}

export function calculatePollPercentages(
  options: PollOption[],
): PollOptionWithPercent[] {
  const totalVotes = options.reduce((sum, item) => sum + Math.max(0, item.votes), 0);
  if (totalVotes === 0) {
    return options.map((opt) => ({ ...opt, percentage: 0 }));
  }

  return options.map((opt) => ({
    ...opt,
    percentage: Math.round((Math.max(0, opt.votes) / totalVotes) * 100),
  }));
}

export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
