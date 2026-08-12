"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { MapPin, Sprout, Heart } from "lucide-react";

const geoUrl =
  "https://gist.githubusercontent.com/mebaysan/9be56dd1ca5659c0ff7ea5e2b5cf6479/raw/turkey-geojson.json";

interface CityItem {
  name: string;
  coordinates: [number, number];
  featured?: boolean;
}

const CITIES: CityItem[] = [
  { name: "İstanbul", coordinates: [28.9784, 41.0082] },
  { name: "Edirne", coordinates: [26.5557, 41.6771] },
  { name: "Kocaeli", coordinates: [29.9408, 40.7654] },
  { name: "Düzce", coordinates: [31.1636, 40.8438] },
  { name: "Bursa", coordinates: [29.06, 40.195] },
  { name: "Kastamonu", coordinates: [33.7827, 41.3766] },
  { name: "Ankara", coordinates: [32.8597, 39.9334] },
  { name: "İzmir", coordinates: [27.1428, 38.4237] },
  { name: "Muğla", coordinates: [28.3636, 37.2153] },
  { name: "Antalya", coordinates: [30.7133, 36.8969] },
  { name: "Konya", coordinates: [32.4932, 37.8714] },
  { name: "Niğde", coordinates: [34.6783, 37.9698] },
  { name: "Gaziantep", coordinates: [37.3781, 37.0662] },
  { name: "Hatay", coordinates: [36.1613, 36.2022] },
  { name: "Elazığ", coordinates: [39.2264, 38.681], featured: true },
];

