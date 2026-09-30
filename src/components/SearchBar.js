"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { LuSearch, LuArrowRight } from "react-icons/lu";

import { motion } from "motion/react";

export default function SearchBar({ initialValue = "" }) {
  const router = useRouter();

  const inputRef = useRef(null);

  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  /*
   * Keep input synced with the current URL/search result.
   */
  useEffect(() => {
    setValue(initialValue);
    setIsLoading(false);
  }, [initialValue]);

  /*
   * Focus search when user starts typing anywhere on the page.
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      const isTypingField =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (isTypingField) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (event.key.length !== 1) {
        return;
      }

      inputRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * Cmd/Ctrl + K → focus search.
   */
  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  /*
   * Escape → remove focus from search.
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (
        event.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const focusInput = () => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const city = value.trim();

    setIsLoading(true);

    if (!city) {
      router.replace("/");
      return;
    }

    router.replace(`/?city=${encodeURIComponent(city)}`);

    inputRef.current?.blur();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.div
        onClick={focusInput}
        className="relative flex h-16 w-full cursor-text items-center gap-2 rounded-full border border-white/70 bg-white/65 p-2 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.35)] backdrop-blur-xl transition-all duration-500 focus-within:border-sky-100 focus-within:shadow-[0_25px_80px_-20px_rgba(56,189,248,0.5)] hover:border-sky-100 hover:bg-white/80 hover:shadow-[0_25px_70px_-20px_rgba(56,189,248,0.45)]"
      >
        {/* Search icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-400/5 text-sky-400">
          <motion.div
            animate={
              isLoading
                ? {
                    rotate: [0, -8, 8, -8, 0],
                  }
                : {
                    rotate: 0,
                  }
            }
            transition={
              isLoading
                ? {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : {
                    duration: 0.2,
                  }
            }
          >
            <LuSearch className="size-5" />
          </motion.div>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          type="text"
          autoComplete="off"
          spellCheck="false"
          disabled={isLoading}
          placeholder="Search for a city..."
          aria-label="Search for a city"
          className="min-w-0 flex-1 cursor-text bg-transparent px-1 text-base font-medium text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-wait disabled:opacity-70"
        />

        {/* Submit */}
        <motion.button
          type="submit"
          aria-label={isLoading ? "Searching..." : "Search"}
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.04 } : undefined}
          whileTap={!isLoading ? { scale: 0.96 } : undefined}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/50 bg-linear-to-b from-sky-300 to-sky-400 text-white shadow-[0_8px_20px_-8px_rgba(14,165,233,0.7)] disabled:cursor-wait"
        >
          {isLoading ? (
            <>
              {/* Rotating loader */}
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute size-6 rounded-full border-2 border-white/30 border-t-white"
              />

              {/* Center pulse */}
              <motion.span
                animate={{
                  scale: [0.7, 1, 0.7],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="size-1.5 rounded-full bg-white"
              />
            </>
          ) : (
            <motion.span
              initial={false}
              animate={{
                x: 0,
                opacity: 1,
              }}
            >
              <LuArrowRight className="size-5" />
            </motion.span>
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}
