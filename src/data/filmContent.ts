import type { FilmPhoto, PollOption, VisitorNote } from '../utils/blogLogic';

const BASE_URL =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  typeof import.meta.env.BASE_URL === 'string'
    ? import.meta.env.BASE_URL
    : './';

function assetUrl(relativePath: string): string {
  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  const cleanPath = relativePath.replace(/^\/+/, '');
  return `${cleanBase}${cleanPath}`;
}

export interface EssayChapter {
  id: string;
  index: string;
  title: string;
  timeStamp: string;
  quote: string;
  paragraphs: string[];
  marginNoteTitle: string;
  marginNoteBody: string;
}

export interface OfficialFilmVideo {
  id: string;
  code: string;
  title: string;
  channel: string;
  youtubeId: string;
  description: string;
}

export interface LivingSceneCaption {
  atSec: number;
  speaker: string;
  text: string;
}

export interface LivingScene {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  youtubeId: string;
  startSec: number;
  durationSec: number;
  rainLevel: number;
  steamLevel: number;
  moonGlow: number;
  captions: LivingSceneCaption[];
}

export interface TrackLyricLine {
  atSec: number;
  lyric: string;
  aleNote: string;
}

export interface PlaylistTrack {
  id: string;
  trackNumber: string;
  title: string;
  subtitle: string;
  artistLabel: string;
  durationSec: number;
  audioUrl: string;
  spotifyTrackId?: string;
  youtubeId: string;
  keyLabel: string;
  storyContext: string;
  lyrics: TrackLyricLine[];
}

export interface TeamMember {
  id: string;
  number: string;
  name: string;
  role: string;
  photoUrl: string;
  photoPosition: string;
  contribution: string;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  alt: string;
  objectPosition: string;
  tag: string;
  quote: string;
}

export const HERO_IMAGE_URL = assetUrl('film/ale_gerobak_biru.jpg');

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-gerobak',
    imageUrl: assetUrl('film/ale_gerobak_biru.jpg'),
    alt: 'Benidictus Siregar sebagai Ale berdiri di samping gerobak mie ayam biru dalam cuplikan film Seporsi Mie Ayam Sebelum Mati',
    objectPosition: 'object-[50%_28%]',
    tag: 'ADEGAN FILM · GEROBAK MIE AYAM BIRU',
    quote:
      '“Di hari ulang tahunku yang ke-37, aku hanya ingin makan seporsi mie ayam favoritku sebelum semuanya selesai.”',
  },
  {
    id: 'slide-ultah',
    imageUrl: assetUrl('film/ale_ulang_tahun.jpg'),
    alt: 'Ale merayakan ulang tahun ke-37 sendirian di kamar kos dengan topi pesta kertas',
    objectPosition: 'object-[50%_22%]',
    tag: 'TEASER RESMI · MALAM ULANG TAHUN KE-37',
    quote:
      '“Kadang semesta menunda kehancuran kita hanya dengan satu hal sepele: warung mie ayam langganan yang tutup.”',
  },
  {
    id: 'slide-murad',
    imageUrl: assetUrl('film/ale_dan_murad.jpg'),
    alt: 'Pertemuan Ale dan Murad di tengah perjalanan mencari warung mie ayam',
    objectPosition: 'object-[50%_24%]',
    tag: 'ADEGAN FILM · PERTEMUAN ALE & MURAD',
    quote:
      '“Untuk pertama kalinya malam itu, Ale merasa didengar tanpa sedikit pun dihakimi.”',
  },
  {
    id: 'slide-ibu',
    imageUrl: assetUrl('film/ale_dan_ibu.jpg'),
    alt: 'Pelukan erat Dewi Irawan sebagai Ibu kepada Ale dalam Official Trailer',
    objectPosition: 'object-[50%_20%]',
    tag: 'OFFICIAL TRAILER · PELUKAN SANG IBU',
    quote:
      '“Hidup tidak tiba-tiba menjadi mudah. Ia hanya terasa cukup layak untuk dicoba lagi esok pagi.”',
  },
];

