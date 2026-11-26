import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { FILM_PHOTOS } from '../data/filmContent';
import {
  filterPhotosByScene,
  type FilmPhoto,
  type PhotoCategory,
} from '../utils/blogLogic';

const CATEGORIES: PhotoCategory[] = [
  'Semua',
  'Sosok Ale',
  'Warung & Pertemuan',
  'Keluarga & Harapan',
];

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] =
    useState<PhotoCategory>('Semua');
  const [lightboxPhotoId, setLightboxPhotoId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const visiblePhotos = filterPhotosByScene(FILM_PHOTOS, selectedCategory);
  const activeIndex = visiblePhotos.findIndex(
    (item) => item.id === lightboxPhotoId,
  );
  const activePhoto: FilmPhoto | null =
    activeIndex >= 0 ? visiblePhotos[activeIndex] : null;

  useEffect(() => {
    if (!activePhoto) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxPhotoId(null);
      } else if (event.key === 'ArrowRight' && visiblePhotos.length > 1) {
        const nextIdx = (activeIndex + 1) % visiblePhotos.length;
        setLightboxPhotoId(visiblePhotos[nextIdx].id);
      } else if (event.key === 'ArrowLeft' && visiblePhotos.length > 1) {
        const prevIdx =
          (activeIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
        setLightboxPhotoId(visiblePhotos[prevIdx].id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, activePhoto, visiblePhotos]);

  return (
    <section
      id="galeri"
      className="border-b border-[#1E2B48] bg-[#070B14] py-12 sm:py-16 lg:py-22"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 border-b border-[#1E2B48] pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium text-[#7AB3FF]">
              Arsip Foto Resmi Film (2026)
            </p>
            <h2
              className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#EEF3FC] lg:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Bingkai Nyata Perjalanan Ale
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter foto adegan berdasarkan suasana"
            className="grid w-full grid-cols-2 gap-1.5 rounded-xl border border-[#1E2B48] bg-[#0D1526] p-1.5 sm:flex sm:w-auto sm:flex-wrap sm:rounded-lg sm:p-1"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative min-h-[38px] rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF] ${
                    active
                      ? 'text-[#EEF3FC]'
                      : 'text-[#94A3C8] hover:text-[#EEF3FC]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="gallery-category-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-md bg-[#1D2D4F]"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Gallery Grid */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
          {visiblePhotos.map((photo, idx) => {
            const isWide = photo.aspect === 'wide' && visiblePhotos.length > 2;
            const imgFailed = failedImages[photo.id];
            return (
              <motion.article
                layout
                key={photo.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.2) }}
                className={`group flex flex-col overflow-hidden rounded-2xl border border-[#1E2B48] bg-[#0D1526] transition-colors hover:border-[#7AB3FF]/45 ${
                  isWide ? 'md:col-span-2' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setLightboxPhotoId(photo.id)}
                  aria-label={`Buka foto adegan: ${photo.title}`}
                  className="relative h-[210px] w-full overflow-hidden text-left sm:h-[260px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                >
                  {!imgFailed ? (
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({
                          ...prev,
                          [photo.id]: true,
                        }))
                      }
                      className="h-full w-full object-cover object-[50%_22%] transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D1526] to-[#131E36] p-6 text-center">
                      <span className="font-editorial text-xl text-[#EEF3FC]">
                        {photo.title}
                      </span>
                    </div>
                  )}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B14]/80 via-transparent to-transparent"
                  />

                  <span className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#EEF3FC]/20 bg-[#070B14]/75 text-[#EEF3FC] opacity-90 transition-opacity group-hover:opacity-100">
                    <Expand className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3C8]">
                      <span>{photo.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {photo.frameCode}
                      </span>
                    </div>
                    <h3 className="font-editorial mt-2 text-2xl font-semibold text-[#EEF3FC]">
                      {photo.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#B6C4E0]">
                      {photo.caption}
                    </p>
                  </div>

                  <p className="mt-4 border-t border-[#1E2B48] pt-3 font-mono text-[11px] text-[#94A3C8]">
                    {photo.lensMeta}
                  </p>
                </div>
              </motion.article>
            );
          })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cinema Lightbox Modal */}
      <AnimatePresence>
      {activePhoto && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Detail foto ${activePhoto.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxPhotoId(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#04070E]/92 p-3 backdrop-blur-md sm:p-6 md:p-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24 }}
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#243456] bg-[#0D1526]"
          >
            <div className="flex items-center justify-between border-b border-[#1E2B48] px-5 py-3.5">
              <div className="flex items-center gap-2 text-xs text-[#94A3C8]">
                <span className="font-mono">{activePhoto.frameCode}</span>
                <span aria-hidden="true">·</span>
                <span>{activePhoto.lensMeta}</span>
              </div>

              <button
                type="button"
                onClick={() => setLightboxPhotoId(null)}
                aria-label="Tutup tampilan foto"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#243456] bg-[#131E36] text-[#EEF3FC] transition-colors hover:bg-[#1D2D4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
              <div className="relative flex items-center justify-center bg-[#070B14] lg:col-span-8">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[64vh] w-full object-contain"
                />
              </div>

              <div className="flex flex-col justify-between border-t border-[#1E2B48] p-6 lg:col-span-4 lg:border-t-0 lg:border-l">
                <div>
                  <p className="text-xs font-medium text-[#7AB3FF]">
                    {activePhoto.category}
                  </p>
                  <h3 className="font-editorial mt-2 text-3xl font-semibold text-[#EEF3FC]">
                    {activePhoto.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#C5D2EA]">
                    {activePhoto.caption}
                  </p>

                  <div className="mt-6 border-t border-[#1E2B48] pt-5">
                    <p className="text-xs font-medium text-[#94A3C8]">
                      Catatan Tata Cahaya &amp; Sutradara
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#94A3C8]">
                      {activePhoto.directorNote}
                    </p>
                  </div>
                </div>

                {visiblePhotos.length > 1 && (
                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#1E2B48] pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        const prevIdx =
                          (activeIndex - 1 + visiblePhotos.length) %
                          visiblePhotos.length;
                        setLightboxPhotoId(visiblePhotos[prevIdx].id);
                      }}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#243456] bg-[#131E36] px-3.5 py-2 text-xs font-medium text-[#EEF3FC] transition-colors hover:bg-[#1D2D4F]"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      <span>Sebelumnya</span>
                    </button>
                    <span className="font-mono text-xs text-[#94A3C8] tabular-nums">
                      {activeIndex + 1} / {visiblePhotos.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx =
                          (activeIndex + 1) % visiblePhotos.length;
                        setLightboxPhotoId(visiblePhotos[nextIdx].id);
                      }}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#243456] bg-[#131E36] px-3.5 py-2 text-xs font-medium text-[#EEF3FC] transition-colors hover:bg-[#1D2D4F]"
                    >
                      <span>Berikutnya</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
}
