import Terminal from './terminal';

const UnderlinedText = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block whitespace-nowrap">
    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#9F7AEA] to-[#5A2EE3]">
      {children}
    </span>
    <svg
      className="absolute -bottom-1.5 left-0 w-full h-3 opacity-80"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      fill="none"
      stroke="url(#accent-gradient)"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <defs>
        <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9F7AEA" />
          <stop offset="100%" stopColor="#5A2EE3" />
        </linearGradient>
      </defs>
      <path d="M 2,8 C 25,2 60,11 98,5" />
    </svg>
  </span>
);

export default function Hero() {
  return (
    <section className="pt-24 pb-16 px-6 relative overflow-hidden" id="hero">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none -z-10 blur-3xl rounded-full" />

      <div className="max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Set up your entire JS tooling <br className="hidden sm:block" />
            <span className="text-brand-muted">in</span> <UnderlinedText>one command</UnderlinedText>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-brand-muted leading-relaxed">
            Setuply installs and configures <span className="text-white font-medium">Oxlint</span>, <span className="text-white font-medium">Oxfmt</span>, <span className="text-white font-medium">Husky</span>, <span className="text-white font-medium">lint-staged</span>, and <span className="text-white font-medium">commitlint</span> instantly. No boilerplate, no tedious config files.
          </p>
        </div>

        <div>
          <Terminal />
        </div>
      </div>
    </section>
  );
}