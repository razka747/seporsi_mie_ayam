import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addVisitorNote,
  calculatePollPercentages,
  detectBlockedContent,
  filterCleanVisitorNotes,
  filterPhotosByScene,
  formatAudioTime,
  toggleNoteHeart,
  validateVisitorNote,
  type FilmPhoto,
  type VisitorNote,
} from './blogLogic';

const samplePhotos: FilmPhoto[] = [
  {
    id: 'p1',
    title: 'Ale di Depan Gerobak Biru',
    category: 'Warung & Pertemuan',
    imageUrl: '/film/ale_gerobak_biru.jpg',
    frameCode: 'SCN-01',
    lensMeta: 'Trailer Resmi',
    aspect: 'wide',
    caption: 'Ale berdiri di depan gerobak mie ayam biru.',
    directorNote: 'Catatan sutradara.',
  },
  {
    id: 'p2',
    title: 'Ulang Tahun Sendirian',
    category: 'Sosok Ale',
    imageUrl: '/film/ale_ulang_tahun.jpg',
    frameCode: 'SCN-02',
    lensMeta: 'Teaser Resmi',
    aspect: 'standard',
    caption: 'Ale di kamar kosnya pada hari ulang tahun.',
    directorNote: 'Catatan adegan.',
  },
];

test('filterPhotosByScene returns all or matching scene category', () => {
  assert.equal(filterPhotosByScene(samplePhotos, 'Semua').length, 2);
  const filtered = filterPhotosByScene(samplePhotos, 'Warung & Pertemuan');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'p1');
});

test('validateVisitorNote rejects empty or too short inputs and trims valid ones', () => {
  const invalid = validateVisitorNote({
    author: 'A',
    mood: 'Sunyi · Gerimis',
    message: 'Pendek',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.author);
  assert.ok(invalid.errors.message);

  const valid = validateVisitorNote({
    author: '  Nadia  ',
    mood: 'Hangat · Kaldu Ayam',
    message: '  Terima kasih Ale sudah memilih makan seporsi mie ayam dulu.  ',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.sanitized.author, 'Nadia');
  assert.equal(
    valid.sanitized.message,
    'Terima kasih Ale sudah memilih makan seporsi mie ayam dulu.',
  );
});

test('addVisitorNote prepends new note and toggleNoteHeart increments/decrements cleanly', () => {
  const initial: VisitorNote[] = [
    {
      id: 'n1',
      author: 'Raka',
      mood: 'Pulih · Fajar',
      message: 'Adegan mangkuk kosong di akhir bikin sesak tapi lega.',
      createdAt: 'Kemarin',
      hearts: 4,
    },
  ];
  const updated = addVisitorNote(
    initial,
    {
      author: 'Sinta',
      mood: 'Hangat · Kaldu Ayam',
      message: 'Lagu Let Down pas banget menggambarkan perasaan Ale.',
    },
    'Baru saja',
  );
  assert.equal(updated.length, 2);
  assert.equal(updated[0].author, 'Sinta');

  const liked = toggleNoteHeart(updated, 'n1', []);
  assert.equal(liked.notes[1].hearts, 5);
  assert.deepEqual(liked.likedIds, ['n1']);

  const unliked = toggleNoteHeart(liked.notes, 'n1', liked.likedIds);
  assert.equal(unliked.notes[1].hearts, 4);
  assert.deepEqual(unliked.likedIds, []);
});

test('calculatePollPercentages handles empty and non-empty vote totals', () => {
  const zeroResult = calculatePollPercentages([
    { id: '1', label: 'A', detail: 'd', votes: 0 },
    { id: '2', label: 'B', detail: 'd', votes: 0 },
  ]);
  assert.equal(zeroResult[0].percentage, 0);

  const result = calculatePollPercentages([
    { id: '1', label: 'A', detail: 'd', votes: 30 },
    { id: '2', label: 'B', detail: 'd', votes: 10 },
  ]);
  assert.equal(result[0].percentage, 75);
  assert.equal(result[1].percentage, 25);
});

test('formatAudioTime formats seconds cleanly into m:ss', () => {
  assert.equal(formatAudioTime(0), '0:00');
  assert.equal(formatAudioTime(65), '1:05');
  assert.equal(formatAudioTime(299), '4:59');
  assert.equal(formatAudioTime(-4), '0:00');
});

test('detectBlockedContent and filterCleanVisitorNotes block and remove 18+, racist, and SARA comments', () => {
  assert.equal(detectBlockedContent('Film ini sangat menyentuh hati.'), null);
  assert.equal(detectBlockedContent('Link b0k3p 18+ di sini'), '18+');
  assert.equal(detectBlockedContent('Dasar rasis dan menghina sara'), 'rasis-sara');
  assert.equal(detectBlockedContent('dasar bajingan'), 'kasar');

  const adultSubmit = validateVisitorNote({
    author: 'Anonim',
    mood: 'Sunyi · Gerimis',
    message: 'Ayo nonton film porno bareng malam ini',
  });
  assert.equal(adultSubmit.valid, false);
  assert.ok(adultSubmit.errors.message);

  const mixedNotes: VisitorNote[] = [
    {
      id: 'clean-1',
      author: 'Nadia',
      mood: 'Hangat · Kaldu Ayam',
      message: 'Pelukan ibu dan Ale bikin terharu.',
      createdAt: 'Baru saja',
      hearts: 3,
    },
    {
      id: 'bad-18',
      author: 'Spam',
      mood: 'Sunyi · Gerimis',
      message: 'Konten bokep gratis cek profil.',
      createdAt: 'Baru saja',
      hearts: 0,
    },
    {
      id: 'bad-sara',
      author: 'Troll',
      mood: 'Sunyi · Gerimis',
      message: 'Komentar rasis dan ujaran sara.',
      createdAt: 'Baru saja',
      hearts: 0,
    },
  ];

  const cleaned = filterCleanVisitorNotes(mixedNotes);
  assert.equal(cleaned.removedCount, 2);
  assert.equal(cleaned.cleanNotes.length, 1);
  assert.equal(cleaned.cleanNotes[0].id, 'clean-1');
});