export const OFFICIAL_FILM_VIDEOS: OfficialFilmVideo[] = [
  {
    id: 'yt-trailer',
    code: 'TRAILER RESMI',
    title: 'Seporsi Mie Ayam Sebelum Mati — Official Trailer',
    channel: 'CINEMA 21',
    youtubeId: 'yESY1GP1mfQ',
    description:
      'Cuplikan resmi film layar lebar arahan sutradara Kuntz Agus yang dibintangi Benidictus Siregar sebagai Ale, tayang di bioskop mulai 12 November 2026.',
  },
  {
    id: 'yt-teaser',
    code: 'TEASER RESMI',
    title: 'Seporsi Mie Ayam Sebelum Mati — Teaser Trailer',
    channel: 'CINEMA 21',
    youtubeId: '-g6LMepFDYI',
    description:
      'Teaser perdana yang memperlihatkan kamar kos Ale di hari ulang tahunnya dan tekad sederhana untuk menyantap seporsi mie ayam terakhir.',
  },
  {
    id: 'yt-murad',
    code: 'ADEGAN FILM',
    title: 'Momen Spesial Ale Bertemu dengan Murad',
    channel: 'CGV Kreasi',
    youtubeId: '94vNiwKMQKc',
    description:
      'Cuplikan pertemuan tak terduga antara Ale (Benidictus Siregar) dan Murad (Teuku Rifnu Wikana) dalam perjalanan mencari warung mie ayam.',
  },
  {
    id: 'yt-ost',
    code: 'OST RESMI',
    title: 'Coba Lagi (From "Seporsi Mie Ayam Sebelum Mati")',
    channel: 'Barsena Bestandhi',
    youtubeId: '1fFnif_v1Rk',
    description:
      'Lagu tema resmi film persembahan Barsena Bestandhi yang merangkum keberanian untuk mencoba satu hari lagi.',
  },
];

export const FILM_PHOTOS: FilmPhoto[] = [
  {
    id: 'photo-01',
    title: 'Wajah Ale — Official Trailer Still',
    category: 'Sosok Ale',
    imageUrl: assetUrl('film/official_trailer_ale.jpg'),
    frameCode: 'TRAILER RESMI · CINEMA 21',
    lensMeta: 'Benidictus Siregar sebagai Ale · Sutradara Kuntz Agus',
    aspect: 'wide',
    caption:
      'Benidictus Siregar memerankan Ale, pria 37 tahun yang menanggung kelelahan batin bertahun-tahun akibat perundungan dan kesepian.',
    directorNote:
      'Cuplikan resmi dari trailer Sinergi Pictures & Ben Film, menampilkan transformasi total Benidictus Siregar keluar dari peran komedi menuju drama yang getir dan jujur.',
  },
  {
    id: 'photo-02',
    title: 'Di Depan Gerobak Mie Ayam Biru',
    category: 'Warung & Pertemuan',
    imageUrl: assetUrl('film/ale_gerobak_biru.jpg'),
    frameCode: 'CLIPS · CGV KREASI',
    lensMeta: 'Lokasi Syuting Gerobak Mie Ayam · Jakarta',
    aspect: 'standard',
    caption:
      'Ale berdiri di samping gerobak kayu biru bertuliskan pesan pengingat bahwa hal-hal kecil pun layak dirayakan setelah melewati hari berat.',
    directorNote:
      'Warna biru pada gerobak menjadi jangkar visual yang menghubungkan kesunyian malam dengan secercah harapan baru.',
  },
  {
    id: 'photo-03',
    title: 'Pelukan Ibu & Air Mata',
    category: 'Keluarga & Harapan',
    imageUrl: assetUrl('film/ale_dan_ibu.jpg'),
    frameCode: 'TRAILER · 01:42',
    lensMeta: 'Benidictus Siregar & Dewi Irawan sebagai Ibu',
    aspect: 'standard',
    caption:
      'Dewi Irawan memeluk Ale erat dengan tangis yang tertahan—adegan paling menguras emosi dalam Official Trailer.',
    directorNote:
      'Kamera mengambil jarak dekat tanpa musik berlebihan, menekankan kehangatan keluarga yang sempat terasa jauh.',
  },
  {
    id: 'photo-04',
    title: 'Pertemuan Ale dan Murad',
    category: 'Warung & Pertemuan',
    imageUrl: assetUrl('film/ale_dan_murad.jpg'),
    frameCode: 'ADEGAN · CGV KREASI',
    lensMeta: 'Benidictus Siregar & Teuku Rifnu Wikana',
    aspect: 'standard',
    caption:
      'Ketika warung mie ayam langganan Ale tutup, pencariannya membawanya bertemu Murad (Teuku Rifnu Wikana) dan tokoh-tokoh asing yang mengubah pandangannya.',
    directorNote:
      'Pertemuan lintas latar belakang inilah yang menjadi jantung perjalanan Ale sebelum mengambil keputusan terbesarnya.',
  },
  {
    id: 'photo-05',
    title: 'Malam Ulang Tahun di Kamar Kos',
    category: 'Sosok Ale',
    imageUrl: assetUrl('film/ale_ulang_tahun.jpg'),
    frameCode: 'TEASER · 00:38',
    lensMeta: 'Benidictus Siregar · Teaser Resmi Cinema 21',
    aspect: 'standard',
    caption:
      'Dengan topi pesta kertas di kepala dan kamar yang remang, Ale merayakan ulang tahun ke-37 sendirian sebelum memutuskan keluar mencari seporsi mie ayam.',
    directorNote:
      'Kontras antara topi ulang tahun yang ceria dan pencahayaan gelap kamar merangkum kesepian Ale secara visual.',
  },
  {
    id: 'photo-06',
    title: 'Senyum Hangat Juleha',
    category: 'Keluarga & Harapan',
    imageUrl: assetUrl('film/juleha_tersenyum.jpg'),
    frameCode: 'TRAILER · 01:15',
    lensMeta: 'Zulfa Maharani sebagai Juleha',
    aspect: 'standard',
    caption:
      'Kehadiran Juleha (Zulfa Maharani) membawa kehangatan baru di tengah dunia Ale yang sebelumnya terasa dingin dan terasing.',
    directorNote:
      'Palet hangat pada adegan Juleha menandai pergeseran batin Ale dari putus asa menuju penerimaan.',
  },
  {
    id: 'photo-07',
    title: 'Tekanan di Ruang Kantor',
    category: 'Sosok Ale',
    imageUrl: assetUrl('film/ale_kantor.jpg'),
    frameCode: 'TEASER · 00:19',
    lensMeta: 'Benidictus Siregar · Sinergi Pictures',
    aspect: 'standard',
    caption:
      'Ale berdiri terdiam di tengah rekan-rekan kerja—potret nyata bagaimana perundungan dan tekanan sosial menumpuk perlahan.',
    directorNote:
      'Komposisi penuh orang di latar depan sengaja mempersempit ruang gerak Ale di tengah bingkai.',
  },
  {
    id: 'photo-08',
    title: 'Kamar Kos yang Penuh Kenangan — Teaser Key Art',
    category: 'Keluarga & Harapan',
    imageUrl: assetUrl('film/official_teaser_kamar.jpg'),
    frameCode: 'TEASER KEY ART · NOVEMBER 2026',
    lensMeta: 'Sinergi Pictures & Ben Film · Karya Kuntz Agus',
    aspect: 'standard',
    caption:
      'Duduk bersila di lantai kamar yang berantakan, Ale menimbang kembali hidupnya sebelum melangkah keluar mencari seporsi mie ayam.',
    directorNote:
      'Key art resmi Teaser Trailer yang menjadi ikonik sejak dirilis pada September 2026.',
  },
];

