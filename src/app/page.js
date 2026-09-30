import { getCurrent } from "@/services/get-current";

import Background from "@/components/Background";
import SearchBar from "@/components/SearchBar";
import WeatherResult from "@/components/WeatherResult";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const city = params.city?.trim();

  let data = null;
  let error = null;

  try {
    data = await getCurrent({
      value: city || "tehran",
    });
  } catch (err) {
    error = err.message;
  }

  return (
    <main className="font-primary mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-2 px-4 py-12 sm:max-w-md sm:px-6 md:max-w-lg md:px-8 lg:max-w-xl">
      <Background condition={data?.weather?.[0]?.main} />

      <p className="mb-2 text-center text-sm text-zinc-600">
        Real Weather. Beautifully Visualized.
      </p>
      <h1 className="mb-4 text-center text-2xl leading-normal text-zinc-800 sm:text-3xl md:text-4xl">
        What&apos;s the weather like <br /> in{" "}
        <span className="text-violet-500">your city?</span>
      </h1>

      <SearchBar initialValue={city ?? ""} />

      {error === "LOCATION_NOT_FOUND" ? (
        <div className="mt-4 rounded-3xl border border-white/70 bg-white/60 p-5 text-center shadow-[0_20px_60px_-20px_rgba(56,189,248,0.25)] backdrop-blur-xl">
          <p className="text-lg font-semibold text-zinc-800">City not found</p>

          <p className="mt-1 text-sm text-zinc-500">
            We couldn&apos;t find the city you&apos;re looking for.
          </p>
        </div>
      ) : error ? (
        <div className="mt-4 rounded-3xl border border-white/70 bg-white/60 p-5 text-center shadow-[0_20px_60px_-20px_rgba(56,189,248,0.25)] backdrop-blur-xl">
          <p className="text-lg font-semibold text-zinc-800">
            Something went wrong
          </p>

          <p className="mt-1 text-sm text-zinc-500">Please try again.</p>
        </div>
      ) : (
        <WeatherResult data={data} />
      )}
    </main>
  );
}
