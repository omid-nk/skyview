"use client";

import Background from "@/components/Background";
import WeatherIcon from "@/components/WeatherIcon";

const weatherConditions = [
  "Clear",
  "Clouds",
  "Rain",
  "Drizzle",
  "Thunderstorm",
  "Snow",
  "Mist",
  "Fog",
  "Smoke",
  "Haze",
  "Dust",
  "Sand",
  "Ash",
  "Squall",
  "Tornado",
];

export default function WeatherIconsPage() {
  return (
    <main className="m-4 rounded-2xl bg-black/10 px-12 py-16">
      <Background condition={"clear"} />
      <div className="mx-auto">
        {/* Icons */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {weatherConditions.map((condition) => (
            <div
              key={condition}
              className="group flex flex-col items-center justify-center px-4 py-6 transition duration-300"
            >
              <div className="flex h-40 w-40 items-center justify-center">
                <WeatherIcon condition={condition} />
              </div>

              <div className="mt-3 text-center">
                <p className="mt-2 text-xs font-medium text-zinc-800">
                  {condition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
