'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
  // Logo overlay — selalu tampil (before & after scroll), center-top
  logo?: { src: string; alt: string; width?: number; height?: number };
  brandName?: string;
  // Overlay after-scroll — menempel kotak video (CTA center, pilar bottom).
  // Node React dari caller (page.tsx), hanya tampil saat showContent.
  ctaNode?: ReactNode;
  pillarsNode?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
  logo,
  brandName,
  ctaNode,
  pillarsNode,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Refs untuk nilai mutable — handler event membaca/menulis via ref sehingga
  // listener cukup terdaftar SEKALI (re-register tiap state change + gap
  // remove/add listener saat scroll cepat adalah sumber glitch/flicker).
  const progressRef = useRef<number>(0);
  const expandedRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number>(0);
  // rAF throttle — maksimal 1 update state per frame (anti-flicker).
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
    progressRef.current = 0;
    expandedRef.current = false;
  }, [mediaType]);

  // Terapkan progress yang sudah di-clamp — via rAF agar hanya 1 update
  // render per frame, dan skip bila nilainya identik (tidak ada re-render
  // redundan di ujung animasi = tanpa flicker after-scroll).
  const applyProgress = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), 1);
    progressRef.current = clamped;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setScrollProgress((prev) => (prev === clamped ? prev : clamped));

      if (clamped >= 1) {
        if (!expandedRef.current) {
          expandedRef.current = true;
          setMediaFullyExpanded(true);
          setShowContent(true);
        }
      } else if (clamped < 0.75) {
        setShowContent(false);
      }
    });
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (expandedRef.current && e.deltaY < 0 && window.scrollY <= 5) {
        expandedRef.current = false;
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!expandedRef.current) {
        e.preventDefault();
        applyProgress(progressRef.current + e.deltaY * 0.0025);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartYRef.current) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;

      if (expandedRef.current && deltaY < -20 && window.scrollY <= 5) {
        expandedRef.current = false;
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!expandedRef.current) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.02 : 0.012;
        applyProgress(progressRef.current + deltaY * scrollFactor);
      }

      touchStartYRef.current = touchY;
    };

    const handleTouchEnd = (): void => {
      touchStartYRef.current = 0;
    };

    const handleScroll = (): void => {
      // Hapus scroll lock — biarkan halaman lanjut natural setelah expand
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
    // Listener terdaftar SEKALI — nilai mutable diakses via ref, bukan closure state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  // Tinggi media dinamis berbasis viewport (bukan px statis) — start 50dvh,
  // expand ke 95dvh. Jurang atas-bawah otomatis proporsional di semua device
  // (padding dinamis); maxHeight calc(100dvh - 5vw) tetap kompatibel sebagai clamp.
  const mediaHeightDvh = 50 + scrollProgress * 45;
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='overflow-x-hidden'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt='Background'
              width={1920}
              height={1080}
              className='w-screen h-screen'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority
            />
            <div className='absolute inset-0 bg-black/10' />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
              <div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeightDvh}dvh`,
                  maxWidth: '95vw',
                  maxHeight: 'calc(100dvh - 5vw)',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                  willChange: 'width, height',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') || mediaSrc.includes('youtu.be') ? (
                    <div className='relative w-full h-full pointer-events-none overflow-hidden rounded-2xl bg-black'>
                      {posterSrc && (
                        <Image
                          src={posterSrc}
                          alt=""
                          fill
                          className="object-cover -z-10"
                        />
                      )}
                      {(() => {
                        let videoId = ''
                        if (mediaSrc.includes('youtu.be/')) {
                          videoId = mediaSrc.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || ''
                        } else if (mediaSrc.includes('watch?v=')) {
                          videoId = mediaSrc.split('watch?v=')[1]?.split('&')[0] || ''
                        } else if (mediaSrc.includes('embed/')) {
                          videoId = mediaSrc.split('embed/')[1]?.split('?')[0]?.split('&')[0] || ''
                        }
                        const embedUrl = videoId
                          ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1&playlist=${videoId}`
                          : mediaSrc

                        return (
                          <iframe
                            width='100%'
                            height='100%'
                            src={embedUrl}
                            className='w-full h-full rounded-2xl scale-125'
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                            allowFullScreen
                          />
                        )
                      })()}
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/20 rounded-2xl'
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 0.3 - scrollProgress * 0.2 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none overflow-hidden rounded-2xl'>
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload='metadata'
                        className='w-full h-full object-cover rounded-2xl'
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/20 rounded-2xl'
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 0.3 - scrollProgress * 0.2 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      width={1280}
                      height={720}
                      className='w-full h-full object-cover rounded-xl'
                    />

                    <motion.div
                      className='absolute inset-0 bg-black/50 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className='flex flex-col items-center text-center relative z-10 mt-4 transition-none'>
                  {date && (
                    <p
                      className='text-2xl text-blue-200'
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className='text-blue-200 font-medium text-center'
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>

                {/* === OVERLAY AFTER SCROLL — menempel kotak video ===
                    Logo TOP, CTA CENTER, 4 pilar BOTTOM.
                    Hidden before scroll (video masih kecil) — fade in via showContent. */}
                {(logo || brandName) && (
                  <motion.div
                    className='absolute z-20 top-[clamp(1rem,5vh,3rem)] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    {logo && (
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width || 148}
                        height={logo.height || 66}
                        className='h-14 md:h-16 w-auto object-contain'
                        priority
                      />
                    )}
                    {brandName && (
                      <div className='text-white font-bold text-lg md:text-xl text-center leading-tight'>
                        {brandName}
                      </div>
                    )}
                  </motion.div>
                )}

                {ctaNode && (
                  <motion.div
                    className='absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center pointer-events-auto'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    {ctaNode}
                  </motion.div>
                )}

                {pillarsNode && (
                  <motion.div
                    className='absolute z-20 bottom-[clamp(1rem,4vh,2.5rem)] left-1/2 -translate-x-1/2 w-[min(90%,600px)] grid grid-cols-2 gap-[clamp(0.5rem,2vh,1.5rem)] pointer-events-auto'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    {pillarsNode}
                  </motion.div>
                )}
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className='text-4xl md:text-5xl lg:text-6xl font-bold text-blue-200 transition-none'
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-200 transition-none'
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>

              {/* Children (CTA) — tepat di bawah judul, masih dalam viewport hero */}
              {children && (
                <motion.div
                  className='relative z-10 flex justify-center mt-6 transition-none'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showContent ? 1 : 0 }}
                  transition={{ duration: 0.7 }}
                >
                  {children}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