export const ESSAY_CHAPTERS: EssayChapter[] = [
  {
    id: 'chap-1',
    index: '01',
    title: 'Ulang Tahun ke-37 di Kamar yang Gelap',
    timeStamp: 'Babak Pembuka · Novel Brian Khrisna',
    quote:
      '“Di hari ulang tahunku yang ke-37, aku hanya ingin makan seporsi mie ayam favoritku sebelum semuanya benar-benar selesai.”',
    paragraphs: [
      'Diadaptasi dari novel laris karya Brian Khrisna dan disutradarai oleh Kuntz Agus, film Seporsi Mie Ayam Sebelum Mati memperkenalkan kita pada Ale (Benidictus Siregar)—seorang pria berusia 37 tahun yang tenggelam dalam depresi, perundungan di lingkungan kerja, serta luka keluarga yang tak pernah sembuh.',
      'Di malam ulang tahunnya yang sepi di bawah nuansa biru malam, Ale merasa tidak ada lagi alasan untuk melanjutkan hidup. Namun sebelum mengambil keputusan terakhirnya, ia menuliskan satu keinginan sederhana: menyantap seporsi mie ayam langganannya untuk yang terakhir kali.',
    ],
    marginNoteTitle: 'Produksi Resmi 2026',
    marginNoteBody:
      'Diproduksi oleh Sinergi Pictures & Ben Film bersama co-producer Nia Dinata, film ini tayang di jaringan bioskop Indonesia mulai 12 November 2026.',
  },
  {
    id: 'chap-2',
    index: '02',
    title: 'Gerobak yang Tutup & Pertemuan Tak Terduga',
    timeStamp: 'Titik Balik · Perjalanan Malam',
    quote:
      '“Kadang semesta menunda kehancuran kita hanya dengan satu hal sepele: warung mie ayam langganan yang ternyata tutup.”',
    paragraphs: [
      'Rencana sederhana Ale justru berantakan ketika gerobak mie ayam langganannya tutup. Penundaan kecil itu memaksanya menyusuri sudut-sudut kota yang tak pernah ia perhatikan, mempertemukannya dengan Murad (Teuku Rifnu Wikana), Juleha (Zulfa Maharani), Pram (Chicco Kurniawan), hingga Mami Louise (Tika Panggabean).',
      'Dari setiap percakapan singkat dengan orang-orang asing tersebut, Ale menyaksikan bahwa hampir semua orang memikul bebannya masing-masing. Kehadiran mereka tidak langsung menghapus depresi Ale, tetapi perlahan membuka celah kecil bagi empati untuk masuk.',
    ],
    marginNoteTitle: 'Jajaran Pemeran Film',
    marginNoteBody:
      'Dibintangi Benidictus Siregar, Chicco Kurniawan, Teuku Rifnu Wikana, Zulfa Maharani, Tika Panggabean, Dewi Irawan, Jourdy Pranata, dan Pangeran Lantang.',
  },
  {
    id: 'chap-3',
    index: '03',
    title: 'Gema Lagu “Let Down” dalam Kepala Ale',
    timeStamp: 'Resonansi Musik · Radiohead',
    quote:
      '“Let down and hanging around, crushed like a bug in the ground… one day I am gonna grow wings.”',
    paragraphs: [
      'Bagi pembaca novel dan penonton filmnya, lagu "Let Down" milik Radiohead sering disandingkan sebagai cermin paling jujur bagi perjalanan batin Ale. Lirik tentang rasa kecewa yang membeku, perasaan hancur seperti serangga kecil yang terinjak, hingga pengharapan lirih tentang menumbuhkan sayap terasa menyatu dengan langkah kaki Ale sepanjang malam.',
      'Di ruang dengar blog ini, kamu dapat memutar langsung lagu asli "Let Down" dari Radiohead secara penuh dari awal hingga akhir (4:59), bersama lagu-lagu penuh pengiring kisah Ale lainnya serta video OST resmi "Coba Lagi" di bagian Video.',
    ],
    marginNoteTitle: 'Putar Penuh 0:00 – Akhir',
    marginNoteBody:
      'Seluruh lagu di bagian Playlist dapat diputar langsung secara utuh dari detik pertama hingga lagu selesai tanpa terpotong cuplikan.',
  },
  {
    id: 'chap-4',
    index: '04',
    title: 'Bertahan Satu Hari Lagi untuk Dirayakan',
    timeStamp: 'Penutup · Pesan Harapan',
    quote:
      '“Hidup tidak tiba-tiba menjadi mudah. Ia hanya terasa cukup layak untuk dicoba lagi esok pagi.”',
    paragraphs: [
      'Pertemuan Ale dengan ibunya (Dewi Irawan) serta hangatnya seporsi mie ayam di ujung perjalanan menjadi pengingat bahwa kita tidak harus menanggung seluruh dunia sendirian. Adegan pelukan penuh air mata dalam trailer resmi menjadi simbol bahwa pulang masih selalu mungkin dilakukan.',
      'Seporsi Mie Ayam Sebelum Mati bukan sekadar cerita tentang makanan favorit; ia adalah surat cinta bagi siapa pun yang sedang lelah, agar berani menunda keputusan fatal dan memberi diri sendiri kesempatan untuk merayakan hal-hal kecil.',
    ],
    marginNoteTitle: 'Catatan Penonton',
    marginNoteBody:
      'Bagikan pesan hangatmu di Meja Catatan untuk Ale pada bagian Interaksi di bawah halaman ini.',
  },
];

