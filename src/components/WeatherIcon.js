"use client";

import { useEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

/* -------------------------------------------------------------------------- */
/*                                  CONFIG                                    */
/* -------------------------------------------------------------------------- */

const sceneTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};

const createLoop = (duration, ease = "easeInOut") => ({
  duration,
  repeat: Infinity,
  ease,
});

const MAGNET_RADIUS = 220;
const MAGNET_PULL = 28;
const SPRING_CONFIG = {
  stiffness: 120,
  damping: 15,
  mass: 0.7,
};

/* -------------------------------------------------------------------------- */
/*                              SHARED HOOKS                                  */
/* -------------------------------------------------------------------------- */

function useMagneticMotion({
  radius = MAGNET_RADIUS,
  pull = MAGNET_PULL,
} = {}) {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, SPRING_CONFIG);
  const y = useSpring(mouseY, SPRING_CONFIG);

  useEffect(() => {
    const updatePosition = () => {
      frameRef.current = null;

      const element = containerRef.current;

      if (!element) return;

      const rect = element.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = pointerRef.current.x - centerX;
      const dy = pointerRef.current.y - centerY;

      const distanceSquared = dx * dx + dy * dy;
      const radiusSquared = radius * radius;

      if (distanceSquared > radiusSquared) {
        mouseX.set(0);
        mouseY.set(0);
        return;
      }

      const distance = Math.sqrt(distanceSquared);
      const strength = 1 - distance / radius;
      const amount = pull * strength;

      mouseX.set((dx / radius) * amount);
      mouseY.set((dy / radius) * amount);
    };

    const handlePointerMove = (event) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;

      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [mouseX, mouseY, pull, radius]);

  return {
    containerRef,
    style: { x, y },
  };
}

/* -------------------------------------------------------------------------- */
/*                                    SCENE                                   */
/* -------------------------------------------------------------------------- */

