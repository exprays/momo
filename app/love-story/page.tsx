/* eslint-disable react-hooks/purity */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SplitText from "@/components/interface/split-text";
import BlurText from "@/components/interface/blur-text";
import CurvedLoop from "@/components/interface/curved-text";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LoveStory() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const memoryCardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const mailWrapRef = useRef<HTMLDivElement>(null);
  const mailCoverRef = useRef<HTMLDivElement>(null);
  const mailPaperRef = useRef<HTMLDivElement>(null);
  const mailTlRef = useRef<gsap.core.Timeline | null>(null);
  const mailOpenRef = useRef(false);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  type Track = { id: string; title: string; src: string };
  const tracks: Track[] = [
    { id: "dekh-lena", title: "Dekh Lena", src: "/audio/dekhlena.mp3" },
    { id: "hoor", title: "Hoor", src: "/audio/hoor.mp3" },
    { id: "pyar-ho", title: "Pyar Ho", src: "/audio/pyarho.mp3" },
  ];

  const stopTrack = (updateState: boolean = true) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {}
    }
    if (updateState) setPlayingId(null);
  };

  const playTrack = async (track: Track) => {
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.preload = "auto";
    audio.loop = false;
    audio.muted = false;

    const shouldSwap = !audio.src || !audio.src.endsWith(track.src);
    const isSame = playingId === track.id && !shouldSwap;

    if (isSame && !audio.paused) {
      stopTrack();
      return;
    }

    // Stop any current track first (prevents overlap)
    stopTrack(false);

    if (shouldSwap) audio.src = track.src;

    try {
      await audio.play();
      setPlayingId(track.id);
    } catch {
      setPlayingId(null);
    }
  };

  useEffect(() => {
    let mailCtx: gsap.Context | undefined;

    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    const onEnded = () => setPlayingId(null);
    audio.addEventListener("ended", onEnded);

    // Parallax effect for hero section
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 200,
        opacity: 0.3,
      });
    }

    // Floating heart animation
    if (heartRef.current) {
      gsap.to(heartRef.current, {
        scrollTrigger: {
          trigger: heartRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        scale: 1.5,
        rotation: 360,
      });
    }

    // Reveal memory cards on scroll
    memoryCardRefs.current.forEach((card) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Mail open/close timeline
    if (mailWrapRef.current && mailCoverRef.current && mailPaperRef.current) {
      mailCtx = gsap.context(() => {
        gsap.set(mailWrapRef.current!, {
          perspective: 1000,
        });

        gsap.set(mailCoverRef.current!, {
          transformOrigin: "50% 90%",
          transformStyle: "preserve-3d",
        });

        gsap.set(mailPaperRef.current!, {
          opacity: 0,
          y: 12,
          scale: 0.98,
        });

        mailTlRef.current = gsap
          .timeline({ paused: true, defaults: { ease: "power3.out" } })
          // cover fades + flips back slightly
          .to(mailCoverRef.current!, {
            duration: 0.55,
            opacity: 0.18,
            y: 6,
            rotationX: 62,
            rotationZ: -0.8,
            scale: 0.985,
          })
          // paper reveals over the cover (without leaving the envelope bounds)
          .to(
            mailPaperRef.current!,
            {
              duration: 0.65,
              opacity: 1,
              y: 0,
              scale: 1,
            },
            0.05
          )
          // slight settle
          .to(
            mailPaperRef.current!,
            { duration: 0.45, scale: 1, ease: "power2.out" },
            ">-0.25"
          );
      }, mailWrapRef);
    }

    return () => {
      // Clean up ScrollTriggers we created
      ScrollTrigger.getAll().forEach((st) => st.kill());

      audio.removeEventListener("ended", onEnded);

      // Revert GSAP context for mail timeline
      mailCtx?.revert();
      mailTlRef.current = null;
      mailOpenRef.current = false;

      // Stop any audio on unmount
      stopTrack(false);
    };
  }, []);

  const toggleMail = () => {
    const tl = mailTlRef.current;
    if (!tl) return;
    mailOpenRef.current = !mailOpenRef.current;
    if (mailOpenRef.current) tl.play();
    else tl.reverse();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-red-50">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated Background Hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-200 opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 40 + 20}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            >
              ♥
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center px-4">
          <SplitText
            text="Once Upon a Time"
            tag="h1"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-red-600 bg-clip-text text-transparent mb-4 sm:mb-6 md:mb-8"
            splitType="chars"
            from={{ opacity: 0, y: 100, rotateX: -90 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
            duration={1.5}
            delay={100}
          />

          <BlurText
            text="Jaruri tho nahin na? ki jo na mile usey chod hee diya jaaye ..."
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-rose-700 max-w-3xl mx-auto px-2"
            animateBy="words"
            delay={100}
          />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-rose-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-rose-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Chapter 1: The Meeting */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4 relative">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-12 sm:mb-16 md:mb-20">
            <SplitText
              text="Chapter I"
              tag="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-rose-600 mb-6 sm:mb-8 md:mb-10 text-center"
              splitType="chars"
              from={{ opacity: 0, scale: 0, rotation: -180 }}
              to={{ opacity: 1, scale: 1, rotation: 0 }}
            />
            <SplitText
              text="The First Glance"
              tag="h3"
              className="text-2xl sm:text-3xl md:text-4xl text-rose-500 text-center italic"
              splitType="words"
            />
          </div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
            <BlurText
              text="2 September 2023 - I never believed in 'love at first sight' until I saw you.... woh ek khamosh sa andaaz, ek woh khayal, sab kuch yaad he mujhe... still I knew we will not meet again! Bas ek hi baar... uske baad bas mere akele mein baith kara muskurana!!!"
              className="text-center"
              animateBy="words"
              delay={50}
            />
          </div>

          {/* Decorative heart */}
          <div
            ref={heartRef}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-center my-8 sm:my-12 md:my-16 text-pink-300"
          >
            ♥
          </div>
        </div>
      </section>

      {/* Chapter 2: The Journey */}
      <section className="min-h-screen flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-transparent via-pink-100 to-transparent">
        <div className="w-full mb-8 sm:mb-12 md:mb-16">
          <CurvedLoop
            marqueeText="Love grows deeper with every moment ✦ Love grows deeper with every moment ✦ "
            speed={2}
            direction="right"
            curveAmount={200}
            className="text-rose-300/60"
          />
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-12 sm:mb-16 md:mb-20">
            <SplitText
              text="Chapter II"
              tag="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-rose-600 mb-6 sm:mb-8 md:mb-10 text-center"
              splitType="chars"
            />
            <SplitText
              text="The void"
              tag="h3"
              className="text-2xl sm:text-3xl md:text-4xl text-rose-500 text-center italic"
              splitType="words"
            />
          </div>

          <div className="space-y-4 sm:space-y-5 md:space-y-6 text-center">
            <BlurText
              text="We always end up loving those hard who we are not meant to be with - of course!! ek hi baar toh dekha tha, bhul bi toh sakta thaa!! Par kuch batana chahta thaa...mai tumhe thoda aur pyar karna chahtha thaa...tumse tumhe mangna chahta thaa...I felt like I am waiting for something that is never going to come... phir bhi mai tumse milna chahta thaa...bas ek baar aur milna chahta thaa..."
              className="text-base sm:text-lg text-gray-700"
              animateBy="words"
              delay={80}
            />
          </div>
        </div>
      </section>

      {/* Chapter 3: Forever */}
      <section className="min-h-screen flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-12 sm:mb-16 md:mb-20">
            <SplitText
              text="Chapter III"
              tag="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-rose-600 mb-6 sm:mb-8 md:mb-10 text-center"
              splitType="chars"
            />
            <SplitText
              text="Beyond..."
              tag="h3"
              className="text-2xl sm:text-3xl md:text-4xl text-rose-500 text-center italic"
              splitType="words"
            />
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-12 text-center">
            <BlurText
              text="Par kahan se laun itna sabar ki tu baat kare aur mujhe fark bhi na pade..."
              className="text-lg sm:text-xl md:text-2xl text-gray-700"
              animateBy="words"
              delay={100}
            />

            <BlurText
              text="Barasti baarish, Samandar ki lehre, yeh thandi thandi hawayein, thode kuch ache shayari aur un sab shayariyon ka pehla lafz, sab kuch jaise tere ho chuke the!! And I decided to text you on random! Mo main Id ru :)"
              className="text-lg sm:text-xl md:text-2xl text-gray-700"
              animateBy="words"
              delay={100}
            />

            <div className="py-6 sm:py-8 md:py-12">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-pink-400 animate-pulse-slow">
                ♥
              </div>
            </div>

            <BlurText
              text="And so they promised to write their story together, one beautiful day at a time"
              className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-pink-600 via-rose-500 to-red-600 bg-clip-text text-transparent"
              animateBy="words"
              delay={100}
            />
          </div>
        </div>

        <div className="w-full mt-12 sm:mt-16 md:mt-20">
          <CurvedLoop
            marqueeText="Forever and always ♥ Forever and always ♥ "
            speed={1.5}
            direction="left"
            curveAmount={300}
            className="text-rose-400/60"
          />
        </div>
      </section>

      {/* Memories (cards) */}
      <section className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-2xl mx-auto w-full">
          <div className="mb-12 sm:mb-16 md:mb-20">
            <SplitText
              text="Memories"
              tag="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-600 mb-4 sm:mb-6 text-center"
              splitType="chars"
            />
            <SplitText
              text="Little moments, held forever"
              tag="h3"
              className="text-xl sm:text-2xl md:text-3xl text-rose-500 text-center italic"
              splitType="words"
            />
          </div>

          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
            {[
              {
                src: "/memories-01.svg",
                caption: "The first laugh that felt like home",
              },
              {
                src: "/memories-02.svg",
                caption: "A sunset shared, no words needed",
              },
              {
                src: "/memories-03.svg",
                caption: "Rainy streets, warm hands",
              },
              {
                src: "/memories-04.svg",
                caption: "A promise whispered, kept daily",
              },
            ].map((m, idx) => (
              <div
                key={m.src}
                ref={(el) => {
                  memoryCardRefs.current[idx] = el;
                }}
                className="opacity-0"
              >
                <div className="overflow-hidden rounded-2xl bg-white/70 border border-black/[.08]">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={m.src}
                      alt={m.caption}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>

                  <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <BlurText
                      text={m.caption}
                      className="text-base sm:text-lg text-gray-700 text-center"
                      animateBy="words"
                      delay={60}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mixtapes (cassettes) */}
      <section className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-2xl mx-auto w-full">
          <div className="mb-10 sm:mb-14 md:mb-16">
            <SplitText
              text="Mixtapes"
              tag="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-600 mb-4 sm:mb-6 text-center"
              splitType="chars"
            />
            <BlurText
              text="Tap a cassette to play. Tap again to stop."
              className="text-base sm:text-lg md:text-xl text-rose-600 text-center"
              animateBy="words"
              delay={60}
            />
          </div>

          <div className="flex flex-col gap-6 sm:gap-8">
            {tracks.map((track) => {
              const isPlaying = playingId === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    if (isPlaying) stopTrack();
                    else void playTrack(track);
                  }}
                  aria-pressed={isPlaying}
                  className="text-left"
                >
                  <div className="rounded-2xl bg-white/70 border border-black/[.08] px-5 py-5 sm:px-6 sm:py-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg sm:text-xl font-semibold text-rose-700">
                          {track.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isPlaying ? "Playing…" : "Click to play"}
                        </div>
                      </div>

                      <div
                        className={
                          isPlaying
                            ? "text-rose-600 text-sm font-semibold"
                            : "text-gray-500 text-sm"
                        }
                      >
                        {isPlaying ? "Stop" : "Play"}
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="relative h-24 sm:h-28 w-full rounded-xl border border-black/[.08] bg-white/60 overflow-hidden">
                        <div className="absolute left-4 right-4 top-4 h-8 rounded-md border border-black/[.08] bg-rose-100/60" />

                        <div className="absolute left-6 bottom-4 h-11 w-11 rounded-full border border-rose-400 bg-white/80 flex items-center justify-center">
                          <div
                            className={
                              isPlaying
                                ? "h-3 w-3 rounded-full bg-rose-500 animate-pulse-slow"
                                : "h-3 w-3 rounded-full bg-rose-300"
                            }
                          />
                        </div>
                        <div className="absolute right-6 bottom-4 h-11 w-11 rounded-full border border-rose-400 bg-white/80 flex items-center justify-center">
                          <div
                            className={
                              isPlaying
                                ? "h-3 w-3 rounded-full bg-rose-500 animate-pulse-slow"
                                : "h-3 w-3 rounded-full bg-rose-300"
                            }
                          />
                        </div>

                        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 h-8 w-20 rounded-md border border-black/[.08] bg-white/60" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-7 h-1 w-12 rounded bg-rose-300/60" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Letter (mail) */}
      <section className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-2xl mx-auto w-full">
          <div className="mb-10 sm:mb-14 md:mb-16">
            <SplitText
              text="A Letter"
              tag="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-600 mb-4 sm:mb-6 text-center"
              splitType="chars"
            />
            <BlurText
              text="There’s something I never want you to forget."
              className="text-base sm:text-lg md:text-xl text-rose-600 text-center"
              animateBy="words"
              delay={60}
            />
          </div>

          <div
            ref={mailWrapRef}
            className="w-full flex justify-center mt-8 sm:mt-12"
          >
            <button
              type="button"
              onClick={toggleMail}
              className="relative w-full max-w-[420px]"
              aria-label="Open letter"
            >
              <div className="relative w-full">
                {/* Paper */}
                <div
                  ref={mailPaperRef}
                  className="absolute inset-0 z-20 flex items-center justify-center px-5 py-6 opacity-0 mt-10"
                >
                  <div className="w-full rounded-2xl bg-white border border-black/[.08] p-5 sm:p-10">
                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      <p className="mb-3">Dear you,</p>
                      <p className="mb-3">
                        aisa kyun? kisi ke liye sab darwaein band karke bhi, hum
                        khidkiyon se jhakna nahi chhodte... shayad isiliye ki
                        hum umeed karte hain? Par phir bhi na jaan na pehchaan?
                        agr bol doon phir log kya kahenge? ye otp jaise log aur
                        LIC jaise baatein... and it was hard for me too!!
                        family, studies everything!!
                      </p>
                      <p className="mb-3">
                        But Thank you for unknowingly making my days better.
                        I’ll keep choosing you—softly, loudly, always. And I
                        talked with my stars about you noob!
                      </p>
                      <p className="text-rose-700 font-semibold">
                        Yours,
                        <br />
                        Proper bala
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cover */}
                <div ref={mailCoverRef} className="relative z-10 w-full">
                  <Image
                    src="/mail.png"
                    alt="Mail envelope"
                    width={840}
                    height={600}
                    className="w-full h-auto select-none"
                    priority={false}
                  />
                </div>
              </div>

              {/* Nudge (below the image) */}
              <div className="mt-8 sm:mt-10 text-xs sm:text-sm font-medium text-gray-500 text-center">
                <span
                  className="inline-block animate-bounce-slow"
                  style={{ animationDuration: "5.5s" }}
                >
                  Open it
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Video Cards */}
      <section className="min-h-screen py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 sm:mb-14 md:mb-16">
            <SplitText
              text="Little Moments"
              tag="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-600 mb-4 sm:mb-6 text-center"
              splitType="chars"
            />
            <BlurText
              text="They loop forever in my head — so I let them loop here too."
              className="text-base sm:text-lg md:text-xl text-rose-600 text-center"
              animateBy="words"
              delay={60}
            />
          </div>

          {(
            [
              {
                src: "/videos/hero-1.mp4",
                title: "A soft beginning",
                body: "The kind of day that quietly changes everything.",
              },
              {
                src: "/videos/hugs.mp4",
                title: "The safest place",
                body: "Where the world goes quiet for a second.",
              },
              {
                src: "/videos/summer.mp4",
                title: "Sunlight and laughter",
                body: "Warm days we’ll keep replaying.",
              },
              {
                src: "/videos/happy.mp4",
                title: "Our tiny rituals",
                body: "Coffee, whispers, and staying a little longer.",
              },
              {
                src: "/videos/latte.mp4",
                title: "Somewhere new",
                body: "Same love — different skies.",
              },
            ] as const
          ).map((card) => (
            <div key={card.src} className="mb-6 sm:mb-8">
              <div className="relative overflow-hidden rounded-2xl border border-black/[.08] bg-black">
                <video
                  className="block w-full h-auto object-cover"
                  src={card.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 text-white">
                  <div className="text-xl sm:text-2xl font-semibold leading-tight">
                    {card.title}
                  </div>
                  <div className="mt-1 text-sm sm:text-base text-white/90">
                    {card.body}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Message */}
      <section className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-transparent to-rose-100">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 md:space-y-12">
          <SplitText
            text="The End"
            tag="h2"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-rose-600"
            splitType="chars"
            from={{ opacity: 0, scale: 2 }}
            to={{ opacity: 1, scale: 1 }}
          />

          <BlurText
            text="...is just the beginning"
            className="text-2xl sm:text-3xl text-rose-500 italic"
            animateBy="words"
            delay={150}
          />

          <div className="pt-6 sm:pt-8 md:pt-12">
            <BlurText
              text="Every love story is unique. Every moment is precious. Every heartbeat matters."
              className="text-base sm:text-lg md:text-xl text-gray-600"
              animateBy="words"
              delay={80}
            />
          </div>

          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 text-4xl sm:text-5xl md:text-6xl py-6 sm:py-8 md:py-12">
            <span
              className="inline-block animate-bounce-slow text-pink-400"
              style={{ animationDelay: "0s" }}
            >
              ♥
            </span>
            <span
              className="inline-block animate-bounce-slow text-rose-400"
              style={{ animationDelay: "0.2s" }}
            >
              ♥
            </span>
            <span
              className="inline-block animate-bounce-slow text-red-400"
              style={{ animationDelay: "0.4s" }}
            >
              ♥
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
