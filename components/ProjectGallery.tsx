"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

export default function ProjectGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${title} screenshots`}
        className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden bg-panel"
      >
        <Image
          src={images[0]}
          alt={`${title} screenshot`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            <Images className="size-3.5" aria-hidden />
            {images.length} shots
          </span>
        )}
      </button>

      {open && (
        <Lightbox title={title} images={images} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function Lightbox({
  title,
  images,
  onClose,
}: {
  title: string;
  images: string[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex w-full max-w-6xl items-center justify-between text-sm text-white/80">
        <span className="font-medium">{title}</span>
        <span>
          {index + 1} / {images.length}
        </span>
      </div>

      <div
        className="relative h-[70vh] w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`${title} screenshot ${index + 1} of ${images.length}`}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      {images.length > 1 && (
        <div
          className="flex items-center gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={prev}
            aria-label="Previous screenshot"
            className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next screenshot"
            className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25"
      >
        <X className="size-5" />
      </button>
    </div>,
    document.body,
  );
}
