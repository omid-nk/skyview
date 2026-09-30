import WeatherIcon from "@/components/WeatherIcon";

export default function WeatherResult({ data }) {
  const weather = data.weather?.[0];

  const temperature = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;

  return (
    <section className="relative mt-5 overflow-hidden rounded-4xl border border-white/40 bg-white/5 p-1.5 shadow-[0_25px_80px_-30px_rgba(56,189,248,0.35)] backdrop-blur-2xl sm:mt-6 sm:rounded-[2.25rem] sm:p-2">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-64 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative grid overflow-hidden rounded-[1.6rem] border border-white/10 bg-sky-400/5 sm:grid-cols-[1.05fr_0.95fr] md:grid-cols-[1.1fr_0.9fr]">
        {/* Weather visual */}
        <div className="relative flex min-h-56 items-center justify-center overflow-visible sm:min-h-64 md:min-h-72">
          {/* Large atmospheric glow */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/15 blur-3xl sm:size-56 md:size-64" />

          {/* Secondary glow */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/50 blur-2xl sm:size-40 md:size-48" />

          {/* Weather icon */}
          <div className="relative z-10 scale-100 sm:scale-110 md:scale-[1.22]">
            <WeatherIcon condition={weather?.main} />
          </div>
        </div>

        {/* Weather information */}
        <div className="relative flex min-w-0 flex-col justify-center px-4 pt-1 pb-5 sm:px-5 sm:py-6 md:px-6">
          {/* Location */}
          <div className="flex min-w-0 items-center gap-2">
            <span className="size-1.5 shrink-0 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]" />

            <span className="truncate text-[10px] font-semibold tracking-[0.18em] text-zinc-400 uppercase sm:text-xs">
              {data.sys.country}
            </span>
          </div>

          <h2
            className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-800 sm:text-2xl md:text-[1.7rem]"
            title={data.name}
          >
            {data.name}
          </h2>

          {/* Temperature */}
          <div className="mt-3 flex items-start">
            <span className="text-5xl leading-[0.9] font-semibold tracking-[-0.06em] text-zinc-800 sm:text-6xl md:text-[4.25rem]">
              {temperature}
            </span>

            <span className="mt-1 ml-1 text-base font-medium text-zinc-400 sm:mt-1.5 sm:ml-1.5 sm:text-lg">
              °C
            </span>
          </div>

          {/* Description */}
          <p
            className="mt-2 truncate text-xs font-medium text-zinc-500 capitalize sm:mt-3 sm:text-sm"
            title={weather?.description}
          >
            {weather?.description}
          </p>

          {/* Extra information */}
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-900/5 pt-3 sm:mt-5 sm:pt-4">
            <div className="min-w-0">
              <p className="text-[9px] font-medium tracking-wide text-zinc-400 uppercase sm:text-[10px]">
                Feels like
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-zinc-700 sm:text-sm">
                {feelsLike}°C
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-medium tracking-wide text-zinc-400 uppercase sm:text-[10px]">
                Humidity
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-zinc-700 sm:text-sm">
                {humidity}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
