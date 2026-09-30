"use client";

import { motion, AnimatePresence } from "motion/react";

const backgrounds = {
  Clear:
    "bg-[#dff4ff] bg-[radial-gradient(circle_at_50%_0%,#fff_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#bae6fd_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#c7d2fe_0%,transparent_40%),linear-gradient(180deg,#b9e7ff_0%,#dff5ff_45%,#f0f9ff_100%)]",

  Clouds:
    "bg-[#e8f1f5] bg-[radial-gradient(circle_at_50%_0%,#fff_0%,transparent_35%),radial-gradient(circle_at_15%_30%,#cbd5e1_0%,transparent_40%),radial-gradient(circle_at_85%_40%,#dbeafe_0%,transparent_40%),linear-gradient(180deg,#cbd5e1_0%,#e2e8f0_50%,#f1f5f9_100%)]",

  Rain: "bg-[#dbeafe] bg-[radial-gradient(circle_at_50%_0%,#e0f2fe_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#93c5fd_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#a5b4fc_0%,transparent_40%),linear-gradient(180deg,#93c5fd_0%,#bfdbfe_50%,#e0f2fe_100%)]",

  Drizzle:
    "bg-[#e8f4fa] bg-[radial-gradient(circle_at_50%_0%,#f0f9ff_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#bae6fd_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#c7d2fe_0%,transparent_40%),linear-gradient(180deg,#bae6fd_0%,#dbeafe_50%,#eff6ff_100%)]",

  Thunderstorm:
    "bg-[#dbe4f0] bg-[radial-gradient(circle_at_50%_0%,#e2e8f0_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#94a3b8_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#a5b4fc_0%,transparent_40%),linear-gradient(180deg,#94a3b8_0%,#cbd5e1_50%,#e2e8f0_100%)]",

  Snow: "bg-[#effaff] bg-[radial-gradient(circle_at_50%_0%,#fff_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#bae6fd_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#e0e7ff_0%,transparent_40%),linear-gradient(180deg,#dff6ff_0%,#effaff_50%,#f8fafc_100%)]",

  Mist: "bg-[#edf2f4] bg-[radial-gradient(circle_at_50%_0%,#fff_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#d1d5db_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#cbd5e1_0%,transparent_40%),linear-gradient(180deg,#d1d5db_0%,#e5e7eb_50%,#f3f4f6_100%)]",

  Smoke:
    "bg-[#e5e7eb] bg-[radial-gradient(circle_at_50%_0%,#f8fafc_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#9ca3af_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#cbd5e1_0%,transparent_40%),linear-gradient(180deg,#9ca3af_0%,#d1d5db_50%,#f3f4f6_100%)]",

  Haze: "bg-[#f1f5f9] bg-[radial-gradient(circle_at_50%_0%,#fff_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#cbd5e1_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#fde68a_0%,transparent_40%),linear-gradient(180deg,#dbeafe_0%,#e5e7eb_50%,#f8fafc_100%)]",

  Dust: "bg-[#f5efe6] bg-[radial-gradient(circle_at_50%_0%,#fff7ed_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#d6b98c_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#fde68a_0%,transparent_40%),linear-gradient(180deg,#e7d3b0_0%,#f3e8d0_50%,#fafaf9_100%)]",

  Fog: "bg-[#edf2f4] bg-[radial-gradient(circle_at_50%_0%,#fff_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#d1d5db_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#cbd5e1_0%,transparent_40%),linear-gradient(180deg,#d1d5db_0%,#e5e7eb_50%,#f3f4f6_100%)]",

  Sand: "bg-[#f5efe6] bg-[radial-gradient(circle_at_50%_0%,#fff7ed_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#d6b98c_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#facc15_0%,transparent_40%),linear-gradient(180deg,#e7d3b0_0%,#f3e8d0_50%,#fafaf9_100%)]",

  Ash: "bg-[#e5e7eb] bg-[radial-gradient(circle_at_50%_0%,#f8fafc_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#9ca3af_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#94a3b8_0%,transparent_40%),linear-gradient(180deg,#94a3b8_0%,#d1d5db_50%,#f3f4f6_100%)]",

  Squall:
    "bg-[#dbeafe] bg-[radial-gradient(circle_at_50%_0%,#e0f2fe_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#60a5fa_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#818cf8_0%,transparent_40%),linear-gradient(180deg,#60a5fa_0%,#bfdbfe_50%,#e0f2fe_100%)]",

  Tornado:
    "bg-[#d1d5db] bg-[radial-gradient(circle_at_50%_0%,#e5e7eb_0%,transparent_35%),radial-gradient(circle_at_10%_30%,#6b7280_0%,transparent_40%),radial-gradient(circle_at_90%_40%,#64748b_0%,transparent_40%),linear-gradient(180deg,#6b7280_0%,#cbd5e1_50%,#e5e7eb_100%)]",
};

export default function Background({ condition = "Clear" }) {
  const background = backgrounds[condition] ?? backgrounds.Clear;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={condition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
          className={`absolute inset-0 ${background}`}
        />
      </AnimatePresence>

      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-yellow-100/50 blur-3xl" />

      <div className="absolute top-1/4 -left-40 h-80 w-80 rounded-full bg-white/50 blur-3xl" />
    </div>
  );
}