export const LIVING_SCENES: LivingScene[] = [
  {
    id: 'scene-teaser',
    code: 'KLIP 01',
    title: 'Ulang Tahun ke-37 & Keinginan Terakhir Ale',
    subtitle: 'Suara pemeran asli Teaser Resmi · Benidictus Siregar sebagai Ale',
    imageUrl: assetUrl('film/ale_ulang_tahun.jpg'),
    youtubeId: '-g6LMepFDYI',
    startSec: 0,
    durationSec: 65,
    rainLevel: 0.72,
    steamLevel: 0.3,
    moonGlow: 0.9,
    captions: [
      {
        atSec: 0,
        speaker: 'Pembukaan Adegan · Kamar Ale',
        text: 'Suara bising kota dan keheningan kamar kos mengawali malam ulang tahun ke-37 Ale.',
      },
      {
        atSec: 12,
        speaker: 'Ale (Benidictus Siregar)',
        text: 'Tekanan di kantor dan tatapan dingin sekitar membuat Ale merasa dirinya tak berarti.',
      },
      {
        atSec: 28,
        speaker: 'Ale (Benidictus Siregar)',
        text: '“Aku tidak tahu alasan apa lagi untuk bangun besok pagi—tapi sebelum itu, aku ingin seporsi mie ayam.”',
      },
      {
        atSec: 46,
        speaker: 'Narasi Film · Seporsi Mie Ayam Sebelum Mati',
        text: 'Di balik topi pesta dan ruangan yang redup, satu mangkuk mie ayam menunda langkah terakhirnya.',
      },
    ],
  },
  {
    id: 'scene-murad',
    code: 'KLIP 02',
    title: 'Momen Spesial Ale Bertemu dengan Murad',
    subtitle:
      'Suara pemeran asli · Benidictus Siregar & Teuku Rifnu Wikana (CGV Kreasi)',
    imageUrl: assetUrl('film/ale_dan_murad.jpg'),
    youtubeId: '94vNiwKMQKc',
    startSec: 0,
    durationSec: 58,
    rainLevel: 0.4,
    steamLevel: 0.85,
    moonGlow: 0.75,
    captions: [
      {
        atSec: 0,
        speaker: 'Ale & Murad (Adegan Asli)',
        text: 'Pencarian mie ayam di pinggir jalan mempertemukan Ale dengan Murad secara tak terduga.',
      },
      {
        atSec: 16,
        speaker: 'Murad (Teuku Rifnu Wikana)',
        text: 'Percakapan lugas di tengah jalan membuka sisi lain kerasnya hidup orang-orang jalanan.',
      },
      {
        atSec: 34,
        speaker: 'Ale (Benidictus Siregar)',
        text: 'Untuk pertama kalinya malam itu, Ale merasa didengar tanpa dihakimi.',
      },
      {
        atSec: 46,
        speaker: 'Pertemuan Tak Terduga',
        text: 'Kadang pertolongan datang dari orang asing yang sama-sama sedang berjuang bertahan.',
      },
    ],
  },
  {
    id: 'scene-trailer',
    code: 'KLIP 03',
    title: 'Pelukan Ibu & Perjalanan Sepanjang Malam',
    subtitle:
      'Suara pemeran asli Official Trailer · Benidictus Siregar, Dewi Irawan & Zulfa Maharani',
    imageUrl: assetUrl('film/ale_dan_ibu.jpg'),
    youtubeId: 'yESY1GP1mfQ',
    startSec: 0,
    durationSec: 120,
    rainLevel: 0.25,
    steamLevel: 0.5,
    moonGlow: 0.8,
    captions: [
      {
        atSec: 0,
        speaker: 'Official Trailer · Sinergi Pictures',
        text: 'Ale menapaki hari ulang tahunnya dengan luka lama dan kelelahan batin yang menumpuk.',
      },
      {
        atSec: 25,
        speaker: 'Ale (Benidictus Siregar)',
        text: 'Ketika warung mie ayam favoritnya tutup, perjalanannya berubah menjadi pertemuan penuh makna.',
      },
      {
        atSec: 55,
        speaker: 'Juleha & Pram (Zulfa Maharani & Chicco Kurniawan)',
        text: 'Kehadiran tulus orang-orang di sekitarnya perlahan mencairkan dinginnya hati Ale.',
      },
      {
        atSec: 85,
        speaker: 'Ibu (Dewi Irawan) & Ale',
        text: 'Pelukan erat sang ibu dan air mata yang pecah menjadi titik pulang bagi Ale untuk bertahan hidup.',
      },
    ],
  },
];