function Scene({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={sceneTransition}
      className={`relative flex h-32 w-32 items-center justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    CLEAR                                   */
/* -------------------------------------------------------------------------- */

function SunOrb() {
  const { containerRef, style } = useMagneticMotion();

  return (
    <div ref={containerRef} className="relative h-24 w-24">
      <motion.div style={style} className="absolute inset-0">
        {/* Atmospheric glow */}
        <motion.div
          className="absolute -inset-8 rounded-full bg-amber-300/20 blur-3xl"
          animate={{
            scale: [0.9, 1.15, 0.9],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={createLoop(3.5)}
        />

        {/* Secondary glow */}
        <motion.div
          className="absolute -inset-3 rounded-full bg-orange-200/20 blur-xl"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.4, 0.65, 0.4],
          }}
          transition={createLoop(2.5)}
        />

        {/* Atmospheric ring */}
        <motion.div
          className="absolute -inset-2 rounded-full border border-amber-200/20"
          animate={{
            rotate: 360,
            scale: [1, 1.04, 1],
          }}
          transition={{
            rotate: {
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            },
            scale: createLoop(3),
          }}
        />

        {/* Sun */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-full bg-linear-to-br from-yellow-100 via-amber-300 to-orange-500"
          animate={{
            scale: [0.98, 1.03, 0.98],
            rotate: [0, 1.5, 0, -1.5, 0],
            boxShadow: [
              "0 0 28px rgba(251,191,36,0.35)",
              "0 0 48px rgba(251,191,36,0.55)",
              "0 0 28px rgba(251,191,36,0.35)",
            ],
          }}
          transition={{
            scale: createLoop(4),
            rotate: createLoop(8),
            boxShadow: createLoop(3),
          }}
        >
          <div className="absolute inset-1 rounded-full bg-linear-to-br from-white/30 via-transparent to-orange-500/20" />

          {/* Moving reflection */}
          <motion.div
            className="absolute top-0 -left-1/2 h-full w-1/2 rotate-25 bg-linear-to-r from-transparent via-white/35 to-transparent blur-md"
            animate={{
              x: ["0%", "300%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
          />

          {/* Highlight */}
          <motion.div
            className="absolute top-3 left-4 h-7 w-7 rounded-full bg-white/30 blur-md"
            animate={{
              opacity: [0.35, 0.65, 0.35],
              scale: [0.9, 1.08, 0.9],
            }}
            transition={createLoop(2.5)}
          />

          <div className="absolute bottom-1 left-1/2 h-7 w-12 -translate-x-1/2 rounded-full bg-orange-600/20 blur-md" />
        </motion.div>

        {/* Floating particles */}
        <motion.div
          className="absolute top-2 -right-5 h-1.5 w-1.5 rounded-full bg-amber-200/70 blur-[1px]"
          animate={{
            y: [0, -5, 0],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={createLoop(2.2)}
        />

        <motion.div
          className="absolute -bottom-3 left-1 h-1 w-1 rounded-full bg-yellow-100/60"
          animate={{
            x: [0, 4, 0],
            y: [0, -3, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={createLoop(2.8)}
        />
      </motion.div>
    </div>
  );
}

function Clear() {
  return (
    <Scene>
      <SunOrb />
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   CLOUDS                                   */
/* -------------------------------------------------------------------------- */

function CloudOrb({ tone = "normal", size = "normal", motionSpeed = 5 }) {
  const { containerRef, style } = useMagneticMotion();

  const isDark = tone === "dark" || tone === "storm";
  const isRain = tone === "rain";
  const isSnow = tone === "snow";
  const isSmall = size === "small";

  const cloudWidth = isSmall ? "w-[82px]" : "w-[94px]";
  const cloudHeight = isSmall ? "h-[55px]" : "h-[62px]";

  const cloudGradient = isDark
    ? "from-slate-300/90 via-slate-500/90 to-slate-800"
    : isSnow
      ? "from-white via-slate-100 to-slate-300"
      : isRain
        ? "from-slate-100 via-slate-300 to-slate-500"
        : "from-white via-slate-100 to-slate-300";

  const glowColor = isDark
    ? "bg-slate-400/15"
    : isRain
      ? "bg-sky-200/20"
      : "bg-white/25";

  return (
    <div ref={containerRef} className={`relative ${cloudWidth} ${cloudHeight}`}>
      <motion.div style={style} className="absolute inset-0">
        {/* Atmospheric glow */}
        <motion.div
          className={`absolute -inset-8 rounded-full ${glowColor} blur-3xl`}
          animate={{
            scale: [0.9, 1.12, 0.9],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={createLoop(motionSpeed)}
        />

        {/* Soft ambient halo */}
        <motion.div
          className="absolute -inset-3 rounded-full bg-white/10 blur-2xl"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={createLoop(motionSpeed * 0.8)}
        />

        {/* Grounding shadow */}
        <motion.div
          className="absolute -bottom-1.75 left-1/2 h-4 w-[72%] -translate-x-1/2 rounded-full bg-slate-950/30 blur-lg"
          animate={{
            scaleX: [0.9, 1.05, 0.9],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={createLoop(motionSpeed)}
        />

        {/* Cloud body */}
        <motion.div
          className={`absolute bottom-0 left-1/2 h-11.5 w-[88%] -translate-x-1/2 overflow-hidden rounded-[999px] bg-linear-to-b ${cloudGradient} shadow-[0_10px_30px_rgba(15,23,42,0.18)]`}
          animate={{
            y: [0, -2, 0],
            scaleX: [1, 1.015, 1],
          }}
          transition={createLoop(motionSpeed)}
        >
          <div className="absolute inset-0 bg-linear-to-b from-white/30 via-transparent to-slate-500/20" />

          <motion.div
            className="absolute top-0 -left-1/2 h-full w-[45%] rotate-18 bg-linear-to-r from-transparent via-white/35 to-transparent blur-lg"
            animate={{
              x: ["0%", "330%"],
            }}
            transition={{
              duration: motionSpeed * 1.5,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          />

          <div className="absolute right-0 bottom-0 left-0 h-1/2 bg-linear-to-t from-slate-500/20 to-transparent" />
        </motion.div>

        {/* Large cloud puff */}
        <motion.div
          className={`absolute bottom-4.25 left-2 h-12 w-12 rounded-full bg-linear-to-br ${cloudGradient} shadow-[0_6px_20px_rgba(15,23,42,0.12)]`}
          animate={{
            y: [0, -2.5, 0],
            scale: [1, 1.025, 1],
          }}
          transition={createLoop(motionSpeed * 0.9)}
        >
          <div className="absolute inset-1 rounded-full bg-linear-to-br from-white/35 via-transparent to-slate-500/20" />
        </motion.div>

        {/* Center puff */}
        <motion.div
          className={`absolute bottom-4.75 left-8 h-14 w-14 rounded-full bg-linear-to-br ${cloudGradient} shadow-[0_8px_24px_rgba(15,23,42,0.14)]`}
          animate={{
            y: [0, -3, 0],
            scale: [1, 1.035, 1],
          }}
          transition={createLoop(motionSpeed * 1.05)}
        >
          <div className="absolute inset-1 rounded-full bg-linear-to-br from-white/40 via-transparent to-slate-500/20" />

          <motion.div
            className="absolute top-2 left-2.75 h-4.25 w-6.25 rounded-full bg-white/30 blur-md"
            animate={{
              opacity: [0.3, 0.55, 0.3],
            }}
            transition={createLoop(2.8)}
          />
        </motion.div>

        {/* Rear puff */}
        <motion.div
          className={`absolute right-1.75 bottom-5.25 h-10.5 w-10.5 rounded-full bg-linear-to-br ${cloudGradient}`}
          animate={{
            y: [0, -2, 0],
            scale: [1, 1.02, 1],
          }}
          transition={createLoop(motionSpeed * 1.15)}
        >
          <div className="absolute inset-1 rounded-full bg-linear-to-br from-white/25 via-transparent to-slate-500/20" />
        </motion.div>

        {/* Tiny particles */}
        <motion.div
          className="absolute top-2 -right-4 h-1 w-1 rounded-full bg-white/40 blur-[1px]"
          animate={{
            x: [0, 3, 0],
            y: [0, -4, 0],
            opacity: [0.15, 0.6, 0.15],
          }}
          transition={createLoop(2.8)}
        />

        <motion.div
          className="absolute top-5 -left-4 h-1.5 w-1.5 rounded-full bg-sky-100/30 blur-[1px]"
          animate={{
            x: [0, -3, 0],
            y: [0, 2, 0],
            opacity: [0.1, 0.45, 0.1],
          }}
          transition={createLoop(3.4)}
        />
      </motion.div>
    </div>
  );
}

function Clouds() {
  return (
    <Scene>
      <CloudOrb />
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    RAIN                                    */
/* -------------------------------------------------------------------------- */

function RainDrops({ drizzle = false, storm = false }) {
  const dropCount = drizzle ? 5 : storm ? 6 : 8;
  const duration = drizzle ? 1.7 : storm ? 0.75 : 1.05;

  return (
    <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-2">
      {Array.from({ length: dropCount }, (_, index) => (
        <motion.span
          key={index}
          animate={{
            y: [0, 20],
            opacity: [0, 0.8, 0],
            scaleY: [0.7, 1, 1.1],
          }}
          transition={{
            duration,
            delay: index * (drizzle ? 0.2 : 0.11),
            repeat: Infinity,
            ease: "easeIn",
          }}
          className={`w-0.75 rounded-full ${
            storm ? "bg-sky-400/65" : "bg-sky-400/60"
          } ${drizzle ? "h-2.5" : "h-4"}`}
        />
      ))}
    </div>
  );
}

function Rain() {
  return (
    <Scene>
      <CloudOrb tone="rain" />
      <RainDrops />
    </Scene>
  );
}

function Drizzle() {
  return (
    <Scene>
      <CloudOrb tone="rain" size="small" motionSpeed={5.5} />
      <RainDrops drizzle />
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                                THUNDERSTORM                                */
/* -------------------------------------------------------------------------- */

function LightningBolt() {
  return (
    <motion.div
      className="absolute bottom-1 left-1/2"
      animate={{
        opacity: [0, 1, 0, 0.9, 0],
        y: [0, 2, 0, 2, 0],
        scale: [0.95, 1, 0.95, 1, 0.95],
      }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="absolute -inset-3 bg-amber-300/30 blur-xl" />

      <svg
        viewBox="0 0 48 64"
        className="relative h-12 w-9 text-amber-300"
        fill="currentColor"
      >
        <path d="M28 0L8 35h12L14 64l26-39H27L28 0Z" />
      </svg>
    </motion.div>
  );
}

function Thunderstorm() {
  return (
    <Scene>
      <CloudOrb tone="storm" motionSpeed={3.5} />
      <RainDrops storm />
      <LightningBolt />
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    SNOW                                    */
/* -------------------------------------------------------------------------- */

const SNOWFLAKES = [
  {
    left: "16%",
    size: 10,
    delay: 0,
    duration: 4.2,
    drift: 7,
  },
  {
    left: "34%",
    size: 8,
    delay: 1.1,
    duration: 4.6,
    drift: -6,
  },
  {
    left: "53%",
    size: 10,
    delay: 0.5,
    duration: 4,
    drift: 6,
  },
  {
    left: "72%",
    size: 8,
    delay: 1.8,
    duration: 4.8,
    drift: -5,
  },
];

function Snowfall() {
  return (
    <div className="pointer-events-none absolute top-[58%] left-1/2 h-16 w-24 -translate-x-1/2">
      {SNOWFLAKES.map((flake, index) => (
        <motion.svg
          key={index}
          viewBox="0 0 24 24"
          className="absolute overflow-visible"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
          }}
          fill="none"
          animate={{
            y: [0, 12, 28, 48],
            x: [0, flake.drift, -flake.drift, 0],
            rotate: [0, 35, -25, 10],
            opacity: [0, 0.95, 0.8, 0],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="M12 1.5V22.5M2.9 6.75L21.1 17.25M2.9 17.25L21.1 6.75"
            stroke="#e8f8ff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <path
            d="
              M12 5L9.5 7.5
              M12 5L14.5 7.5
              M12 19L9.5 16.5
              M12 19L14.5 16.5
              M7 9L9.8 9.8
              M7 9L8.2 11.8
              M17 15L14.2 14.2
              M17 15L15.8 12.2
              M7 15L9.8 14.2
              M7 15L8.2 12.2
              M17 9L14.2 9.8
              M17 9L15.8 11.8
            "
            stroke="#bae6fd"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx="12" cy="12" r="1.4" fill="#f8fdff" />
        </motion.svg>
      ))}
    </div>
  );
}

function Snow() {
  return (
    <Scene>
      <div className="relative flex h-32 w-32 items-center justify-center">
        <CloudOrb tone="snow" motionSpeed={5} />
        <Snowfall />
      </div>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  FOG / MIST                                */
/* -------------------------------------------------------------------------- */

const FOG_WAVES = [
  {
    width: 78,
    y: 3,
    delay: 0,
    duration: 5.2,
    opacity: 0.48,
  },
  {
    width: 88,
    y: 13,
    delay: 0.7,
    duration: 5.8,
    opacity: 0.35,
  },
  {
    width: 70,
    y: 23,
    delay: 1.3,
    duration: 5,
    opacity: 0.4,
  },
];

const MIST_WAVES = [
  {
    width: 62,
    y: 5,
    delay: 0,
    duration: 4.8,
    opacity: 0.42,
  },
  {
    width: 76,
    y: 13,
    delay: 0.8,
    duration: 5.4,
    opacity: 0.3,
  },
  {
    width: 54,
    y: 21,
    delay: 1.4,
    duration: 4.5,
    opacity: 0.35,
  },
];

function FogWaves({ variant = "fog" }) {
  const isMist = variant === "mist";
  const waves = isMist ? MIST_WAVES : FOG_WAVES;

  return (
    <div
      className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 ${
        isMist ? "top-[43%] h-10 w-24" : "top-[52%] h-12 w-28"
      }`}
    >
      {waves.map((wave, index) => (
        <motion.svg
          key={index}
          viewBox={`0 0 ${wave.width} 12`}
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: wave.y,
            width: wave.width,
            height: 12,
          }}
          fill="none"
          animate={{
            x: index % 2 === 0 ? [-4, 5, -4] : [5, -4, 5],
            scaleX: [1, 1.04, 1],
            opacity: [wave.opacity * 0.65, wave.opacity, wave.opacity * 0.65],
          }}
          transition={{
            duration: wave.duration,
            delay: wave.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d={`
              M1 6
              C8 1, 14 1, 21 6
              S34 11, 41 6
              S54 1, 61 6
              S74 11, ${wave.width - 1} 6
            `}
            stroke={isMist ? "#e2e8f0" : "#f1f5f9"}
            strokeWidth={isMist ? "1.5" : "1.8"}
            strokeLinecap="round"
            opacity={wave.opacity}
          />
        </motion.svg>
      ))}
    </div>
  );
}

