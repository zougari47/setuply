import { Terminal, Zap } from "lucide-react";

const flags = [
  {
    flag: "--all",
    description:
      "Installs and configures all available tools without interactive prompts.",
    icon: Zap,
  },
  {
    flag: "--husky",
    description: "Only installs and configures Husky.",
    icon: Terminal,
  },
  {
    flag: "--oxlint",
    description: "Only installs and configures Oxlint.",
    icon: Terminal,
  },
  {
    flag: "--oxfmt",
    description: "Only installs and configures Oxfmt.",
    icon: Terminal,
  },
  {
    flag: "--lint-staged",
    description: "Only installs and configures lint-staged.",
    icon: Terminal,
  },
  {
    flag: "--commitlint",
    description: "Only installs and configures commitlint.",
    icon: Terminal,
  },
];

export default function AdvancedOptions() {
  return (
    <section className="py-24 px-6 border-t border-brand-border" id="advanced">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 space-y-6 text-center sm:text-left">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Advanced Configuration
            </h2>
            <p className="text-brand-muted max-w-2xl">
              Pass flags to the CLI to skip the interactive prompt and tailor
              the installation exactly to your needs. You can also combine them
              to install multiple tools at once.
            </p>
          </div>
          <div className="p-3 sm:px-4 rounded-lg bg-brand-bg border border-brand-border inline-flex items-center gap-3">
            <code className="text-sm font-mono text-brand-text">
              <span className="text-brand-muted select-none">$</span> npx
              setuply --oxlint --husky --oxfmt
            </code>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flags.map((item) => (
            <div
              key={item.flag}
              className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl bg-brand-card border border-brand-border hover:border-brand-muted/30 transition-colors"
            >
              <div className="shrink-0 mt-1">
                <div className="p-2 rounded-lg bg-[#2a2a2a] inline-flex">
                  <item.icon size={16} className="text-brand-muted" />
                </div>
              </div>
              <div className="space-y-1">
                <code className="text-sm font-mono text-white bg-[#2a2a2a] px-2 py-0.5 rounded border border-[#3a3a3a]">
                  {item.flag}
                </code>
                <p className="text-sm text-brand-muted leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

