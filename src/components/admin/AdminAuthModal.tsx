import React, { useState, useEffect } from 'react';
import { 
  isAdminSlotClaimed, 
  registerSingleAdmin, 
  loginAdmin, 
  getRegisteredAdminInfo,
  resetAdminSlot,
  AdminSession 
} from '../../lib/adminAuth';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  KeyRound, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldAlert,
  Hospital,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: AdminSession) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [slotClaimed, setSlotClaimed] = useState(false);
  const [registeredInfo, setRegisteredInfo] = useState<{ fullName: string; email: string; username: string } | null>(null);
  
  // Tab state: 'login' | 'signup' | 'reset'
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup form state (Single slot)
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPin, setSignupPin] = useState('1234');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Reset slot state
  const [resetPin, setResetPin] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Refresh status whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const isClaimed = isAdminSlotClaimed();
      setSlotClaimed(isClaimed);
      const info = getRegisteredAdminInfo();
      setRegisteredInfo(info);

      if (!isClaimed) {
        setActiveTab('signup'); // Prompt single-slot setup first if uninitialized
      } else {
        setActiveTab('login');
      }
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Signup
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (slotClaimed) {
      setErrorMsg('Admin registration is closed. The single admin account slot is already claimed.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerSingleAdmin({
        fullName: signupFullName,
        email: signupEmail,
        username: signupUsername,
        password: signupPassword,
        securityPin: signupPin,
      });

      if (result.success && result.session) {
        setSuccessMsg('Master Admin account created successfully! Logging you in...');
        setSlotClaimed(true);
        setTimeout(() => {
          onLoginSuccess(result.session!);
          onClose();
        }, 600);
      } else {
        setErrorMsg(result.error || 'Failed to create admin account.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMsg('Please enter your admin username/email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginAdmin(loginIdentifier, loginPassword);
      if (result.success && result.session) {
        setSuccessMsg('Authentication verified. Loading Admin Portal...');
        setTimeout(() => {
          onLoginSuccess(result.session!);
          onClose();
        }, 500);
      } else {
        setErrorMsg(result.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Emergency Reset
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = resetAdminSlot(resetPin);
    if (res.success) {
      setSlotClaimed(false);
      setRegisteredInfo(null);
      setActiveTab('signup');
      setSuccessMsg('Admin slot has been cleared. You may now register a new master admin account.');
    } else {
      setErrorMsg(res.error || 'Failed to reset admin slot. Check your security PIN.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      id="admin-auth-modal"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
            id="admin-auth-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Hospital Admin Portal
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Staff Only
                </span>
              </div>
              <p className="text-xs text-slate-300">
                We Care Hospital • Appointments & Clinical Bookings Management
              </p>
            </div>
          </div>

          {/* Slot Status Notice */}
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Slot Status:</span>
            </span>
            {slotClaimed ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 px-2.5 py-0.5 rounded-lg text-[11px]">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Slot Claimed (Signups Locked)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-300 bg-amber-950/60 border border-amber-700/60 px-2.5 py-0.5 rounded-lg text-[11px] animate-pulse">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>1 Single Slot Available</span>
              </span>
            )}
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
              activeTab === 'login'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="admin-tab-login"
          >
            Admin Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              if (slotClaimed) {
                setErrorMsg('Registration is closed: The single admin account has already been created.');
              }
              setActiveTab('signup');
            }}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="admin-tab-signup"
          >
            <span>Single Admin Setup</span>
            {!slotClaimed ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            ) : (
              <Lock className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>

        {/* Notification alerts */}
        {errorMsg && (
          <div className="m-5 mb-0 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="m-5 mb-0 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM CONTENT BODY */}
        <div className="p-6">
          
          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4" id="admin-login-form">
              {!slotClaimed && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">No master admin account registered yet.</span>
                    <p className="mt-0.5 text-[11px] text-amber-700">
                      Please switch to the <strong>"Single Admin Setup"</strong> tab to initialize your master administrator credentials.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="admin username or email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="admin-login-identifier"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="admin-login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                id="admin-login-submit-btn"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('reset')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Forgot master credentials or reset slot?
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SINGLE SLOT SIGNUP FORM */}
          {activeTab === 'signup' && (
            <div>
              {slotClaimed ? (
                /* Registration Locked State */
                <div className="text-center py-6 px-4 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                    <Lock className="w-7 h-7" />
                  </div>
                  
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Single Admin Slot Already Claimed
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Security policy allows exactly <strong>one master administrator</strong> for We Care Hospital. Additional accounts cannot be created.
                    </p>
                  </div>

                  {registeredInfo && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-700 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">
                        Registered Administrator
                      </div>
                      <div className="font-bold text-slate-900">{registeredInfo.fullName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{registeredInfo.email}</div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="w-full py-2.5 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      Proceed to Admin Login
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Single Slot Setup Form */
                <form onSubmit={handleSignupSubmit} className="space-y-3.5" id="admin-signup-form">
                  <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-800 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Master Admin Single Slot Available</span>
                      <p className="text-[11px] text-blue-700 mt-0.5">
                        Create your master administrator account now. Once registered, this signup slot is permanently closed.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Admin Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        placeholder="e.g. Dr. Nafli Razik / Master Admin"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        id="admin-signup-fullname"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Admin Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="admin@wecare.com"
                          className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          id="admin-signup-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={signupUsername}
                          onChange={(e) => setSignupUsername(e.target.value)}
                          placeholder="admin"
                          className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          id="admin-signup-username"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password (min 6 chars)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          id="admin-signup-password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          id="admin-signup-confirm-password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSignupPassword}
                        onChange={(e) => setShowSignupPassword(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Show passwords</span>
                    </label>

                    <div className="flex items-center gap-1 text-slate-400">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Default Recovery PIN: {signupPin}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                    id="admin-signup-submit-btn"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isLoading ? 'Creating Master Admin...' : 'Claim Slot & Create Master Admin'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: RESET / RECOVERY */}
          {activeTab === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4" id="admin-reset-form">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Master Slot Reset Request</span>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Resetting will wipe the existing admin credentials and re-open the single admin registration slot.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enter Security Recovery PIN (or master reset key)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={resetPin}
                    onChange={(e) => setResetPin(e.target.value)}
                    placeholder="Enter Security PIN (e.g. 1234)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Admin Slot</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer info note */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-center text-[11px] text-slate-500">
          We Care Hospital Healthcare Information System • Secure Staff Access
        </div>

      </div>
    </div>
  );
};
