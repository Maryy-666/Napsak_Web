"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl =
  "https://gist.githubusercontent.com/mebaysan/9be56dd1ca5659c0ff7ea5e2b5cf6479/raw/turkey-geojson.json";

const cities = [
  { name: "İstanbul", coordinates: [28.9784, 41.0082] },
  { name: "Edirne", coordinates: [26.5557, 41.6771] },
  { name: "Kocaeli", coordinates: [29.9408, 40.7654] },
  { name: "Bursa", coordinates: [29.06, 40.195] },
  { name: "Ankara", coordinates: [32.8597, 39.9334] },
  { name: "İzmir", coordinates: [27.1428, 38.4237] },
  { name: "Düzce", coordinates: [31.1636, 40.8438] },
  { name: "Kastamonu", coordinates: [33.7827, 41.3766] },
  { name: "Elazığ", coordinates: [39.2264, 38.681] },
  { name: "Gaziantep", coordinates: [37.3781, 37.0662] },
  { name: "Hatay", coordinates: [36.1613, 36.2022] },
  { name: "Antalya", coordinates: [30.7133, 36.8969] },
  { name: "Muğla", coordinates: [28.3636, 37.2153] },
];

export function TurkeyMapSection() {
  return (
    <section className="relative overflow-hidden bg-[#F7FAF7] py-16 sm:py-20">

        {/* Başlık */}
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="font-headings text-4xl font-extrabold tracking-tight text-[#064E3B] sm:text-5xl md:text-6xl">
            Biz Her Yerdeyiz
          </h2>
        </div>

        {/* Harita */}
        <div className="mx-auto w-full max-w-6xl">

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [35.4, 38.95],
              scale: 3400,
            }}
            width={1000}
            height={450}
            className="h-auto w-full"
          >

            <defs>

              {/* Harita gölgesi */}
              <filter
                id="mapShadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="8"
                  floodColor="#174D38"
                  floodOpacity="0.18"
                />
              </filter>

              {/* Pin gölgesi */}
              <filter
                id="pinShadow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feDropShadow
                  dx="0"
                  dy="5"
                  stdDeviation="4"
                  floodColor="#064E3B"
                  floodOpacity="0.40"
                />
              </filter>

            </defs>

            {/* Türkiye haritası */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    filter="url(#mapShadow)"
                    style={{
                      default: {
                        fill: "#EAF2E9",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.6,
                        outline: "none",
                      },
                      hover: {
                        fill: "#EAF2E9",
                        stroke: "#FFFFFF",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#EAF2E9",
                        stroke: "#FFFFFF",
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Şehir pinleri */}
            {cities.map(({ name, coordinates }) => (
              <Marker
                key={name}
                coordinates={coordinates as [number, number]}
              >
                <g filter="url(#pinShadow)">

                  {/* Pin */}
                  <path
                    d="
                      M0,-18
                      C-9,-18 -15,-11 -15,-3
                      C-15,7 0,22 0,22
                      C0,22 15,7 15,-3
                      C15,-11 9,-18 0,-18Z
                    "
                    fill="#075C43"
                  />

                  {/* Pin içindeki beyaz daire */}
                  <circle
                    cx="0"
                    cy="-4"
                    r="5"
                    fill="#F7FAF7"
                  />

                </g>
              </Marker>
            ))}

          </ComposableMap>

        </div>
      </div>
    </section>
  );
}
