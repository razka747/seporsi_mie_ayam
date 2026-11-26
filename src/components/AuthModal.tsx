import { Eye, EyeOff, LogIn, Shield, UserPlus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type FormEvent } from 'react';
import {
  loginUser,
  registerUser,
  type AuthUser,
} from '../utils/authLogic';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export function AuthModal({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const result =
      mode === 'login'
        ? loginUser(email, password)
        : registerUser(name, email, password);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setName('');
    setEmail('');
    setPassword('');
    onSuccess(result.user);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={mode === 'login' ? 'Masuk akun Blue Moon' : 'Registrasi akun Blue Moon'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#04070E]/90 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#243456] bg-[#0D1526] shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
          >
            <div className="flex items-center justify-between border-b border-[#1E2B48] px-5 py-4">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 rounded-full bg-[#7AB3FF] shadow-[0_0_10px_#7AB3FF]"
                />
                <span className="font-editorial text-xl font-semibold text-[#EEF3FC]">
                  Akun Blue Moon
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup jendela akun"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#243456] bg-[#131E36] text-[#EEF3FC] transition-colors hover:bg-[#1D2D4F]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {/* Mode switcher */}
              <div
                role="tablist"
                aria-label="Pilih masuk atau registrasi"
                className="grid grid-cols-2 gap-1.5 rounded-xl border border-[#1E2B48] bg-[#070B14] p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    mode === 'login'
                      ? 'bg-[#1D2D4F] text-[#EEF3FC]'
                      : 'text-[#94A3C8] hover:text-[#EEF3FC]'
                  }`}
                >
                  <LogIn className="h-3.5 w-3.5 text-[#7AB3FF]" aria-hidden="true" />
                  <span>Masuk</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    mode === 'register'
                      ? 'bg-[#1D2D4F] text-[#EEF3FC]'
                      : 'text-[#94A3C8] hover:text-[#EEF3FC]'
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5 text-[#7AB3FF]" aria-hidden="true" />
                  <span>Registrasi</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                {mode === 'register' && (
                  <div>
                    <label
                      htmlFor="auth-name"
                      className="block text-xs font-medium text-[#D6E4FF]"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Nadia Kirana"
                      autoComplete="name"
                      className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[#243456] bg-[#070B14] px-3.5 py-2 text-sm text-[#EEF3FC] placeholder:text-[#637499] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-xs font-medium text-[#D6E4FF]"
                  >
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[#243456] bg-[#070B14] px-3.5 py-2 text-sm text-[#EEF3FC] placeholder:text-[#637499] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="auth-password"
                    className="block text-xs font-medium text-[#D6E4FF]"
                  >
                    Password
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        mode === 'register'
                          ? 'Minimal 6 karakter'
                          : 'Masukkan password'
                      }
                      autoComplete={
                        mode === 'login' ? 'current-password' : 'new-password'
                      }
                      className="min-h-[42px] w-full rounded-lg border border-[#243456] bg-[#070B14] pr-11 pl-3.5 py-2 text-sm text-[#EEF3FC] placeholder:text-[#637499] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-[#94A3C8] hover:text-[#EEF3FC]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-[#F59E0B]/40 bg-[#1A1510] px-3 py-2 text-xs text-[#F5D3A1]"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#7AB3FF] px-5 py-2.5 text-sm font-semibold text-[#070B14] transition-colors hover:bg-[#9CC7FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7AB3FF]"
                >
                  {mode === 'login' ? (
                    <>
                      <LogIn className="h-4 w-4" aria-hidden="true" />
                      <span>Masuk Sekarang</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" aria-hidden="true" />
                      <span>Daftar Akun Baru</span>
                    </>
                  )}
                </button>

                <p className="flex items-center gap-1.5 text-[11px] text-[#94A3C8]">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-[#7AB3FF]" aria-hidden="true" />
                  <span>
                    {mode === 'login'
                      ? 'Admin dapat mengelola dan menghapus komentar pengunjung.'
                      : 'Akun baru otomatis terdaftar sebagai anggota komunitas Blue Moon.'}
                  </span>
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
