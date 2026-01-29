"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleGenerate() {
    if (!username) return;
    router.push(`/${username}`);
  }

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(0, 0, 0)"
      gradientBackgroundEnd="rgb(0, 0, 0)"
      firstColor="34, 197, 94"
      secondColor="16, 185, 129"
      thirdColor="74, 222, 128"
      fourthColor="22, 163, 74"
      fifthColor="134, 239, 172"
      pointerColor="34, 197, 94"
      blendingValue="hard-light"
      interactive
    >
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 text-center px-6">
          <div className="flex justify-center mb-6">
            <Github
              size={48}
              className="text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.8)]"
            />
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            GitHub <span className="text-green-400">Wrapped</span>
          </h1>

          <p className="text-gray-400 mb-10">
            Your year on GitHub, visualized.
          </p>

          <div className="flex gap-3 justify-center">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="github username"
              className="px-4 py-3 w-64 rounded-lg bg-zinc-900 text-white border border-zinc-800 focus:outline-none focus:border-green-400"
            />
            <button
              onClick={handleGenerate}
              className="px-6 py-3 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
            >
              Generate
            </button>
          </div>
        </div>
      </main>
    </BackgroundGradientAnimation>
  );
}
