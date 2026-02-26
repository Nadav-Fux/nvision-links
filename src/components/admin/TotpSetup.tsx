import { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, ShieldCheck, ShieldOff, Smartphone, Copy, Check, Loader2, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import QRCode from 'qrcode';
import { getAdminPassword } from '@/lib/adminApi';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * TotpSetup — Admin 2FA management panel
 * 
 * Flow:
 * 1. Check current TOTP status
 * 2. If not active → show setup wizard (generate QR → scan with phones → verify code → show backup codes)
 * 3. If active → show status + disable option
 */

interface TotpStatus {
  is_active: boolean;
  created_at: string | null;
  backup_codes_remaining: number;
}

async function callTotpAction(action: string, data?: Record<string, unknown>) {
  const passwordHash = getAdminPassword();
  if (!passwordHash || !supabase) throw new Error('Not authenticated');

  const url = `${SUPABASE_URL}/functions/v1/admin-api`;
  const anonKey = SUPABASE_ANON_KEY;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
      'x-admin-password': passwordHash
    },
    body: JSON.stringify({ action, data })
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

type SetupStep = 'idle' | 'qr' | 'verify' | 'backup' | 'done';

export const TotpSetup = () => {
  const [status, setStatus] = useState<TotpStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<SetupStep>('idle');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [uri, setUri] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [showDisable, setShowDisable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Fetch current TOTP status
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await callTotpAction('totp_status');
      setStatus(res);
    } catch {
      setStatus({ is_active: false, created_at: null, backup_codes_remaining: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {fetchStatus();}, [fetchStatus]);

  // Start setup — generate secret & QR
  const startSetup = async () => {
    setError('');
    setActionLoading(true);
    try {
      const res = await callTotpAction('totp_setup');
      setSecret(res.secret);
      setUri(res.uri);

      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(res.uri, {
        width: 280,
        margin: 2,
        color: { dark: '#ffffff', light: '#0a0a14' },
        errorCorrectionLevel: 'M'
      });
      setQrDataUrl(dataUrl);
      setStep('qr');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  };

  // Verify code and activate
  const activateTotp = async () => {
    if (verifyCode.length !== 6) {
      setError('הקוד צריך להיות 6 ספרות');
      return;
    }
    setError('');
    setActionLoading(true);
    try {
      const res = await callTotpAction('totp_activate', { code: verifyCode });
      setBackupCodes(res.backup_codes);
      setStep('backup');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  };

  // Disable TOTP
  const disableTotp = async () => {
    if (disableCode.length !== 6) {
      setError('הקוד צריך להיות 6 ספרות');
      return;
    }
    setError('');
    setActionLoading(true);
    try {
      await callTotpAction('totp_disable', { code: disableCode });
      setStatus({ is_active: false, created_at: null, backup_codes_remaining: 0 });
      setShowDisable(false);
      setDisableCode('');
      setStep('idle');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  };

  // Copy backup codes
  const copyBackupCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {/* clipboard not available */}
  };

  // Handle code input — auto-advance on 6 digits
  const handleCodeInput = (value: string, setter: (v: string) => void) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setter(digits);
  };

  if (loading) {
    return (
      <div data-ev-id="ev_d0dabb5e9b" className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>);

  }

  // ==================== ACTIVE STATE ====================
  if (status?.is_active && step === 'idle') {
    return (
      <div data-ev-id="ev_c35d735d33" dir="rtl" className="space-y-4">
        <div data-ev-id="ev_b4ffe8081d" className="flex items-center gap-3 p-4 rounded-xl bg-green-500/[0.06] border border-green-500/20">
          <ShieldCheck className="w-6 h-6 text-green-400 flex-shrink-0" />
          <div data-ev-id="ev_af52dc4984">
            <p data-ev-id="ev_578b965419" className="text-green-300 font-semibold text-sm">אימות דו-שלבי פעיל</p>
            <p data-ev-id="ev_a2229c35dd" className="text-white/60 text-xs mt-0.5">
              {status.backup_codes_remaining} קודי גיבוי נותרו
            </p>
          </div>
        </div>

        {!showDisable ?
        <button data-ev-id="ev_1ae6913332"
        onClick={() => {setShowDisable(true);setError('');}}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400/70 border border-red-400/15 hover:border-red-400/30 hover:text-red-400 text-xs transition-colors">

            <ShieldOff className="w-3.5 h-3.5" />
            ביטול אימות דו-שלבי
          </button> :

        <div data-ev-id="ev_a5678dad36" className="p-4 rounded-xl bg-red-500/[0.04] border border-red-500/15 space-y-3">
            <p data-ev-id="ev_559f6cfcd9" className="text-white/60 text-sm">הזינו קוד מ-Google Authenticator לאישור:</p>
            <div data-ev-id="ev_fa197b9c4c" className="flex items-center gap-2">
              <input data-ev-id="ev_4e2e864411"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={disableCode}
            onChange={(e) => handleCodeInput(e.target.value, setDisableCode)}
            placeholder="000000"
            className="w-32 px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-center text-lg font-mono tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-red-400/50" />

              <button data-ev-id="ev_5043cec4a6"
            onClick={disableTotp}
            disabled={actionLoading || disableCode.length !== 6}
            className="px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-colors disabled:opacity-50">

                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ביטול'}
              </button>
              <button data-ev-id="ev_2980769e49"
            onClick={() => {setShowDisable(false);setError('');setDisableCode('');}}
            className="px-3 py-2 text-white/60 text-sm hover:text-white/60 transition-colors">

                ביטול
              </button>
            </div>
            {error &&
          <p data-ev-id="ev_260addec43" className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
          }
          </div>
        }
      </div>);

  }

  // ==================== SETUP WIZARD ====================
  return (
    <div data-ev-id="ev_f76a9f9a24" dir="rtl" className="space-y-5">
      {/* Step: Idle — start setup */}
      {step === 'idle' &&
      <div data-ev-id="ev_06cd69170a" className="space-y-4">
          <div data-ev-id="ev_8c623ebf3f" className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/[0.06] border border-yellow-500/15">
            <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div data-ev-id="ev_2b36101718">
              <p data-ev-id="ev_b67dd98a0d" className="text-yellow-300 font-semibold text-sm">אימות דו-שלבי לא פעיל</p>
              <p data-ev-id="ev_e13b6f79b5" className="text-white/60 text-xs mt-0.5">
                הוסיפו שכבת אבטחה נוספת עם Google Authenticator
              </p>
            </div>
          </div>

          <button data-ev-id="ev_846d6830de"
        onClick={startSetup}
        disabled={actionLoading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/25 transition-colors disabled:opacity-50">

            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
            התחלת הגדרה
          </button>
        </div>
      }

      {/* Step: QR Code — scan with both phones */}
      {step === 'qr' &&
      <div data-ev-id="ev_b84c0cd8b5" className="space-y-5">
          <div data-ev-id="ev_f6335f226e" className="p-4 rounded-xl bg-primary/[0.04] border border-primary/15">
            <h3 data-ev-id="ev_369b3e823f" className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              שלב 1: סריקת QR
            </h3>
            <p data-ev-id="ev_d1bb3b61fc" className="text-white/60 text-xs leading-relaxed">
              פתחו את <span data-ev-id="ev_4bb1efa0e5" className="text-primary font-medium">Google Authenticator</span> על
              <span data-ev-id="ev_e1e61d49c1" className="text-white/80 font-medium"> שני הטלפונים</span> וסרקו את הקוד הזה.
              <br data-ev-id="ev_7d2962fc6f" />
              <span data-ev-id="ev_c2b2635254" className="text-yellow-400/80">חשוב: סרקו עם שני המכשירים לפני שממשיכים!</span>
            </p>
          </div>

          {/* QR Code */}
          <div data-ev-id="ev_d0441c7d46" className="flex justify-center">
            <div data-ev-id="ev_e1ff165934" className="p-3 rounded-2xl bg-[#0a0a14] border border-white/[0.08]">
              {qrDataUrl &&
            <img data-ev-id="ev_d0da5f2901"
            src={qrDataUrl}
            alt="סרקו QR code עם Google Authenticator"
            width={280}
            height={280}
            className="rounded-xl" />

            }
            </div>
          </div>

          {/* Manual secret */}
          <div data-ev-id="ev_6e26c41b1c" className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p data-ev-id="ev_4c90085429" className="text-white/60 text-xs mb-1.5">לא מצליחים לסרוק? הזינו ידנית:</p>
            <div data-ev-id="ev_4da073e2d9" className="flex items-center gap-2">
              <code data-ev-id="ev_db67fee45d" className="flex-1 px-3 py-1.5 bg-white/[0.05] rounded-lg text-xs font-mono text-primary/80 break-all">
                {showSecret ? secret : '•'.repeat(secret.length)}
              </code>
              <button data-ev-id="ev_7e3710d80e"
            onClick={() => setShowSecret(!showSecret)}
            className="p-1.5 rounded-lg text-white/60 hover:text-white/60 transition-colors"
            aria-label={showSecret ? 'הסתר מפתח' : 'הצג מפתח'}>

                {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button data-ev-id="ev_e701894e15"
            onClick={async () => {
              await navigator.clipboard.writeText(secret);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="p-1.5 rounded-lg text-white/60 hover:text-white/60 transition-colors"
            aria-label="העתק מפתח">

                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button data-ev-id="ev_6fee4799de"
        onClick={() => {
          setStep('verify');
          setTimeout(() => codeInputRef.current?.focus(), 100);
        }}
        className="w-full py-2.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/25 transition-colors">

            סרקתי עם שני הטלפונים — המשך
          </button>
        </div>
      }

      {/* Step: Verify — enter code from phone */}
      {step === 'verify' &&
      <div data-ev-id="ev_1e98e4c494" className="space-y-5">
          <div data-ev-id="ev_6e9b41d033" className="p-4 rounded-xl bg-primary/[0.04] border border-primary/15">
            <h3 data-ev-id="ev_703f3aa882" className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" />
              שלב 2: אימות קוד
            </h3>
            <p data-ev-id="ev_b17b99d375" className="text-white/60 text-xs leading-relaxed">
              הזינו את הקוד בן 6 הספרות שמופיע ב-Google Authenticator באחד הטלפונים:
            </p>
          </div>

          <div data-ev-id="ev_21e1435faa" className="flex flex-col items-center gap-4">
            <input data-ev-id="ev_cc6b2bdd66"
          ref={codeInputRef}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={verifyCode}
          onChange={(e) => handleCodeInput(e.target.value, setVerifyCode)}
          onKeyDown={(e) => e.key === 'Enter' && verifyCode.length === 6 && activateTotp()}
          placeholder="000000"
          autoComplete="one-time-code"
          className="w-48 px-4 py-3 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white text-center text-2xl font-mono tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30" />


            <div data-ev-id="ev_d10a66cb88" className="flex items-center gap-3">
              <button data-ev-id="ev_da1d38da11"
            onClick={activateTotp}
            disabled={actionLoading || verifyCode.length !== 6}
            className="px-6 py-2.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/25 transition-colors disabled:opacity-50 flex items-center gap-2">

                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                אימות והפעלה
              </button>
              <button data-ev-id="ev_01f58061d5"
            onClick={() => {setStep('qr');setVerifyCode('');setError('');}}
            className="px-4 py-2.5 text-white/60 text-sm hover:text-white/60 transition-colors">

                חזרה
              </button>
            </div>
          </div>

          {error &&
        <p data-ev-id="ev_4c8fa3f9fb" className="text-red-400 text-xs flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
        }
        </div>
      }

      {/* Step: Backup Codes — MUST save these */}
      {step === 'backup' &&
      <div data-ev-id="ev_5f80af86e5" className="space-y-5">
          <div data-ev-id="ev_f7ebaa93b4" className="p-4 rounded-xl bg-green-500/[0.06] border border-green-500/20">
            <h3 data-ev-id="ev_7d89e019a5" className="text-green-300 font-semibold text-sm mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              2FA הופעל בהצלחה!
            </h3>
            <p data-ev-id="ev_4e7f5ffcb3" className="text-white/60 text-xs">
              מעכשיו תידרשו להזין קוד מ-Google Authenticator בכל כניסה.
            </p>
          </div>

          <div data-ev-id="ev_e31d626e59" className="p-4 rounded-xl bg-yellow-500/[0.04] border border-yellow-500/20">
            <h3 data-ev-id="ev_f2fb40fce2" className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              קודי גיבוי — שמרו במקום בטוח!
            </h3>
            <p data-ev-id="ev_eda949be4b" className="text-white/60 text-xs mb-3">
              אם תאבדו גישה לשני הטלפונים, תוכלו להשתמש בקודים האלה במקום קוד 6 ספרות.
              <br data-ev-id="ev_8599c12634" />
              <span data-ev-id="ev_fada38a819" className="text-yellow-400/80 font-medium">כל קוד גיבוי ניתן לשימוש חד-פעמי בלבד.</span>
            </p>

            <div data-ev-id="ev_309167f0fd" className="grid grid-cols-2 gap-2 mb-3">
              {backupCodes.map((code, i) =>
            <div data-ev-id="ev_0e160d2367"
            key={i}
            className="px-3 py-1.5 bg-white/[0.04] rounded-lg text-center font-mono text-sm text-white/70 tracking-wider">

                  {code.slice(0, 4)}-{code.slice(4)}
                </div>
            )}
            </div>

            <button data-ev-id="ev_7d62e72af4"
          onClick={copyBackupCodes}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/60 text-xs hover:text-white/70 transition-colors">

              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'הועתק!' : 'העתק קודים'}
            </button>
          </div>

          <button data-ev-id="ev_5d57005215"
        onClick={() => {
          setStep('idle');
          fetchStatus();
        }}
        className="w-full py-2.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/25 transition-colors">

            שמרתי — סיום
          </button>
        </div>
      }
    </div>);

};