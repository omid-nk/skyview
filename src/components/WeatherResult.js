import WeatherIcon from "@/components/WeatherIcon";

export default function WeatherResult({ data }) {
  const weather = data.weather?.[0];
  const temperature = Math.round(data.main.temp);

  return (
    <div className="mt-5 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-1.5 rounded-4xl border border-white/20 bg-white/25 p-1.5 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.25)] backdrop-blur-xl sm:gap-2 sm:p-2 md:grid-cols-[1fr_1.15fr]">
      <div className="relative flex min-h-40 min-w-0 items-center justify-center overflow-hidden rounded-[1.7rem] sm:min-h-48 md:min-h-52">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl" />

        <div className="scale-75 sm:scale-90 md:scale-100">
          <WeatherIcon condition={weather?.main} />
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center px-2.5 py-4 sm:px-4 sm:py-5 md:px-4">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <span className="size-1.5 shrink-0 rounded-full bg-sky-400" />

          <span className="truncate text-[10px] font-medium tracking-wider text-zinc-400 uppercase sm:text-xs">
            {data.sys.country}
          </span>
        </div>

        <h2 className="mt-1 truncate text-lg font-semibold tracking-tight text-zinc-800 sm:text-2xl md:text-2xl">
          {data.name}
        </h2>

        <div className="mt-2 flex items-start sm:mt-3">
          <span className="text-4xl leading-none font-semibold tracking-tight text-zinc-800 sm:text-5xl md:text-5xl">
            {temperature}
          </span>

          <span className="ml-0.5 text-sm font-medium text-zinc-400 sm:ml-1 sm:text-lg">
            °C
          </span>
        </div>

        <p className="mt-2 truncate text-xs text-zinc-500 capitalize sm:mt-3 sm:text-sm">
          {weather?.description}
        </p>
      </div>
    </div>
  );
}
