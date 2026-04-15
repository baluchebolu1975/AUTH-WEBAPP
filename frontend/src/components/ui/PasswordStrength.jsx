const checks = [
  { label: '8+ characters',        test: v => v.length >= 8 },
  { label: 'Uppercase letter',     test: v => /[A-Z]/.test(v) },
  { label: 'Lowercase letter',     test: v => /[a-z]/.test(v) },
  { label: 'Number',               test: v => /[0-9]/.test(v) },
  { label: 'Special character',    test: v => /[@$!%*?&#^()_\-+=]/.test(v) },
];

const levels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-gold-500'];

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score  = checks.filter(c => c.test(password)).length;
  const label  = levels[score];
  const color  = colors[score];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? color : 'bg-ink-700'}`} />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Strength: <span className={`font-medium ${score >= 4 ? 'text-gold-400' : score >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>{label}</span>
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {checks.map(c => (
          <p key={c.label} className={`text-xs flex items-center gap-1 ${c.test(password) ? 'text-emerald-400' : 'text-gray-600'}`}>
            <span>{c.test(password) ? '✓' : '○'}</span> {c.label}
          </p>
        ))}
      </div>
    </div>
  );
}
