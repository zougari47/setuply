const steps = [
  {
    step: '01',
    title: 'Run the command',
    emoji: '⚡',
    description: 'Use your favorite package manager to run the Setuply CLI in your project root.'
  },
  {
    step: '02',
    title: 'Instant magic',
    emoji: '✨',
    description: 'Setuply automatically detects your project type and installs all necessary tools.'
  },
  {
    step: '03',
    title: 'Commit and fly',
    emoji: '🚀',
    description: 'Tools are configured, git hooks are ready. Your codebase is now bulletproof.'
  }
];

export default function Process() {
  return (
    <section className="py-24 px-6 border-t border-brand-border bg-[#050505]" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          <div className="md:w-1/3 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How it works</h2>
            <p className="text-brand-muted">The fastest way to professional-grade JS infrastructure.</p>
          </div>

          <div className="md:w-2/3 space-y-12">
            {steps.map((item, idx) => (
              <div
                key={item.step}
                className="flex gap-6 relative"
              >
                {idx !== steps.length - 1 && (
                  <div className="absolute left-[1.15rem] top-10 h-[calc(100%+1rem)] w-[1px] bg-brand-border/60"></div>
                )}

                <div className="relative z-10 shrink-0">
                  <span className="inline-flex items-center justify-center text-sm font-mono text-brand-muted bg-[#151515] border border-brand-border rounded-md px-2 py-1 relative">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">{item.title} <span>{item.emoji}</span></h3>
                  <p className="text-brand-muted pr-4">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}