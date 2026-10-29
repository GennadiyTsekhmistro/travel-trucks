"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type GalleryPhoto = {
  id: string;
  thumb: string;
  original: string;
};

type GallerySwiperProps = {
  photos: GalleryPhoto[];
  camperName: string;
};

export default function GallerySwiper({
  photos,
  camperName,
}: GallerySwiperProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="image-thumbnails">
      <Swiper
        className="details-main-swiper"
        modules={[A11y, Keyboard, Navigation, Thumbs]}
        navigation
        keyboard={{ enabled: true }}
        spaceBetween={16}
        slidesPerView={1}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={photo.id}>
            <Image
              className="details-main-image"
              src={photo.original}
              alt={`${camperName} — фото ${index + 1}`}
              width={638}
              height={505}
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 638px"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {photos.length > 1 && (
        <Swiper
          className="details-thumbnails"
          modules={[Thumbs, A11y]}
          onSwiper={setThumbsSwiper}
          watchSlidesProgress
          spaceBetween={16}
          slidesPerView={4}
          breakpoints={{
            0: { slidesPerView: 2 },
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
          }}
        >
          {photos.map((photo, index) => (
            <SwiperSlide key={photo.id}>
              <Image
                src={photo.thumb || photo.original}
                alt={`${camperName} — мініатюра ${index + 1}`}
                width={135}
                height={144}
                sizes="(max-width: 480px) 45vw, 135px"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
