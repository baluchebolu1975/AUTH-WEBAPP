import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import PasswordStrength from '../components/ui/PasswordStrength.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const schema = z.object({
  firstName:       z.string().min(2, 'Min 2 characters').max(50).regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters'),
  lastName:        z.string().min(2, 'Min 2 characters').max(50).regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters'),
  username:        z.string().min(3, 'Min 3 characters').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and _ only'),
  email:           z.string().email('Valid email required'),
  password:        z.string().min(8, 'Min 8 characters')
                    .regex(/[A-Z]/, 'Must include uppercase')
                    .regex(/[a-z]/, 'Must include lowercase')
                    .regex(/[0-9]/, 'Must include number')
                    .regex(/[@$!%*?&#^()_\-+=]/, 'Must include special character'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const Field = ({ label, error, children }) => (
  <div>
    <label className="label">{label}</label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="error-msg">
          <AlertCircle size={12} /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default function SignupPage() {
  const { signup }              = useAuth();
  const navigate                = useNavigate();
  const [showPwd, setShowPwd]   = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);
  const [loading, setLoading]   = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data);
      toast.success('Welcome! Account created.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      const errs = err.response?.data?.errors;
      if (errs?.length) errs.forEach(e => toast.error(e.message));
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Join Aurum — it takes 30 seconds">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" error={errors.firstName?.message}>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input {...register('firstName')} placeholder="Jane" className={`input-field pl-9 ${errors.firstName ? 'error' : ''}`} />
            </div>
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <input {...register('lastName')} placeholder="Doe" className={`input-field ${errors.lastName ? 'error' : ''}`} />
          </Field>
        </div>

        <Field label="Username" error={errors.username?.message}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm font-mono">@</span>
            <input {...register('username')} placeholder="janedoe" className={`input-field pl-8 ${errors.username ? 'error' : ''}`} />
          </div>
        </Field>

        <Field label="Email address" error={errors.email?.message}>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input {...register('email')} type="email" placeholder="jane@example.com" className={`input-field pl-9 ${errors.email ? 'error' : ''}`} />
          </div>
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input {...register('password')} type={showPwd ? 'text' : 'password'} placeholder="Create a strong password" className={`input-field pl-9 pr-10 ${errors.password ? 'error' : ''}`} />
            <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input {...register('confirmPassword')} type={showCpwd ? 'text' : 'password'} placeholder="Repeat your password" className={`input-field pl-9 pr-10 ${errors.confirmPassword ? 'error' : ''}`} />
            <button type="button" onClick={() => setShowCpwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              {showCpwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="btn-primary mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
              Creating account…
            </span>
          ) : 'Create account'}
        </motion.button>

        <p className="text-center text-sm text-gray-500 pt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