export const PLAYLIST_TRACKS: PlaylistTrack[] = [
  {
    id: 'let-down',
    trackNumber: '01',
    title: 'Let Down — Radiohead',
    subtitle: 'Lagu Asli Penuh · Album OK Computer (1997) · Tema Batin Kisah Ale',
    artistLabel: 'Radiohead · 4:59',
    durationSec: 299,
    audioUrl:
      'https://archive.org/download/02-paranoid-android_202512/05%20Let%20Down.mp3',
    spotifyTrackId: '2fuYa3Lx06QQJAm0MjztKr',
    youtubeId: 'ZVgHPSyEIqk',
    keyLabel: 'Lagu Penuh · A Mayor',
    storyContext:
      'Diputar utuh dari awal hingga akhir (4:59): lirik tentang kehancuran sunyi hingga harapan lirih untuk menumbuhkan sayap menjadi cermin perjalanan Ale.',
    lyrics: [
      {
        atSec: 0,
        lyric: 'Transport, motorways and tramlines, starting and then stopping...',
        aleNote:
          'Arpeggio pembuka — rutinitas kota yang menjepit batin Ale setiap hari.',
      },
      {
        atSec: 58,
        lyric: 'Don’t get sentimental, it always ends up drivel.',
        aleNote:
          'Ale memendam perasaan sendirian di tengah rekan kerja dan kota yang bising.',
      },
      {
        atSec: 94,
        lyric: 'One day, I am gonna grow wings — a chemical reaction.',
        aleNote:
          'Harapan rapuh yang tersisa saat ia menuliskan satu keinginan sebelum pergi.',
      },
      {
        atSec: 162,
        lyric: 'Floor collapsing, floating, bouncing back and one day...',
        aleNote:
          'Pertemuan tak terduga dengan Murad dan Juleha perlahan menahan jatuhnya Ale.',
      },
      {
        atSec: 215,
        lyric: 'You know, you know where you are with... floor collapsing.',
        aleNote:
          'Klimaks vokal berlapis — saat pelukan sang ibu luruh bersama air mata.',
      },
      {
        atSec: 262,
        lyric: 'One day, I am gonna grow wings...',
        aleNote:
          'Penutup tenang: Ale memilih bertahan untuk mencoba satu hari lagi.',
      },
    ],
  },
  {
    id: 'no-surprises',
    trackNumber: '02',
    title: 'No Surprises — Radiohead',
    subtitle:
      'Lagu Asli Penuh · Kelelahan menghadapi rutinitas & tekanan hidup',
    artistLabel: 'Radiohead · 3:49',
    durationSec: 229,
    audioUrl:
      'https://archive.org/download/02-paranoid-android_202512/10%20No%20Surprises.mp3',
    spotifyTrackId: '10nyNJ6zNy2YVYLrcwLccB',
    youtubeId: 'u5CVsCnxyXg',
    keyLabel: 'Lagu Penuh · F Mayor',
    storyContext:
      'Diputar penuh dari awal hingga akhir (3:49) dengan denting glockenspiel lembut yang menggambarkan rasa lelah Ale terhadap tekanan hidup.',
    lyrics: [
      {
        atSec: 0,
        lyric:
          'A heart that’s full up like a landfill, a job that slowly kills you...',
        aleNote:
          'Potret jujur kelelahan Ale di meja kantor sebelum ulang tahun ke-37.',
      },
      {
        atSec: 72,
        lyric: 'No alarms and no surprises, silent, silent...',
        aleNote:
          'Kerinduan sederhana untuk sekadar merasa damai tanpa tekanan.',
      },
      {
        atSec: 148,
        lyric: 'Such a pretty house and such a pretty garden...',
        aleNote:
          'Kilas balik tentang rumah dan kehangatan yang sempat hilang.',
      },
      {
        atSec: 196,
        lyric: 'Get me out of here...',
        aleNote:
          'Akhir lagu yang sunyi — titik balik menuju jalan keluar yang baru.',
      },
    ],
  },
  {
    id: 'exit-music',
    trackNumber: '03',
    title: 'Exit Music (For a Film) — Radiohead',
    subtitle: 'Lagu Asli Penuh · Katarsis sunyi menjelang fajar',
    artistLabel: 'Radiohead · 4:25',
    durationSec: 265,
    audioUrl:
      'https://archive.org/download/02-paranoid-android_202512/04%20Exit%20Music%20(for%20a%20Film).mp3',
    spotifyTrackId: '0z1o5L7HJx562xZSATcIpY',
    youtubeId: 'Bf01riuiJWA',
    keyLabel: 'Lagu Penuh · B Minor',
    storyContext:
      'Dinamika utuh dari petikan gitar akustik hingga ledakan melodi (4:25), merefleksikan badai emosi Ale sebelum fajar menyingsing.',
    lyrics: [
      {
        atSec: 0,
        lyric: 'Wake from your sleep, the drying of your tears...',
        aleNote:
          'Pembuka lirih di tengah kamar gelap sebelum keputusan terakhir.',
      },
      {
        atSec: 88,
        lyric: 'Today we escape, we escape...',
        aleNote: 'Ketegangan batin saat malam terasa tak berujung.',
      },
      {
        atSec: 170,
        lyric:
          'And you can laugh a spineless laugh, we hope your rules and wisdom choke you...',
        aleNote:
          'Puncak emosi — pelepasan seluruh luka perundungan yang ditahan bertahun-tahun.',
      },
      {
        atSec: 224,
        lyric: 'Now we are one in everlasting peace...',
        aleNote:
          'Mereda perlahan saat fajar datang dan Ale memilih tetap hidup.',
      },
    ],
  },
  {
    id: 'ada-titik-di-ujung-doa',
    trackNumber: '04',
    title: 'Ada Titik-Titik di Ujung Doa — Sal Priadi',
    subtitle:
      'Lagu Asli Penuh · Doa malam, memaafkan luka & pelukan keluarga Ale',
    artistLabel: 'Sal Priadi · 5:06',
    durationSec: 306,
    audioUrl:
      'https://archive.org/download/ada-titik-titik-di-ujung-doa-sal-priadi-lirik-lagu_202602/Ada%20titik-titik%20di%20ujung%20doa%20-%20Sal%20Priadi%20Lirik%20Lagu.mp3',
    spotifyTrackId: '1E7zLPDdqo0OvzVmGj5aoV',
    youtubeId: '63H7pcUUm6s',
    keyLabel: 'Lagu Penuh · Sal Priadi',
    storyContext:
      'Tentang merakit kembali hati yang hancur berkeping-keping, memaafkan masa lalu, dan menyelipkan nama orang tersayang di ujung doa malam—gema perjalanan pulang Ale kepada ibunya.',
    lyrics: [
      {
        atSec: 0,
        lyric:
          'Ada titik-titik di ujung doa, doa keselamatan penutup malam yang harus diisi nama...',
        aleNote:
          'Di malam ulang tahun ke-37 yang sunyi, Ale teringat nama-nama yang masih diam-diam ia jaga dalam doa.',
      },
      {
        atSec: 88,
        lyric:
          'Kucoba memaafkanmu selalu, kalau di situ ada salahku, maafkanku juga...',
        aleNote:
          'Luka lama keluarga perlahan melunak—kesediaan memaafkan yang membuka jalan bagi Ale untuk pulang.',
      },
      {
        atSec: 175,
        lyric:
          'Ingat hatiku dihancurkan jadi berkeping-keping, kali ini aku coba merakitnya lagi...',
        aleNote:
          'Sebagaimana hati yang direkatkan ulang meski tak lagi sempurna, Ale belajar menerima dirinya yang lelah.',
      },
      {
        atSec: 252,
        lyric: 'Terselipkah aku di sana, di doa-doamu juga...',
        aleNote:
          'Pelukan hangat sang ibu di pengujung malam—jawaban atas doa sunyi yang membuat Ale memilih terus hidup.',
      },
    ],
  },
];

