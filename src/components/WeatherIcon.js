"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  LuCloud,
  LuCloudFog,
  LuCloudRain,
  LuCloudy,
  LuSnowflake,
  LuSun,
  LuTornado,
  LuWind,
  LuZap,
} from "react-icons/lu";

const sceneTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};

const createLoop = (duration) => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut",
});

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

function Clear() {
  return (
    <Scene>
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={createLoop(3)}
        className="absolute h-24 w-24 rounded-full bg-amber-200/40 blur-2xl"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <LuSun className="size-20 text-amber-400" strokeWidth={1.4} />
      </motion.div>
    </Scene>
  );
}

function Clouds() {
  return (
    <Scene>
      <motion.div animate={{ x: [-5, 5, -5] }} transition={createLoop(4)}>
        <LuCloudy
          className="size-24 text-slate-400/80 drop-shadow-sm"
          strokeWidth={1.2}
        />
      </motion.div>

      <motion.div
        animate={{
          x: [5, -4, 5],
          y: [1, -2, 1],
        }}
        transition={createLoop(5)}
        className="absolute bottom-0 left-1"
      >
        <LuCloud className="size-12 text-sky-300" strokeWidth={1.4} />
      </motion.div>
    </Scene>
  );
}

function Rain({ drizzle = false }) {
  const dropCount = drizzle ? 5 : 7;
  const dropDuration = drizzle ? 1.5 : 1;
  const dropDelay = drizzle ? 0.16 : 0.1;

  return (
    <Scene>
      <motion.div animate={{ x: [-4, 4, -4] }} transition={createLoop(4)}>
        <LuCloudRain className="size-24 text-slate-400" strokeWidth={1.2} />
      </motion.div>

      <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: dropCount }, (_, index) => (
          <motion.span
            key={index}
            animate={{
              y: [0, 18],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: dropDuration,
              delay: index * dropDelay,
              repeat: Infinity,
              ease: "easeIn",
            }}
            className="h-3 w-1 rounded-full bg-sky-400/70"
          />
        ))}
      </div>
    </Scene>
  );
}

function Thunderstorm() {
  return (
    <Scene>
      <motion.div animate={{ x: [-4, 4, -4] }} transition={createLoop(3)}>
        <LuCloud className="size-24 text-slate-500" strokeWidth={1.2} />
      </motion.div>

      <motion.div
        animate={{
          opacity: [0, 1, 0, 1, 0],
          y: [0, 3, 0, 3, 0],
        }}
        transition={createLoop(2.5)}
        className="absolute bottom-1 left-1/2"
      >
        <LuZap
          className="size-12 text-amber-400"
          fill="currentColor"
          strokeWidth={1.2}
        />
      </motion.div>
    </Scene>
  );
}

