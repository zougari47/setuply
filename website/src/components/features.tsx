import { Shield, Zap, Code, GitCommit, GitBranch } from 'lucide-react';

const tools = [
  {
    name: 'Oxlint',
    description: 'Ultra-fast linter written in Rust, 50-100x faster than ESLint.',
    icon: Shield,
    color: 'text-blue-400',
  },
  {
    name: 'Oxfmt',
    description: 'Blazing fast formatter to keep your code consistent across the team.',
    icon: Zap,
    color: 'text-yellow-400',
  },
  {
    name: 'Husky',
    description: 'Modern native git hooks made easy. Automatically run scripts before committing.',
    icon: GitBranch,
    color: 'text-purple-400',
  },
  {
    name: 'lint-staged',
    description: 'Run linters against staged git files and don\'t let slip into your code.',
    icon: Code,
    color: 'text-green-400',
  },
  {
    name: 'commitlint',
    description: 'Helps your team adhering to a commit convention for readable history.',
    icon: GitCommit,
    color: 'text-red-400',
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 border-t border-brand-border" id="features">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Batteries included</h2>
          <p className="text-brand-muted">Everything you need for a production-ready codebase.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="p-6 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-muted/30 transition-colors group"
            >
              <div className={`p-2 rounded-lg bg-brand-bg w-fit mb-4 ${tool.color}`}>
                <tool.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}