export const INITIAL_VISITOR_NOTES: VisitorNote[] = [
  {
    id: 'seed-1',
    author: 'Nadia Kirana',
    mood: 'Hangat · Kaldu Ayam',
    message:
      'Akting Benidictus Siregar sebagai Ale benar-benar menusuk hati. Buat siapa pun yang malam ini merasa sendirian, tolong makan sesuatu yang hangat dulu ya.',
    createdAt: '2 jam lalu',
    hearts: 24,
  },
  {
    id: 'seed-2',
    author: 'Bagas Prakoso',
    mood: 'Sunyi · Gerimis',
    message:
      'Putar lagu Let Down sambil lihat adegan Ale pakai topi ulang tahun sendirian... rasanya relate sekali dengan orang-orang yang memendam luka diam-diam.',
    createdAt: '5 jam lalu',
    hearts: 18,
  },
  {
    id: 'seed-3',
    author: 'Tari Wulandari',
    mood: 'Pulih · Fajar',
    message:
      'Adegan Ale memeluk ibunya (Dewi Irawan) di trailer bikin aku langsung menelpon rumah. Film Indonesia yang sangat penting untuk kesehatan mental.',
    createdAt: 'Kemarin',
    hearts: 31,
  },
];

export const INITIAL_SCENE_POLL: PollOption[] = [
  {
    id: 'poll-scene-1',
    label: 'Adegan Pelukan Ale & Ibu (Dewi Irawan)',
    detail: 'Momen paling menguras air mata di Official Trailer.',
    votes: 68,
  },
  {
    id: 'poll-scene-2',
    label: 'Ale Merayakan Ulang Tahun ke-37 Sendirian',
    detail: 'Duduk di kamar gelap dengan topi pesta kertas.',
    votes: 52,
  },
  {
    id: 'poll-scene-3',
    label: 'Ale di Depan Gerobak Mie Ayam Biru',
    detail: 'Saat rencananya tertunda karena warung langganan tutup.',
    votes: 59,
  },
  {
    id: 'poll-scene-4',
    label: 'Pertemuan Ale & Murad (Teuku Rifnu Wikana)',
    detail: 'Perjumpaan tak terduga yang mengubah sudut pandang Ale.',
    votes: 41,
  },
];

