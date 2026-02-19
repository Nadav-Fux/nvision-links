import { useState, useRef } from 'react';
import { Lock, Loader2, AlertCircle, EyeOff, Eye, ShieldCheck, ArrowRight } from 'lucide-react';
import { verifyPassword, setAdminPassword } from '@/lib/adminApi';

interface AdminLoginProps {
  onSuccess: () => void;
}

type LoginStep = 'password' | 'totp';

export const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<LoginStep>('password');
  const totpInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const result = await verifyPassword(password);

      if (result.totp_required) {
        // Password correct, TOTP needed
        setStep('totp');
        setTimeout(() => totpInputRef.current?.focus(), 100);
      } else if (result.success) {
        await setAdminPassword(password);
        onSuccess();
      } else {
        setError('סיסמה שגויה');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg === 'TOO_MANY_ATTEMPTS') {
        setError('יותר מדי ניסיונות — נסו שוב בעוד 5 דקות');
      } else if (errMsg === 'TIMEOUT') {
        setError('השרת לא הגיב בזמן — נסו שוב');
      } else {
        setError('שגיאה בחיבור לשרת — בדקו את החיבור לאינטרנט ונסו שוב');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) return;
    setLoading(true);
    setError('');

    try {
      const result = await verifyPassword(password, totpCode);

      if (result.success) {
        await setAdminPassword(password);
        onSuccess();
      } else {
        setError('קוד אימות שגוי — ודאו שהשעון בטלפון מסונכרן');
        setTotpCode('');
        totpInputRef.current?.focus();
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg === 'TOO_MANY_ATTEMPTS') {
        setError('יותר מדי ניסיונות — נסו שוב בעוד 5 דקות');
      } else if (errMsg === 'TIMEOUT') {
        setError('השרת לא הגיב — נסו שוב');
      } else {
        setError('שגיאה בחיבור לשרת — בדקו חיבור אינטרנט ונסו שוב');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTotpInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setTotpCode(digits);
  };

  return (
    <div data-ev-id="ev_e7a6e52237" className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)' }}>

      {/* ===== STEP 1: Password ===== */}
      {step === 'password' &&
      <form data-ev-id="ev_8e1ec2a464" onSubmit={handlePasswordSubmit} className="w-full max-w-sm" dir="rtl" aria-label="טופס כניסה">
          <div data-ev-id="ev_a923d331d9" className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8">
            <div data-ev-id="ev_856ea0b736" className="flex flex-col items-center gap-3 mb-6">
              <div data-ev-id="ev_675b689cf5" className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
              <h1 data-ev-id="ev_c4d7750312" className="text-xl font-bold text-white">ניהול האתר</h1>
              <p data-ev-id="ev_e6bc5d3dfc" className="text-white/40 text-sm">הזינו סיסמת אדמין כדי להמשיך</p>
            </div>

            <div data-ev-id="ev_4a7f09bc33" className="space-y-4">
              <div data-ev-id="ev_fdb4caee1d">
                <label data-ev-id="ev_de0afa7dac" htmlFor="admin-password" className="sr-only">סיסמה</label>
                <div data-ev-id="ev_ee9e610976" className="relative">
                  <input data-ev-id="ev_54b2b4fa09"
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="סיסמה"
                autoFocus
                autoComplete="current-password"
                aria-describedby={error ? 'login-error' : undefined}
                aria-invalid={!!error}
                className={`w-full px-4 py-3 pl-11 bg-white/[0.06] border rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 text-sm transition-colors ${
                error ? 'border-red-400/30' : 'border-white/[0.1]'}`} />

                  <button data-ev-id="ev_e429860738"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div data-ev-id="ev_876da82afb" aria-live="assertive" aria-atomic="true">
                {error &&
              <div data-ev-id="ev_58b62b4768" id="login-error" role="alert" className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    {error}
                  </div>
              }
              </div>

              <button data-ev-id="ev_7b95c4ac25"
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">

                {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                כניסה
              </button>
            </div>
          </div>

          <p data-ev-id="ev_9b2bfafb78" className="text-center text-white/15 text-[10px] mt-4">
            nVision Digital AI · Admin Panel
          </p>
        </form>
      }

      {/* ===== STEP 2: TOTP Code ===== */}
      {step === 'totp' &&
      <form data-ev-id="ev_5648439226" onSubmit={handleTotpSubmit} className="w-full max-w-sm" dir="rtl" aria-label="אימות דו-שלבי">
          <div data-ev-id="ev_f6b6835efc" className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8">
            <div data-ev-id="ev_7e871e9df1" className="flex flex-col items-center gap-3 mb-6">
              <div data-ev-id="ev_a2108d3d93" className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-green-400" aria-hidden="true" />
              </div>
              <h1 data-ev-id="ev_e9ef1393cf" className="text-xl font-bold text-white">אימות דו-שלבי</h1>
              <p data-ev-id="ev_e67d35db2a" className="text-white/40 text-sm text-center">
                הזינו את הקוד בן 6 הספרות מ-Google Authenticator
              </p>
            </div>

            <div data-ev-id="ev_53f764f1ea" className="space-y-4">
              <div data-ev-id="ev_7bd5ef90aa" className="flex justify-center">
                <input data-ev-id="ev_63101ea35e"
              ref={totpInputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={totpCode}
              onChange={(e) => handleTotpInput(e.target.value)}
              placeholder="000000"
              autoComplete="one-time-code"
              aria-label="קוד אימות"
              aria-describedby={error ? 'totp-error' : undefined}
              aria-invalid={!!error}
              className={`w-48 px-4 py-3 bg-white/[0.06] border rounded-xl text-white text-center text-2xl font-mono tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 ${
              error ? 'border-red-400/30' : 'border-white/[0.12]'}`} />

              </div>

              <div data-ev-id="ev_bd3eb46be9" aria-live="assertive" aria-atomic="true">
                {error &&
              <div data-ev-id="ev_601cba884f" id="totp-error" role="alert" className="flex items-center justify-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    {error}
                  </div>
              }
              </div>

              <button data-ev-id="ev_3f2b139c92"
            type="submit"
            disabled={loading || totpCode.length !== 6}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">

                {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                אימות וכניסה
              </button>

              <button data-ev-id="ev_10c40ed18f"
            type="button"
            onClick={() => {setStep('password');setTotpCode('');setError('');}}
            className="w-full py-2 text-white/30 text-xs hover:text-white/50 transition-colors flex items-center justify-center gap-1">

                <ArrowRight className="w-3 h-3" />
                חזרה לסיסמה
              </button>

              <p data-ev-id="ev_a4f7547e16" className="text-center text-white/20 text-[10px]">
                ניתן גם להשתמש בקוד גיבוי חד-פעמי
              </p>
            </div>
          </div>

          <p data-ev-id="ev_b7ddb40d5b" className="text-center text-white/15 text-[10px] mt-4">
            nVision Digital AI · Admin Panel
          </p>
        </form>
      }
    </div>);

};