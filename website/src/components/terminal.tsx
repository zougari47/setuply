import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const commands: Record<PackageManager, string> = {
  npm: "npx setuply",
  pnpm: "pnpm dlx setuply",
  yarn: "yarn dlx setuply",
  bun: "bunx setuply",
};

const TERMINAL_TIMESTEPS = {
  step1Logo: 800,
  step2Options: 800,
  step3Detect: 1200,
  step4AnswerYes: 1000,
  step5Install: 500,
  step6Success: 2500,
};

const Spinner = () => {
  const [frame, setFrame] = useState(0);
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  useEffect(() => {
    const i = setInterval(() => setFrame((f) => (f + 1) % frames.length), 80);
    return () => clearInterval(i);
  }, []);
  return <span className="text-yellow-400 mr-2">{frames[frame]}</span>;
};

export default function Terminal() {
  const [activeTab, setActiveTab] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      await sleep(TERMINAL_TIMESTEPS.step1Logo);
      if (!isMounted) return;
      setAnimationStep(1);
      await sleep(TERMINAL_TIMESTEPS.step2Options);
      if (!isMounted) return;
      setAnimationStep(2);
      await sleep(TERMINAL_TIMESTEPS.step3Detect);
      if (!isMounted) return;
      setAnimationStep(3);
      await sleep(TERMINAL_TIMESTEPS.step4AnswerYes);
      if (!isMounted) return;
      setAnimationStep(4);
      await sleep(TERMINAL_TIMESTEPS.step5Install);
      if (!isMounted) return;
      setAnimationStep(5);
      await sleep(TERMINAL_TIMESTEPS.step6Success);
      if (!isMounted) return;
      setAnimationStep(6);
    };

    runSequence();
    return () => {
      isMounted = false;
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(commands[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-brand-border bg-brand-card terminal-shadow text-left"
      id="terminal-window"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-brand-border">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(["npm", "pnpm", "yarn", "bun"] as const).map((pm) => (
            <button
              key={pm}
              onClick={() => setActiveTab(pm)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                activeTab === pm
                  ? "bg-brand-border text-brand-text"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
        <div className="hidden sm:flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3d3d3d]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3d3d3d]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3d3d3d]" />
        </div>
      </div>

      <div className="p-4 sm:p-6 font-mono text-sm sm:text-base min-h-115 relative">
        <div className="flex items-start gap-3">
          <span className="text-brand-muted select-none">$</span>
          <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
            <span className="text-brand-text break-all">
              {commands[activeTab]}
            </span>

            {animationStep >= 1 && (
              <div className="animate-fade-in">
                <pre className="text-brand-muted/80 text-[6px] min-[400px]:text-[8px] sm:text-xs mt-4 mb-4 leading-tight font-mono select-none">
                  {`
███████╗███████╗████████╗██╗   ██╗██████╗ ██╗     ██╗   ██╗
██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║     ╚██╗ ██╔╝
███████╗█████╗     ██║   ██║   ██║██████╔╝██║      ╚████╔╝ 
╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ ██║       ╚██╔╝  
███████║███████╗   ██║   ╚██████╔╝██║     ███████╗   ██║   
╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚══════╝   ╚═╝   
                  `}
                </pre>
              </div>
            )}

            {animationStep >= 2 && (
              <div className="mb-4 text-xs sm:text-sm space-y-1 animate-fade-in">
                <p className="text-white font-medium mb-3">
                  ?{" "}
                  <span className="text-brand-text">
                    What would you like to set up?
                  </span>
                </p>
                <p className="text-brand-text">
                  {" "}
                  <span className="text-green-500 mr-2 text-lg leading-none align-middle">
                    ◉
                  </span>{" "}
                  Oxlint
                </p>
                <p className="text-brand-text">
                  {" "}
                  <span className="text-green-500 mr-2 text-lg leading-none align-middle">
                    ◉
                  </span>{" "}
                  Oxfmt
                </p>
                <p className="text-brand-text">
                  {" "}
                  <span className="text-green-500 mr-2 text-lg leading-none align-middle">
                    ◉
                  </span>{" "}
                  Husky
                </p>
                <p className="text-brand-text">
                  {" "}
                  <span className="text-green-500 mr-2 text-lg leading-none align-middle">
                    ◉
                  </span>{" "}
                  lint-staged
                </p>
                <p className="text-brand-text">
                  {" "}
                  <span className="text-green-500 mr-2 text-lg leading-none align-middle">
                    ◉
                  </span>{" "}
                  commitlint
                </p>
              </div>
            )}

            {animationStep >= 3 && (
              <div className="mb-4 text-xs sm:text-sm animate-fade-in">
                <p className="text-white font-medium">
                  <span className="text-brand-text">
                    We detected you're using React, Tailwind. Proceed?
                  </span>{" "}
                  <span className="text-brand-muted font-normal">[Y/n]</span>{" "}
                  {animationStep >= 4 && (
                    <span className="text-white font-normal ml-1">Y</span>
                  )}
                </p>
                {animationStep === 3 && (
                  <span className="inline-block w-2 h-3 bg-brand-text align-middle ml-1 animate-cursor-blink" />
                )}
              </div>
            )}

            {animationStep >= 5 && (
              <div className="text-xs sm:text-sm space-y-1 animate-fade-in">
                {animationStep === 5 ? (
                  <p className="text-brand-muted">
                    <Spinner /> Installing dependencies...
                  </p>
                ) : (
                  <>
                    <p className="text-brand-text">
                      <span className="text-green-400 mr-2">✓</span> Installed
                      dependencies
                    </p>
                    <p className="text-white font-medium mt-1">
                      <span className="text-green-400 mr-2">✓</span> Tools
                      configured successfully.
                    </p>
                    <p className="mt-3 text-brand-muted">Ready to fly! 🚀</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-all group border border-brand-border/50"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-brand-muted group-hover:text-brand-text" />
          )}
        </button>
      </div>
    </div>
  );
}