export const INITIAL_COMFORT_POLL: PollOption[] = [
  {
    id: 'comfort-1',
    label: 'Seporsi Mie Ayam Favorit di Pinggir Jalan',
    detail: 'Alasan sederhana untuk menunda rasa putus asa.',
    votes: 86,
  },
  {
    id: 'comfort-2',
    label: 'Mendengarkan Radiohead — Let Down sampai Selesai',
    detail: 'Membiarkan musik menjadi teman saat tak bisa bercerita.',
    votes: 63,
  },
  {
    id: 'comfort-3',
    label: 'Menghubungi Ibu atau Orang Terdekat',
    detail: 'Mengizinkan diri sendiri untuk dipeluk dan didengar.',
    votes: 54,
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    number: '01',
    name: 'Razka',
    role: 'Ketua & Arsitektur Web',
    photoUrl: assetUrl('assets/aistudio/r_e3df0cc7.jpeg'),
    photoPosition: 'object-[64%_42%]',
    contribution:
      'Merancang struktur halaman blog Blue Moon dan mengoordinasikan penyusunan konten kisah Ale dari awal hingga akhir.',
  },
  {
    id: 'member-2',
    number: '02',
    name: 'Faqih',
    role: 'Kurator Foto & Video Film',
    photoUrl: assetUrl('assets/aistudio/f_2f407d32.jpeg'),
    photoPosition: 'object-[50%_28%]',
    contribution:
      'Mengumpulkan dan menyeleksi 8 foto adegan serta 4 cuplikan video resmi film Seporsi Mie Ayam Sebelum Mati.',
  },
  {
    id: 'member-3',
    number: '03',
    name: 'Nouval',
    role: 'Kanvas Hidup & Subtitle',
    photoUrl: assetUrl('assets/aistudio/n_cef28ff8.jpeg'),
    photoPosition: 'object-[50%_30%]',
    contribution:
      'Membangun fitur Kanvas Hidup Blue Moon dengan efek hujan malam, uap kuah, dan sinkronisasi suara pemeran asli.',
  },
  {
    id: 'member-4',
    number: '04',
    name: 'Shakila',
    role: 'Penulis Esai Kisah Ale',
    photoUrl: assetUrl('assets/aistudio/s_9852389a.jpeg'),
    photoPosition: 'object-[32%_22%]',
    contribution:
      'Menulis empat babak esai film mengenai ulang tahun ke-37 Ale, pertemuan di warung mie ayam, hingga pelukan sang ibu.',
  },
  {
    id: 'member-5',
    number: '05',
    name: 'Daniel',
    role: 'Pengolah Audio & Playlist',
    photoUrl: assetUrl('assets/aistudio/d_898cb0f8.jpeg'),
    photoPosition: 'object-[50%_22%]',
    contribution:
      'Menyusun pemutar musik penuh untuk Let Down, No Surprises, Exit Music, dan Ada Titik-Titik di Ujung Doa beserta liriknya.',
  },
  {
    id: 'member-6',
    number: '06',
    name: 'Nashira',
    role: 'Desainer Visual Blue Moon',
    photoUrl: assetUrl('assets/aistudio/fira_2aba8820.jpeg'),
    photoPosition: 'object-[68%_56%]',
    contribution:
      'Meracik palet biru malam, tata tipografi editorial, dan nuansa melankolis hangat di seluruh bagian situs.',
  },
  {
    id: 'member-7',
    number: '07',
    name: 'Qintara',
    role: 'Ruang Interaksi Pengunjung',
    photoUrl: assetUrl('assets/aistudio/q_6b9b29d5.jpeg'),
    photoPosition: 'object-[50%_30%]',
    contribution:
      'Membangun Meja Catatan untuk Ale serta jajak pendapat interaktif agar pengunjung bisa berbagi refleksi.',
  },
];
