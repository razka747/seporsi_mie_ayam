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

export type ModerationViolation = '18+' | 'rasis-sara' | 'kasar';

const ADULT_18_PATTERNS: RegExp[] = [
  /\b18\+\b/i,
  /\b(bokep|porno|porn|pornografi|nsfw|xxx|hentai|jav|onlyfans|vcs|open\s*bo)\b/i,
  /\b(ngentot|ngentod|ngewe|memek|kontol|pepek|coli|colmek|masturbasi|mesum|cabul|bugil|telanjang|toket|tetek|pelacur|lonte|psk|perek|gigolo|jembut|titit|peler|pelir|itil|boobs|dick|pussy|slut|whore)\b/i,
  /\b(sex|seks)\b/i,
];

const RACIST_SARA_PATTERNS: RegExp[] = [
  /\b(rasis|rasisme|sara|penistaan|hina\s*agama)\b/i,
  /\b(nigger|nigga|chink|negro|kafir|murtad|aseng|antek|kadrun|cebong|kampret|pribumi\s*asli|non\s*pribumi)\b/i,
  /\b(cina\s*(bangsat|anjing|babi|kafir|tolol)|dasar\s*(cina|jawa|sunda|batak|papua|arab|yahudi|kafir))\b/i,
];

const PROFANITY_PATTERNS: RegExp[] = [
  /\b(bajingan|bangsat|anjing|anjir|anjay|asu|jancok|jancuk|jancok|dancok|kimak|pukimak|pantek|sundal|goblok|tolol|bego|pekok|idiot|brengsek|keparat|taik|tai|monyet|babi|sialan|fuck|shit|bitch|asshole|bastard)\b/i,
];

function normalizeForModeration(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[3]/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[5$]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/[._*`~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectBlockedContent(text: string): ModerationViolation | null {
  const normalized = normalizeForModeration(text);
  const rawLower = text.toLowerCase();

  for (const pattern of ADULT_18_PATTERNS) {
    if (pattern.test(rawLower) || pattern.test(normalized)) {
      return '18+';
    }
  }

  for (const pattern of RACIST_SARA_PATTERNS) {
    if (pattern.test(rawLower) || pattern.test(normalized)) {
      return 'rasis-sara';
    }
  }

  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(rawLower) || pattern.test(normalized)) {
      return 'kasar';
    }
  }

  return null;
}

export function filterCleanVisitorNotes(notes: VisitorNote[]): {
  cleanNotes: VisitorNote[];
  removedCount: number;
} {
  const cleanNotes = notes.filter(
    (note) =>
      detectBlockedContent(note.author) === null &&
      detectBlockedContent(note.message) === null,
  );
  return {
    cleanNotes,
    removedCount: notes.length - cleanNotes.length,
  };
}

export function validateVisitorNote(input: NoteInput): NoteValidationResult {
  const author = input.author.trim();
  const message = input.message.trim();
  const errors: NoteValidationResult['errors'] = {};

  if (author.length < 2) {
    errors.author = 'Nama minimal 2 karakter.';
  } else if (author.length > 48) {
    errors.author = 'Nama maksimal 48 karakter.';
  } else if (detectBlockedContent(author) !== null) {
    errors.author =
      'Nama mengandung unsur 18+, rasis, atau SARA dan otomatis dihapus.';
  }

  if (message.length < 8) {
    errors.message = 'Tulis pesan minimal 8 karakter untuk Ale atau pembaca lain.';
  } else if (message.length > 360) {
    errors.message = 'Pesan maksimal 360 karakter.';
  } else {
    const violation = detectBlockedContent(message);
    if (violation === '18+') {
      errors.message =
        'Komentar terdeteksi mengandung konten 18+ dan otomatis dihapus oleh sistem perlindungan.';
    } else if (violation === 'rasis-sara') {
      errors.message =
        'Komentar terdeteksi mengandung unsur rasis atau SARA dan otomatis dihapus oleh sistem perlindungan.';
    } else if (violation === 'kasar') {
      errors.message =
        'Komentar terdeteksi mengandung kata kasar/umpatan dan otomatis dihapus oleh sistem perlindungan.';
    }
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