function Fog() {
  return (
    <Scene>
      <div className="relative flex h-32 w-32 items-center justify-center">
        <CloudOrb tone="normal" size="normal" motionSpeed={6} />
        <FogWaves variant="fog" />
      </div>
    </Scene>
  );
}

function Mist() {
  return (
    <Scene>
      <div className="relative flex h-32 w-32 items-center justify-center">
        <CloudOrb tone="normal" size="small" motionSpeed={7} />
        <FogWaves variant="mist" />
      </div>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    HAZE                                    */
/* -------------------------------------------------------------------------- */

const HAZE_LAYERS = [
  {
    width: 92,
    top: 24,
    delay: 0,
    duration: 7,
    opacity: 0.28,
  },
  {
    width: 78,
    top: 34,
    delay: 1.2,
    duration: 8,
    opacity: 0.22,
  },
  {
    width: 62,
    top: 44,
    delay: 2.1,
    duration: 6.5,
    opacity: 0.18,
  },
];

function HazeAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {/* Warm atmospheric glow */}
      <motion.div
        className="absolute -inset-8 rounded-full bg-amber-200/20 blur-3xl"
        animate={{
          opacity: [0.35, 0.6, 0.35],
          scale: [0.95, 1.08, 0.95],
        }}
        transition={createLoop(6)}
      />

      {/* Haze layers */}
      {HAZE_LAYERS.map((layer, index) => (
        <motion.svg
          key={index}
          viewBox="0 0 100 14"
          className="absolute left-1/2 h-4 -translate-x-1/2"
          style={{
            top: layer.top,
            width: layer.width,
          }}
          fill="none"
          animate={{
            x: index % 2 === 0 ? [-7, 7, -7] : [7, -7, 7],
            opacity: [layer.opacity * 0.6, layer.opacity, layer.opacity * 0.6],
            scaleX: [0.96, 1.03, 0.96],
          }}
          transition={{
            duration: layer.duration,
            delay: layer.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="
              M2 7
              C14 2 24 12 36 7
              S58 2 70 7
              S88 12 98 7
            "
            stroke="#fff7d6"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={layer.opacity}
          />
        </motion.svg>
      ))}

      {/* Soft atmospheric veil */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-10 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/10 blur-xl"
        animate={{
          x: [-8, 8, -8],
          opacity: [0.2, 0.45, 0.2],
          scaleX: [0.95, 1.08, 0.95],
        }}
        transition={createLoop(7)}
      />
    </div>
  );
}

function Haze() {
  return (
    <Scene>
      <div className="relative flex h-32 w-32 items-center justify-center">
        <SunOrb />
        <HazeAtmosphere />
      </div>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   SMOKE                                    */
/* -------------------------------------------------------------------------- */

const SMOKE_LINES = [
  { left: "38%", delay: 0 },
  { left: "50%", delay: 0.8 },
  { left: "62%", delay: 1.5 },
];

function SmokeLines() {
  return (
    <div className="pointer-events-none absolute -top-7 left-1/2 h-14 w-16 -translate-x-1/2">
      {SMOKE_LINES.map((line, index) => (
        <motion.svg
          key={index}
          viewBox="0 0 24 56"
          className="absolute h-14 w-6"
          style={{ left: line.left }}
          fill="none"
          animate={{
            x: [-2, 2, -2],
            y: [3, -2, 3],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 4.5,
            delay: line.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="
              M12 54
              C4 46 19 40 11 32
              C4 24 19 18 12 10
              C10 7 11 4 14 2
            "
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.svg>
      ))}
    </div>
  );
}

function Smoke() {
  return (
    <Scene>
      <div className="relative flex h-32 w-32 items-center justify-center">
        <SmokeLines />
        <CloudOrb tone="dark" size="normal" motionSpeed={5} />
      </div>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                         ATMOSPHERIC CLOUD BASE                             */
/* -------------------------------------------------------------------------- */

function AtmosphericCloud({ tone = "dust", size = "normal" }) {
  const isAsh = tone === "ash";
  const isSand = tone === "sand";
  const isSmall = size === "small";

  const cloudWidth = isSmall ? "w-20" : "w-24";
  const cloudHeight = isSmall ? "h-7" : "h-8";

  const baseColor = isAsh
    ? "bg-slate-500/30"
    : isSand
      ? "bg-amber-500/30"
      : "bg-amber-300/25";

  const mainColor = isAsh
    ? "bg-slate-400/35"
    : isSand
      ? "bg-amber-400/35"
      : "bg-amber-300/30";

  const rearColor = isAsh
    ? "bg-slate-600/25"
    : isSand
      ? "bg-amber-600/25"
      : "bg-amber-400/25";

  return (
    <motion.div
      className={`relative ${cloudWidth} ${cloudHeight}`}
      animate={{
        x: [-3, 3, -3],
        y: [0, -1.5, 0],
        scaleX: [1, 1.04, 1],
      }}
      transition={createLoop(isAsh ? 4 : 3)}
    >
      {/* Atmospheric glow */}
      <motion.div
        className={`absolute -inset-4 rounded-full ${baseColor} blur-2xl`}
        animate={{
          scale: [0.9, 1.08, 0.9],
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={createLoop(isAsh ? 4.5 : 3.5)}
      />

      {/* Main cloud body */}
      <div className={`absolute inset-0 rounded-full ${baseColor} blur-md`} />

      {/* Main puff */}
      <motion.div
        className={`absolute top-1 left-2 h-5 w-20 rounded-full ${mainColor} blur-sm`}
        animate={{
          scaleX: [1, 1.03, 1],
        }}
        transition={createLoop(3.5)}
      />

      {/* Left puff */}
      <motion.div
        className={`absolute -top-1 left-6 size-9 rounded-full ${mainColor} blur-sm`}
        animate={{
          y: [0, -1.5, 0],
          scale: [1, 1.04, 1],
        }}
        transition={createLoop(3)}
      />

      {/* Right puff */}
      <motion.div
        className={`absolute -top-2 right-3 size-8 rounded-full ${rearColor} blur-sm`}
        animate={{
          y: [0, -1, 0],
          scale: [1, 1.05, 1],
        }}
        transition={createLoop(3.8)}
      />

      {/* Soft highlight */}
      <motion.div
        className={`absolute top-1 left-7 h-2 w-10 rounded-full ${
          isAsh ? "bg-slate-300/10" : "bg-amber-100/15"
        } blur-md`}
        animate={{
          opacity: [0.3, 0.65, 0.3],
          x: [-2, 2, -2],
        }}
        transition={createLoop(3)}
      />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                DUST / SAND                                */
/* -------------------------------------------------------------------------- */

function DustGlow({ sand = false, ash = false }) {
  const background = ash
    ? "radial-gradient(circle, rgba(148,163,184,0.16) 0%, rgba(100,116,139,0.07) 38%, transparent 75%)"
    : sand
      ? "radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.07) 40%, transparent 75%)"
      : "radial-gradient(circle, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.04) 40%, transparent 75%)";

  return (
    <motion.div
      className="pointer-events-none absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ background }}
      animate={{
        scale: [0.92, 1.08, 0.92],
        opacity: [0.55, 0.9, 0.55],
      }}
      transition={createLoop(4)}
    />
  );
}

const DUST_WAVES = [
  { width: 84, top: 44, delay: 0, duration: 4 },
  { width: 68, top: 58, delay: 0.9, duration: 4.5 },
];

const SAND_WAVES = [
  { width: 94, top: 42, delay: 0, duration: 3.2 },
  { width: 80, top: 55, delay: 0.7, duration: 3.7 },
  { width: 64, top: 68, delay: 1.3, duration: 3.4 },
];

function DustWaves({ sand = false }) {
  const waves = sand ? SAND_WAVES : DUST_WAVES;

  return (
    <div className="pointer-events-none absolute inset-0">
      {waves.map((wave, index) => (
        <motion.svg
          key={index}
          viewBox="0 0 100 16"
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: `${wave.top}%`,
            width: wave.width,
            height: 16,
          }}
          fill="none"
          animate={{
            x: index % 2 === 0 ? [-10, 10, -10] : [10, -10, 10],
            scaleX: [0.94, 1.04, 0.94],
            opacity: [0.35, 0.8, 0.35],
          }}
          transition={{
            duration: wave.duration,
            delay: wave.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Soft outer light */}
          <path
            d="
              M2 8
              C14 2 25 14 38 8
              S62 2 75 8
              S90 13 98 8
            "
            stroke={sand ? "#f59e0b" : "#fbbf24"}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.12"
          />

          {/* Main visible wave */}
          <path
            d="
              M2 8
              C14 2 25 14 38 8
              S62 2 75 8
              S90 13 98 8
            "
            stroke={sand ? "#f6d28a" : "#ead7a8"}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Highlight */}
          <path
            d="
              M5 7
              C17 3 26 12 39 7
              S62 3 74 7
            "
            stroke="#fff7df"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.65"
          />
        </motion.svg>
      ))}
    </div>
  );
}

const DUST_PARTICLES = [
  [-34, 46, 1.5, 0],
  [-18, 59, 1, 0.5],
  [2, 42, 1.5, 1],
  [24, 55, 1, 1.4],
];

const SAND_PARTICLES = [
  [-42, 46, 2.5, 0],
  [-29, 58, 1.5, 0.25],
  [-16, 38, 2, 0.5],
  [-2, 65, 1.5, 0.8],
  [13, 48, 2.5, 1],
  [28, 59, 1.5, 1.3],
  [42, 40, 2, 1.6],
];

function DustParticles({ sand = false }) {
  const particles = sand ? SAND_PARTICLES : DUST_PARTICLES;

  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map(([x, y, size, delay], index) => (
        <motion.span
          key={index}
          className={`absolute top-0 left-1/2 rounded-full ${
            sand ? "bg-amber-300" : "bg-yellow-200"
          }`}
          style={{
            width: size,
            height: size,
            boxShadow: sand
              ? "0 0 8px rgba(251,191,36,0.5)"
              : "0 0 7px rgba(250,204,21,0.35)",
          }}
          animate={{
            x: [x - 10, x + 16, x - 5],
            y: [y + 4, y - 5, y + 3],
            opacity: [0, 1, 0.65, 0],
            scale: [0.5, 1.15, 0.8, 0.5],
          }}
          transition={{
            duration: sand ? 2.3 : 3,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function DustScene({ sand = false }) {
  return (
    <div className="relative h-32 w-32">
      <DustGlow sand={sand} />
      <DustWaves sand={sand} />
      <DustParticles sand={sand} />
    </div>
  );
}

function Dust({ sand = false }) {
  return (
    <Scene>
      <DustScene sand={sand} />
    </Scene>
  );
}

function Sand() {
  return <Dust sand />;
}

/* -------------------------------------------------------------------------- */
/*                                     ASH                                    */
/* -------------------------------------------------------------------------- */

const ASH_PARTICLE_COUNT = 12;

function AshParticles() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: ASH_PARTICLE_COUNT }, (_, index) => (
        <motion.span
          key={index}
          className={`absolute left-1/2 rounded-full ${
            index % 3 === 0 ? "size-1.5" : "size-1"
          } bg-slate-400`}
          style={{
            top: `${24 + (index % 5) * 7}%`,
            boxShadow: "0 0 5px rgba(148,163,184,0.3)",
          }}
          animate={{
            x: [0, index % 2 ? 13 : -13, index % 2 ? 5 : -5],
            y: [0, 42, 58],
            rotate: [0, 80, 140],
            opacity: [0, 0.8, 0.45, 0],
            scale: [0.6, 1, 0.7],
          }}
          transition={{
            duration: 3 + (index % 3) * 0.45,
            delay: index * 0.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function AshCloud() {
  const { containerRef, style } = useMagneticMotion({
    pull: 24,
  });

  return (
    <div ref={containerRef} className="relative h-12 w-24">
      <motion.div style={style} className="absolute inset-0">
        {/* Atmospheric glow */}
        <motion.div
          className="absolute -inset-7 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(148,163,184,0.16) 0%, rgba(100,116,139,0.06) 45%, transparent 75%)",
          }}
          animate={{
            scale: [0.95, 1.06, 0.95],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={createLoop(4)}
        />

        {/* Main cloud */}
        <motion.div
          className="absolute bottom-0 left-1/2 h-9 w-24 -translate-x-1/2 rounded-full bg-linear-to-b from-slate-300/75 via-slate-400/65 to-slate-600/55 shadow-[0_8px_20px_rgba(30,41,59,0.15)]"
          animate={{
            y: [0, -2, 0],
            scaleX: [1, 1.025, 1],
          }}
          transition={createLoop(4)}
        >
          <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/20 via-transparent to-slate-800/10" />
        </motion.div>

        {/* Left puff */}
        <motion.div
          className="absolute bottom-3 left-1 h-10 w-10 rounded-full bg-linear-to-br from-slate-300/80 to-slate-500/55"
          animate={{
            y: [0, -1.5, 0],
            scale: [1, 1.025, 1],
          }}
          transition={createLoop(3.7)}
        />

        {/* Center puff */}
        <motion.div
          className="absolute bottom-4 left-8 h-12 w-12 rounded-full bg-linear-to-br from-slate-200/85 via-slate-400/70 to-slate-600/55"
          animate={{
            y: [0, -2.5, 0],
            scale: [1, 1.035, 1],
          }}
          transition={createLoop(4.2)}
        >
          <motion.div
            className="absolute top-2 left-2 h-3 w-5 rounded-full bg-white/20 blur-sm"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={createLoop(2.8)}
          />
        </motion.div>

        {/* Right puff */}
        <motion.div
          className="absolute right-1 bottom-4 h-9 w-9 rounded-full bg-linear-to-br from-slate-300/75 to-slate-600/50"
          animate={{
            y: [0, -1.5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={createLoop(3.9)}
        />
      </motion.div>
    </div>
  );
}

function Ash() {
  return (
    <Scene>
      <div className="relative h-32 w-32">
        <AshCloud />
        <AshParticles />
      </div>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   SQUALL                                   */
/* -------------------------------------------------------------------------- */

function SquallCloud() {
  return (
    <motion.div
      className="relative z-20"
      animate={{
        x: [-6, 6, -6],
      }}
      transition={createLoop(2.5)}
    >
      <CloudOrb tone="storm" size="small" motionSpeed={2.5} />
    </motion.div>
  );
}

function SquallWind() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 5 }, (_, index) => (
        <motion.span
          key={index}
          animate={{
            x: [-65, 65],
            scaleX: [0.6, 1, 0.6],
            opacity: [0, 0.65, 0],
          }}
          transition={{
            duration: 1.1,
            delay: index * 0.18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 h-1 rounded-full bg-sky-400/45"
          style={{
            top: `${42 + index * 10}%`,
            width: `${28 + (index % 2) * 18}px`,
          }}
        />
      ))}
    </div>
  );
}

function Squall() {
  return (
    <Scene>
      <SquallWind />
      <SquallCloud />

      <motion.div
        className="absolute bottom-3 left-1/2"
        animate={{
          x: [-18, 18, -18],
          opacity: [0, 0.8, 0],
        }}
        transition={createLoop(1.5)}
      >
        <svg
          viewBox="0 0 48 48"
          className="size-8 text-sky-300/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M5 18C15 11 24 11 33 16" />
          <path d="M13 27C22 21 31 21 41 25" />
        </svg>
      </motion.div>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  TORNADO                                   */
/* -------------------------------------------------------------------------- */

function TornadoIcon() {
  return (
    <motion.div
      className="absolute bottom-1 left-1/2 -translate-x-1/2"
      animate={{
        y: [0, 2, 0],
        scale: [0.95, 1, 0.95],
        opacity: [0.45, 1, 0.45],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Soft glow */}
      <motion.div
        className="absolute -inset-3 rounded-full bg-slate-300/20 blur-lg"
        animate={{
          scale: [0.8, 1.15, 0.8],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={createLoop(1.8)}
      />

      {/* Tornado icon */}
      <svg
        viewBox="0 0 48 48"
        className="relative h-10 w-10 text-slate-200/85"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer funnel */}
        <motion.path
          d="M6 12C15 8 33 8 42 12"
          strokeWidth="2.5"
          animate={{
            pathLength: [0.8, 1, 0.8],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={createLoop(1.6)}
        />

        <motion.path
          d="M10 18C17 15 31 15 38 18"
          strokeWidth="2.4"
          animate={{
            pathLength: [0.75, 1, 0.75],
            opacity: [0.45, 0.85, 0.45],
          }}
          transition={{
            ...createLoop(1.4),
            delay: 0.15,
          }}
        />

        <motion.path
          d="M15 24C20 22 28 22 33 24"
          strokeWidth="2.3"
          animate={{
            pathLength: [0.7, 1, 0.7],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            ...createLoop(1.2),
            delay: 0.3,
          }}
        />

        {/* Funnel */}
        <motion.path
          d="M19 30C22 29 26 29 29 30L26 39C25.5 41 22.5 41 22 39L19 30Z"
          fill="currentColor"
          stroke="none"
          animate={{
            scaleX: [0.9, 1.08, 0.9],
          }}
          transition={createLoop(1)}
        />

        {/* Small wind streak */}
        <motion.path
          d="M9 35C13 33 17 33 20 35"
          strokeWidth="1.7"
          opacity="0.55"
          animate={{
            x: [-2, 3, -2],
            opacity: [0.25, 0.7, 0.25],
          }}
          transition={createLoop(1.3)}
        />
      </svg>
    </motion.div>
  );
}

function Tornado() {
  return (
    <Scene>
      <CloudOrb tone="storm" motionSpeed={3.5} />
      <TornadoIcon />
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */
/*                              WEATHER REGISTRY                              */
/* -------------------------------------------------------------------------- */

const weatherScenes = {
  Clear,
  Clouds,
  Rain,
  Drizzle,
  Thunderstorm,
  Snow,
  Mist,
  Fog,
  Smoke,
  Haze,
  Dust,
  Sand,
  Ash,
  Squall,
  Tornado,
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function WeatherIcon({ condition = "Clear" }) {
  const SceneComponent = weatherScenes[condition] ?? Clear;

  return (
    <div className="relative flex h-44 w-44 items-center justify-center sm:h-48 sm:w-48 md:h-52 md:w-52">
      <AnimatePresence mode="wait">
        <motion.div
          key={condition}
          initial={{
            opacity: 0,
            scale: 0.85,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0)",
          }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(6px)",
          }}
          transition={sceneTransition}
          className="absolute inset-0 flex items-center justify-center"
        >
          <SceneComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