export function TurkeyMapSection() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <section
      className="w-full relative bg-[#F9FAF8] py-12 sm:py-16 lg:py-20 border-b border-[#EEF0F2]"
      id="harita"
    >
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(10,92,58,0.04)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 select-none space-y-3">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#0A5C3A]/25 text-[#07452C] font-semibold text-xs sm:text-sm shadow-xs">
            <MapPin className="w-4 h-4 text-[#0A5C3A]" />
            <span>Topluluk Haritası</span>
          </div>

          {/* Main Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#07452C] font-headings">
            Biz Her Yerdeyiz
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#5F6773] font-sans font-medium max-w-xl mx-auto leading-relaxed">
            Farklı şehirlerden gençleri bir araya getiriyor, birlikte üretmenin ve gelişmenin gücünü büyütüyoruz.
          </p>
        </div>

        {/* Turkey Map Centered Container */}
        <div className="my-4 sm:my-8 w-full max-w-5xl mx-auto flex justify-center items-center">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [35.35, 38.95],
              scale: 2800,
            }}
            width={960}
            height={440}
            style={{ width: "100%", height: "auto" }}
            className="select-none drop-shadow-xs"
          >
            <defs>
              {/* Hand-drawn sketchy edge turbulence filter */}
              <filter id="sketchEdge" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.02"
                  numOctaves="3"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="2.0"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>

              {/* Gentle map drop shadow */}
              <filter id="softMapGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="6"
                  floodColor="#07452C"
                  floodOpacity="0.08"
                />
              </filter>
            </defs>

            {/* Decorative Hand-Drawn Clouds in Sky */}
            <g opacity="0.35" fill="none" stroke="#07452C" strokeWidth="1.2" strokeLinecap="round">
              <path d="M 70 55 Q 82 43 98 49 Q 112 37 128 51 Q 138 51 142 61 Q 122 67 70 55 Z" fill="#F0F5EF" />
              <path d="M 810 50 Q 822 38 838 44 Q 852 32 868 46 Q 878 46 882 56 Q 862 62 810 50 Z" fill="#F0F5EF" />
            </g>

            {/* Decorative Flying Birds */}
            <g opacity="0.45" stroke="#07452C" strokeWidth="1.2" fill="none" strokeLinecap="round">
              <path d="M 90 100 Q 98 90 106 100 Q 114 90 122 100" />
              <path d="M 740 85 Q 748 77 756 85 Q 764 77 772 85" />
            </g>

            {/* Decorative Hand-Drawn Ocean Waves around Seas */}
            <g opacity="0.35" stroke="#07452C" strokeWidth="1.2" fill="none" strokeLinecap="round">
              {/* Aegean Waves */}
              <path d="M 90 240 Q 105 232 120 240 T 150 240" />
              <path d="M 100 290 Q 115 282 130 290 T 160 290" />
              <path d="M 80 340 Q 95 332 110 340 T 140 340" />
              {/* Mediterranean Waves */}
              <path d="M 280 395 Q 295 387 310 395 T 340 395" />
              <path d="M 450 405 Q 465 397 480 405 T 510 405" />
              <path d="M 620 395 Q 635 387 650 395 T 680 395" />
              {/* Black Sea Waves */}
              <path d="M 370 65 Q 385 57 400 65 T 430 65" />
              <path d="M 580 60 Q 595 52 610 60 T 640 60" />
            </g>

            {/* Hand-Drawn Sailboat Sketch in Aegean Sea */}
            <g transform="translate(105, 345) scale(0.85)" opacity="0.5" stroke="#07452C" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 0 16 L 24 16 L 18 24 L 6 24 Z" fill="#FFFFFF" />
              <path d="M 12 16 L 12 0 L 22 13 Z" fill="#E8F1E7" />
              <path d="M 10 16 L 10 4 L 2 14 Z" fill="#E8F1E7" />
            </g>

            {/* Hand-Drawn Sketched Turkey Geography */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    filter="url(#sketchEdge) url(#softMapGlow)"
                    style={{
                      default: {
                        fill: "#E3ECE1",
                        stroke: "#07452C",
                        strokeWidth: 1.4,
                        strokeOpacity: 0.85,
                        outline: "none",
                        transition: "all 300ms ease",
                      },
                      hover: {
                        fill: "#D5E4D2",
                        stroke: "#053A24",
                        strokeWidth: 1.8,
                        strokeOpacity: 1.0,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#C6DAC2",
                        stroke: "#053A24",
                        strokeWidth: 1.8,
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Hand-Drawn Pine Tree Sketches across Anatolia */}
            <g opacity="0.4" stroke="#07452C" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* Aegean Pine Trees */}
              <path d="M 230 270 L 235 260 L 240 270 M 232 265 L 235 256 L 238 265 M 235 270 L 235 274" />
              <path d="M 245 280 L 250 270 L 255 280 M 247 275 L 250 266 L 253 275 M 250 280 L 250 284" />
              {/* Central Anatolia Pine Trees */}
              <path d="M 440 250 L 445 240 L 450 250 M 442 245 L 445 236 L 448 245 M 445 250 L 445 254" />
              <path d="M 458 260 L 463 270 L 468 260 M 460 255 L 463 246 L 466 255 M 463 260 L 463 264" />
              <path d="M 540 270 L 545 260 L 550 270 M 542 265 L 545 256 L 548 265 M 545 270 L 545 274" />
              {/* Eastern Anatolia Pine Trees */}
              <path d="M 720 260 L 725 250 L 730 260 M 722 255 L 725 246 L 728 255 M 725 260 L 725 264" />
              <path d="M 780 240 L 785 230 L 790 240 M 782 235 L 785 226 L 788 235 M 785 260 L 785 264" />
            </g>

            {/* Hand-Drawn Mountain Sketches in East Anatolia */}
            <g opacity="0.4" stroke="#07452C" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 730 210 L 742 190 L 754 210 M 748 200 L 758 184 L 768 210" />
            </g>

            {/* City Markers - Clean Teardrop Pins Only (No text labels) */}
            {CITIES.map(({ name, coordinates, featured }) => {
              const isHovered = hoveredCity === name;

              return (
                <Marker
                  key={name}
                  coordinates={coordinates}
                >
                  <g
                    onMouseEnter={() => setHoveredCity(name)}
                    onMouseLeave={() => setHoveredCity(null)}
                    className="cursor-pointer group"
                  >
                    <title>{name}</title>

                    {/* Featured City (Elazığ) Subtle Soft Pulse Ring */}
                    {featured && (
                      <circle
                        r="10"
                        fill="#0A5C3A"
                        fillOpacity="0.25"
                        className="animate-pulse"
                      />
                    )}

                    {/* Marker Drop Shadow */}
                    <ellipse cx="0" cy="2" rx="4" ry="1.5" fill="#000000" fillOpacity="0.2" />

                    {/* Smooth Hand-Drawn Teardrop Pin Icon */}
                    <path
                      d="M0,-16 C-6,-16 -10,-11 -10,-4 C-10,4 0,14 0,14 C0,14 10,4 10,-4 C10,-11 6,-16 0,-16Z"
                      fill={isHovered ? "#053A24" : "#07452C"}
                      stroke="#FFFFFF"
                      strokeWidth="1.6"
                      transform={isHovered ? "scale(1.2) translate(0, -2)" : "scale(1)"}
                      className="transition-transform duration-200 drop-shadow-sm"
                    />

                    {/* Pin Center White Dot */}
                    <circle
                      cx="0"
                      cy="-6"
                      r="3"
                      fill="#FFFFFF"
                    />
                  </g>
                </Marker>
              );
            })}
          </ComposableMap>
        </div>

        {/* Bottom Callout Banner Card */}
        <div className="mt-6 sm:mt-10 max-w-xl mx-auto rounded-2xl bg-[#EEF5EC] border border-[#0A5C3A]/20 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs select-none">
          {/* Left Sprout Icon */}
          <div className="w-10 h-10 rounded-xl bg-white text-[#0A5C3A] flex items-center justify-center shrink-0 shadow-xs border border-[#0A5C3A]/10">
            <Sprout className="w-5 h-5 stroke-[2]" />
          </div>

          {/* Center Message Text */}
          <div className="flex-1 text-center">
            <p className="text-xs sm:text-sm text-[#5F6773] font-sans font-medium">
              Daha fazla şehir, daha fazla genç, daha güçlü bir gelecek.
            </p>
            <p className="text-sm sm:text-base font-extrabold text-[#07452C] font-headings mt-0.5">
              N'apsak? Birlikte yaparız!
            </p>
          </div>

          {/* Right Heart Icon */}
          <div className="w-10 h-10 rounded-xl bg-white text-[#0A5C3A] flex items-center justify-center shrink-0 shadow-xs border border-[#0A5C3A]/10">
            <Heart className="w-5 h-5 stroke-[2] text-[#0A5C3A] fill-[#0A5C3A]/10" />
          </div>
        </div>

      </div>
    </section>
  );
}

export default TurkeyMapSection;
