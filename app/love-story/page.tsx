/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useRef } from "react";
import SplitText from "@/components/interface/split-text";
import BlurText from "@/components/interface/blur-text";
import CurvedLoop from "@/components/interface/curved-text";
import VariableProximity from "@/components/interface/variable-text";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LoveStory() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const interactiveSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

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
            text="Two hearts discovered a love that would transcend time and space"
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
              text="In a world filled with billions of souls, two paths crossed on an ordinary Tuesday afternoon. The coffee shop was busy, the air thick with the aroma of fresh espresso and possibility."
              className="text-center"
              animateBy="words"
              delay={50}
            />

            <BlurText
              text="Their eyes met across the crowded room. Time seemed to pause. In that singular moment, the universe conspired to bring them together."
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
              text="Growing Together"
              tag="h3"
              className="text-2xl sm:text-3xl md:text-4xl text-rose-500 text-center italic"
              splitType="words"
            />
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <BlurText
                text="They shared late-night conversations that stretched into dawn"
                className="text-base sm:text-lg text-gray-700"
                animateBy="words"
                delay={80}
              />
              <BlurText
                text="They found comfort in comfortable silences"
                className="text-base sm:text-lg text-gray-700"
                animateBy="words"
                delay={80}
              />
              <BlurText
                text="They built a world where only they existed"
                className="text-base sm:text-lg text-gray-700"
                animateBy="words"
                delay={80}
              />
            </div>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <BlurText
                text="Every smile became a treasure"
                className="text-base sm:text-lg text-gray-700"
                animateBy="words"
                delay={80}
              />
              <BlurText
                text="Every touch felt like coming home"
                className="text-base sm:text-lg text-gray-700"
                animateBy="words"
                delay={80}
              />
              <BlurText
                text="Every day was a new chapter in their story"
                className="text-base sm:text-lg text-gray-700"
                animateBy="words"
                delay={80}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Section */}
      <section
        ref={interactiveSectionRef}
        className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 px-4"
      >
        <div className="max-w-5xl mx-auto text-center">
          <div style={{ position: "relative" }}>
            <VariableProximity
              label="Love grows stronger ♥"
              className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-rose-500 leading-tight"
              fromFontVariationSettings="'wght' 100, 'wdth' 75"
              toFontVariationSettings="'wght' 900, 'wdth' 125"
              containerRef={interactiveSectionRef}
              radius={200}
              falloff="gaussian"
              style={{ fontFamily: '"Roboto Flex", sans-serif' }}
            />
          </div>

          <BlurText
            text="Move your cursor to feel the magic"
            className="text-lg sm:text-xl md:text-2xl text-rose-400 italic mt-4 sm:mt-6 md:mt-8"
            animateBy="words"
          />
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
              text="The Promise"
              tag="h3"
              className="text-2xl sm:text-3xl md:text-4xl text-rose-500 text-center italic"
              splitType="words"
            />
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-12 text-center">
            <BlurText
              text="They learned that love isn't about finding the perfect person"
              className="text-lg sm:text-xl md:text-2xl text-gray-700"
              animateBy="words"
              delay={100}
            />

            <BlurText
              text="It's about seeing an imperfect person perfectly"
              className="text-lg sm:text-xl md:text-2xl text-gray-700"
              animateBy="words"
              delay={100}
            />

            <div className="py-6 sm:py-8 md:py-12">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-pink-400 animate-pulse-slow">♥</div>
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