function Snow() {
  return (
    <Scene>
      <motion.div
        animate={{
          rotate: 360,
          y: [0, -3, 0],
        }}
        transition={{
          rotate: {
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          },
          y: createLoop(3),
        }}
      >
        <LuSnowflake className="size-20 text-sky-300" strokeWidth={1.2} />
      </motion.div>

      {[0, 1, 2, 3, 4].map((index) => (
        <motion.span
          key={index}
          animate={{
            y: [0, 25],
            x: [0, index % 2 ? 5 : -5],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            delay: index * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute size-1.5 rounded-full bg-white shadow-sm"
          style={{
            left: `${25 + index * 12}%`,
            top: `${15 + (index % 2) * 10}%`,
          }}
        />
      ))}
    </Scene>
  );
}

function Fog() {
  const fogLines = [70, 58, 46];

  return (
    <Scene className="overflow-hidden">
      <motion.div
        animate={{ x: [-12, 12, -12] }}
        transition={createLoop(6)}
        className="absolute top-8"
      >
        <LuCloudFog className="size-20 text-slate-400/70" strokeWidth={1.1} />
      </motion.div>

      <div className="absolute bottom-5 flex flex-col gap-2">
        {fogLines.map((width, index) => (
          <motion.span
            key={width}
            animate={{
              x: index % 2 ? [10, -10, 10] : [-10, 10, -10],
              opacity: [0.2, 0.55, 0.2],
            }}
            transition={createLoop(5 + index)}
            className="h-1.5 rounded-full bg-slate-400/40 blur-[1px]"
            style={{ width }}
          />
        ))}
      </div>
    </Scene>
  );
}

function Haze() {
  const hazeLines = [72, 58, 44];

  return (
    <Scene>
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={createLoop(5)}
        className="absolute h-24 w-24 rounded-full bg-amber-200/50 blur-2xl"
      />

      <motion.div animate={{ scale: [1, 1.03, 1] }} transition={createLoop(4)}>
        <LuSun className="size-20 text-amber-300/70" strokeWidth={1.2} />
      </motion.div>

      <div className="absolute bottom-5 flex flex-col gap-2">
        {hazeLines.map((width, index) => (
          <motion.span
            key={width}
            animate={{
              x: [-16, 16, -16],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={createLoop(6 + index)}
            className="h-3 rounded-full bg-white/50 blur-lg"
            style={{ width }}
          />
        ))}
      </div>
    </Scene>
  );
}

function Smoke() {
  return (
    <Scene className="items-end overflow-hidden">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          animate={{
            y: [10, -45],
            x: [0, index % 2 ? 12 : -12],
            scale: [0.6, 1.4],
            opacity: [0, 0.35, 0],
          }}
          transition={{
            duration: 4,
            delay: index,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute bottom-4 h-10 w-10 rounded-full bg-slate-400/25 blur-xl"
        />
      ))}

      <motion.div
        animate={{
          y: [0, -3, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={createLoop(3)}
      >
        <LuCloud
          className="relative z-10 size-20 text-slate-400/40"
          strokeWidth={1}
        />
      </motion.div>
    </Scene>
  );
}

function Dust({ sand = false }) {
  const particleCount = sand ? 12 : 8;
  const particleColor = sand ? "bg-amber-500/60" : "bg-amber-400/50";

  return (
    <Scene className="overflow-hidden">
      <motion.div animate={{ x: [-6, 6, -6] }} transition={createLoop(3)}>
        <LuWind
          className={
            sand ? "size-20 text-amber-600/40" : "size-20 text-amber-500/40"
          }
          strokeWidth={1.1}
        />
      </motion.div>

      {Array.from({ length: particleCount }, (_, index) => (
        <motion.span
          key={index}
          animate={{
            x: [-50, 50],
            y: [0, index % 2 ? -8 : 8, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: sand ? 2 : 2.6,
            delay: index * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute left-1/2 size-1 rounded-full ${particleColor}`}
          style={{
            top: `${35 + (index % 4) * 9}%`,
          }}
        />
      ))}
    </Scene>
  );
}

function Sand() {
  return <Dust sand />;
}

function Ash() {
  return (
    <Scene className="overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={createLoop(4)}
        className="absolute h-20 w-20 rounded-full bg-slate-400/20 blur-2xl"
      />

      <LuCloud
        className="relative z-10 size-20 text-slate-500/50"
        strokeWidth={1}
      />

      {Array.from({ length: 8 }, (_, index) => (
        <motion.span
          key={index}
          animate={{
            y: [0, 40],
            x: [0, index % 2 ? 8 : -8],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3,
            delay: index * 0.3,
            repeat: Infinity,
            ease: "easeIn",
          }}
          className="absolute top-7 left-1/2 size-1.5 rounded-full bg-slate-500/50"
        />
      ))}
    </Scene>
  );
}

function Squall() {
  return (
    <Scene className="overflow-hidden">
      <motion.div animate={{ x: [-6, 6, -6] }} transition={createLoop(2.5)}>
        <LuCloud
          className="relative z-20 size-20 text-slate-500"
          strokeWidth={1.1}
        />
      </motion.div>

      {[0, 1, 2, 3].map((index) => (
        <motion.span
          key={index}
          animate={{
            x: [-55, 55],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 1.1,
            delay: index * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 h-1 rounded-full bg-sky-400/50"
          style={{
            top: `${48 + index * 10}%`,
            width: `${30 + (index % 2) * 15}px`,
          }}
        />
      ))}

      <motion.div
        animate={{
          x: [-20, 20, -20],
          opacity: [0, 1, 0],
        }}
        transition={createLoop(1.5)}
        className="absolute bottom-4 left-1/2"
      >
        <LuWind className="size-9 text-sky-400/70" strokeWidth={1.2} />
      </motion.div>
    </Scene>
  );
}

function Tornado() {
  const funnel = [
    { width: 88, top: 4, height: 7, duration: 2.8 },
    { width: 78, top: 16, height: 7, duration: 2.4 },
    { width: 67, top: 28, height: 6, duration: 2 },
    { width: 54, top: 40, height: 6, duration: 1.7 },
    { width: 40, top: 52, height: 5, duration: 1.4 },
    { width: 27, top: 64, height: 5, duration: 1.1 },
    { width: 12, top: 76, height: 4, duration: 0.9 },
  ];

  return (
    <Scene>
      <motion.div
        animate={{
          x: [-3, 3, -3],
          scaleX: [1, 1.04, 1],
        }}
        transition={createLoop(3)}
        className="absolute top-3 h-7 w-24 rounded-full bg-slate-500/35 blur-md"
      />

      <motion.div
        animate={{
          y: [0, -2, 0],
          rotate: [-1, 1, -1],
        }}
        transition={createLoop(2.5)}
        className="absolute top-8 h-24 w-24"
      >
        {funnel.map((ring, index) => (
          <motion.span
            key={index}
            animate={{
              x: [-4, 4, -4],
              scaleX: [1, 0.88, 1.05, 1],
            }}
            transition={{
              duration: ring.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.08,
            }}
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-slate-500/45 blur-[1.5px]"
            style={{
              top: ring.top,
              width: ring.width,
              height: ring.height,
            }}
          />
        ))}
      </motion.div>

      {[0, 1, 2, 3].map((index) => (
        <motion.span
          key={index}
          animate={{
            x: [
              index % 2 ? 10 : -10,
              index % 2 ? 24 : -24,
              index % 2 ? 10 : -10,
            ],
            y: [8, 18, 30],
            rotate: [0, 180, 360],
            opacity: [0, 0.45, 0],
          }}
          transition={{
            duration: 2.2,
            delay: index * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-16 left-1/2 size-1 rounded-full bg-slate-500/50"
        />
      ))}
    </Scene>
  );
}

const weatherScenes = {
  Clear,
  Clouds,
  Rain,
  Drizzle: () => <Rain drizzle />,
  Thunderstorm,
  Snow,
  Mist: Fog,
  Fog,
  Smoke,
  Haze,
  Dust,
  Sand,
  Ash,
  Squall,
  Tornado,
};

export default function WeatherIcon({ condition = "Clear" }) {
  const SceneComponent = weatherScenes[condition] ?? Clear;

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
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
