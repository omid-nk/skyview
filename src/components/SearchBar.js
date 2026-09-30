"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { LuSearch, LuArrowRight } from "react-icons/lu";
import { motion } from "motion/react";

export default function SearchBar({ initialValue = "" }) {
  const router = useRouter();
  const inputRef = useRef(null);

  const [value, setValue] = useState(initialValue);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const city = value.trim();

    // Empty search → remove city from URL
    if (!city) {
      router.replace("/");
      return;
    }

    // Search city
    router.replace(`/?city=${encodeURIComponent(city)}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <motion.div
          onClick={focusInput}
          className="relative flex h-16 w-full cursor-text items-center gap-2 rounded-full border border-white/70 bg-white/65 p-2 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.35)] backdrop-blur-xl transition-all duration-500 focus-within:border-sky-100 focus-within:shadow-[0_25px_80px_-20px_rgba(56,189,248,0.5)] hover:border-sky-100 hover:bg-white/80 hover:shadow-[0_25px_70px_-20px_rgba(56,189,248,0.45)]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-400/5 text-sky-400">
            <LuSearch className="size-5" />
          </div>

          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            type="text"
            placeholder="Search for a city..."
            className="min-w-0 flex-1 cursor-text bg-transparent px-1 text-base font-medium text-slate-700 outline-none placeholder:text-slate-400"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-linear-to-b from-sky-300 to-sky-400 text-white"
          >
            <LuArrowRight className="size-5" />
          </motion.button>
        </motion.div>
      </form>
    </>
  );
}
