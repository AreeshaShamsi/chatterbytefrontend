import React, { useEffect, useState } from "react";

const StatCard = ({ target, label, color = "#00FFFF" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    const duration = 1500;
    const stepTime = 10;
    const steps = duration / stepTime;
    const increment = Math.ceil(end / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="bg-[#111827] border border-cyan-500 rounded-xl p-6 w-[240px] md:w-[280px] text-center shadow-[0_0_20px_#00ffff50] hover:scale-105 transition-all duration-300">
      <h3 className="text-4xl font-extrabold text-cyan-300 glow-text">
        {count.toLocaleString()}
      </h3>
      <p className="text-sm text-gray-400 mt-2 tracking-wider uppercase">{label}</p>
    </div>
  );
};

const LiveBugStats = () => {
  return (
    <section className="bg-[#0d1117] py-20 px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 tracking-wide neon-title">
        ⚡ Live Bug Stats
      </h2>
      <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
        <StatCard target={2358} label="Total Mails Fed" />
        <StatCard target={412} label="Users Connected" />
        <StatCard target={178} label="Glow-Ups Triggered" />
      </div>
    </section>
  );
};

export default LiveBugStats;
