import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-ink-700/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-ink-700/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink-800 border border-ink-700 mb-4 relative">
            <span className="font-display text-2xl font-bold text-gold-400">A</span>
            <div className="absolute inset-0 rounded-2xl bg-gold-500/10 animate-pulse-gold" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm mt-1 font-body">{subtitle}</p>}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card-glass p-8 shadow-2xl shadow-black/50"
        >
          {children}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6 font-body">
          © 2026 Aurum · Secured with JWT & bcrypt
        </p>
      </motion.div>
    </div>
  );
}
