import { motion } from 'framer-motion';
import { LogOut, User, Shield, Clock, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-semibold text-white">Aurum</span>
          <span className="text-ink-600">|</span>
          <span className="text-gray-500 text-sm font-body">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
              <Shield size={14} /> Admin Panel
            </Link>
          )}
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm transition-colors">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </motion.header>

      {/* Welcome */}
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item} className="card-glass p-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
              <span className="font-display text-2xl font-bold text-gold-400">{initials}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Welcome back,</p>
              <h2 className="font-display text-2xl font-semibold text-white">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-500 text-sm mt-0.5 font-mono">@{user?.username}</p>
            </div>
          </div>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Account email', value: user?.email, icon: User },
            { label: 'Account role', value: user?.role === 'admin' ? '⭐ Admin' : 'Standard User', icon: Shield },
            { label: 'Status', value: user?.isVerified ? 'Verified' : 'Unverified', icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <motion.div key={label} variants={item} className="card-glass p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-gold-400" />
                <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
              </div>
              <p className="text-white text-sm font-medium break-all">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Member since */}
        <motion.div variants={item} className="card-glass p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Member since</p>
            <p className="text-white font-medium">{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <ChevronRight size={18} className="text-ink-600" />
        </motion.div>
      </motion.div>
    </div>
  );
}
