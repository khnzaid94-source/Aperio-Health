import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {
    ShieldCheck,
    Lock,
    Mail,
    ArrowRight,
    Microscope,
    Sparkles,
    Activity,
    FileText,
    Eye,
    EyeOff,
    User,
    Globe,
    X,
    Cpu,
    ArrowUpRight
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/translations';
import { getTranslation } from '../utils/language';
import { apiFetch, ApiError, setToken } from '../api/client';

interface LandingViewProps {
    onSignIn: (email: string) => void;
    currentLang: SupportedLanguage;
    onLanguageChange: (lang: SupportedLanguage) => void;
    sessionEndedNotice?: boolean;
}

type AuthMode = 'login' | 'signup' | null;

const MOCK_PROFILES = [
    { name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', badge: 'Metabolic & Glucose Panel' },
    { name: 'David Chen', email: 'david.chen@example.com', badge: 'Lipid & Cardiovascular Panel' },
    { name: 'Maya Patel', email: 'maya.patel@example.com', badge: 'Thyroid & Iron Studies' }
];

const DEMO_PASSWORD = 'demo1234';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export const LandingView: React.FC<LandingViewProps> = ({ onSignIn, currentLang, onLanguageChange, sessionEndedNotice }) => {
    const t = (key: string) => getTranslation(key, currentLang);
    const [authModal, setAuthModal] = useState<AuthMode>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showDemoProfiles, setShowDemoProfiles] = useState(false);

    const openAuth = (mode: 'login' | 'signup') => {
        setAuthModal(mode);
        setErrorMessage(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
    };

    const closeAuth = () => {
        setAuthModal(null);
        setErrorMessage(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!email.trim() || !email.includes('@')) {
            setErrorMessage(t('landing.errEmail'));
            return;
        }

        if (!password.trim()) {
            setErrorMessage(t('landing.errPassword'));
            return;
        }

        if (authModal === 'signup') {
            if (!fullName.trim()) {
                setErrorMessage(t('landing.errName'));
                return;
            }
            if (password !== confirmPassword) {
                setErrorMessage(t('landing.errMismatch'));
                return;
            }
            if (password.length < 8) {
                setErrorMessage(t('landing.errMinLen'));
                return;
            }
        }

        setIsLoading(true);
        try {
            const data =
                authModal === 'signup'
                    ? await apiFetch<{ token: string; user_email: string }>('/api/auth/register', {
                          method: 'POST',
                          json: { email: email.trim(), password, full_name: fullName.trim() }
                      })
                    : await apiFetch<{ token: string; user_email: string }>('/api/auth/login', {
                          method: 'POST',
                          json: { email: email.trim(), password }
                      });
            setToken(data.token);
            onSignIn(data.user_email);
        } catch (err) {
            setErrorMessage(
                err instanceof ApiError ? err.message : t('landing.errServer')
            );
            setIsLoading(false);
        }
    };

    const handleGoogleCredential = async (credential: string) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const data = await apiFetch<{ token: string; user_email: string }>('/api/auth/google', {
                method: 'POST',
                json: { credential }
            });
            setToken(data.token);
            onSignIn(data.user_email);
        } catch (err) {
            setErrorMessage(
                err instanceof ApiError ? err.message : t('landing.errGoogle')
            );
            setIsLoading(false);
        }
    };

    const handleProfileSelect = async (selectedEmail: string) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const data = await apiFetch<{ token: string; user_email: string }>('/api/auth/login', {
                method: 'POST',
                json: { email: selectedEmail, password: DEMO_PASSWORD }
            });
            setToken(data.token);
            onSignIn(data.user_email);
        } catch (err) {
            setErrorMessage(
                err instanceof ApiError ? err.message : t('landing.errDemo')
            );
            setIsLoading(false);
        }
    };

    return (
                <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-teal-500 selection:text-white">
                    {sessionEndedNotice && (
                        <div
                            role="alert"
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] rounded-xl border border-amber-400/40 bg-amber-500/10 backdrop-blur-md px-4 py-3 text-xs font-semibold text-amber-200 shadow-lg shadow-amber-900/20 text-center"
                        >
                            {getTranslation('ui.sessionEnded', currentLang)}
                        </div>
                    )}
            {/* Ambient Background Glow Mesh */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-10 right-1/4 w-[32rem] h-[32rem] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Subtle Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Top Navigation Header */}
            <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="bg-gradient-to-tr from-teal-500 to-emerald-400 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-teal-500/20 font-black">
                        <Microscope className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
                            <span>Aperio Health</span>
                            <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                                Health Intelligence
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">{t('appSubtitle')}</p>
                    </div>
                </div>

                {/* Right Header Navigation: Language · Log In · Sign Up */}
                <div className="flex items-center gap-2.5 rtl:space-x-reverse">
                    <div className="relative flex items-center">
                        <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                        <select
                            value={currentLang}
                            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                            aria-label={getTranslation('nav.selectLanguage', currentLang)}
                            className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl pl-8 pr-6 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        >
                            {SUPPORTED_LANGUAGES.map((l) => (
                                <option key={l.code} value={l.code}>
                                    {l.nativeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <span className="hidden md:flex items-center space-x-1.5 text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full text-xs mr-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t('landing.passwordProtected')}</span>
                    </span>

                    <a
                        href="https://github.com/khnzaid94-source/Aperio-Health"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 rtl:space-x-reverse text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        <span>GitHub</span>
                    </a>

                    <button
                        onClick={() => openAuth('login')}
                        className="text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                        {t('landing.login')}
                    </button>

                    <button
                        onClick={() => openAuth('signup')}
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs shadow-lg shadow-teal-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {t('landing.signup')}
                    </button>
                </div>
            </header>

            {/* Main Showcase Hero Section */}
            <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center items-center text-center space-y-5 sm:space-y-6">
                <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-slate-800/80 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-semibold text-teal-300 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>{t('landing.badge')}</span>
                </div>

                <div className="max-w-3xl space-y-3">
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
                        {t('landing.heroLine1')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                            {t('landing.heroAccent')}
                        </span>
                    </h1>

                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        {t('landing.heroParagraph')} — so you walk into every doctor's appointment fully prepared.
                    </p>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                        onClick={() => openAuth('signup')}
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-teal-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 rtl:space-x-reverse"
                    >
                        <span>{t('landing.ctaStart')}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => openAuth('login')}
                        className="bg-slate-800/90 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center space-x-2 rtl:space-x-reverse"
                    >
                        <span>{t('landing.ctaSignIn')}</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {/* Core Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-4 text-left rtl:text-right">
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md space-y-2 hover:border-slate-700 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-white">{t('landing.pillar1Title')}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{t('landing.pillar1Desc')}</div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md space-y-2 hover:border-slate-700 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-white">{t('landing.pillar2Title')}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{t('landing.pillar2Desc')}</div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md space-y-2 hover:border-slate-700 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-white">{t('landing.pillar3Title')}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{t('landing.pillar3Desc')}</div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md space-y-2 hover:border-slate-700 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-white">{t('landing.pillar4Title')}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{t('landing.pillar4Desc')}</div>
                    </div>
                </div>
            </main>

            {/* Auth Modal (Reference Template: ReUI auth-2) */}
            {authModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
                    <div
                        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left rtl:text-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative Top Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-500" />

                        {/* Close Button */}
                        <button
                            onClick={closeAuth}
                            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Header */}
                        <div className="space-y-2 pb-5">
                            <div className="inline-flex p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
                                <Microscope className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-white">
                                {authModal === 'signup' ? t('landing.modalSignupTitle') : t('landing.modalLoginTitle')}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {authModal === 'signup'
                                    ? t('landing.modalSignupSub')
                                    : t('landing.modalLoginSub')}
                            </p>
                        </div>

                        {/* Google Social Auth (only when configured) */}
                        {GOOGLE_CLIENT_ID && (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={(res) => {
                                            if (res.credential) {
                                                handleGoogleCredential(res.credential);
                                            } else {
                                                setErrorMessage('Google sign-in did not return a credential.');
                                            }
                                        }}
                                        onError={() => setErrorMessage(t('landing.errGoogle'))}
                                        width="100%"
                                        text="continue_with"
                                        shape="pill"
                                        logo_alignment="center"
                                    />
                                </div>

                                <div className="relative flex items-center justify-center">
                                    <div className="border-t border-slate-800 w-full" />
                                    <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider absolute">
                                        {t('landing.orEmail')}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Error Notice */}
                        {errorMessage && (
                            <div className="mt-4 bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs p-3 rounded-xl">
                                {errorMessage}
                            </div>
                        )}

                        {/* Auth Form */}
                        <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
                            {authModal === 'signup' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        {t('landing.fullName')}
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Jane Doe"
                                            className="w-full bg-slate-800/90 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">
                                    {t('landing.emailLabel')}
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-slate-800/90 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-300 mb-1">{t('landing.passwordLabel')}</label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-800/90 border border-slate-700 text-xs rounded-xl pl-9 pr-10 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {authModal === 'signup' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        {t('landing.confirmPasswordLabel')}
                                    </label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-800/90 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 mt-2"
                            >
                                {isLoading ? (
                                    <span>{t('landing.processingBtn')}</span>
                                ) : authModal === 'signup' ? (
                                    <span>{t('landing.createAccountBtn')}</span>
                                ) : (
                                    <span>{t('landing.signInBtn')}</span>
                                )}
                            </button>
                        </form>

                        {/* Demo Profiles Dropdown */}
                        <div className="mt-4 pt-3 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={() => setShowDemoProfiles(!showDemoProfiles)}
                                className="text-[11px] text-slate-400 hover:text-teal-300 flex items-center justify-between w-full font-medium"
                            >
                                <span>{t('landing.demoToggle')}</span>
                                <span className="text-teal-400 font-bold">{showDemoProfiles ? '▲' : '▼'}</span>
                            </button>

                            {showDemoProfiles && (
                                <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
                                    {MOCK_PROFILES.map((prof) => (
                                        <button
                                            key={prof.email}
                                            onClick={() => handleProfileSelect(prof.email)}
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-between p-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left rtl:text-right text-xs transition-colors"
                                        >
                                            <div>
                                                <div className="font-bold text-slate-200">{prof.name}</div>
                                                <div className="text-[10px] text-slate-400">{prof.badge}</div>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Switch between Sign In / Sign Up */}
                        <div className="mt-5 text-center text-xs text-slate-400">
                            {authModal === 'signup' ? (
                                <span>
                                    {t('landing.alreadyAccount')}{' '}
                                    <button
                                        onClick={() => openAuth('login')}
                                        className="text-teal-400 hover:underline font-bold"
                                    >
                                        {t('landing.login')}
                                    </button>
                                </span>
                            ) : (
                                <span>
                                    {t('landing.dontHaveAccount')}{' '}
                                    <button
                                        onClick={() => openAuth('signup')}
                                        className="text-teal-400 hover:underline font-bold"
                                    >
                                        {t('landing.signup')}
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Footer */}
            <footer className="relative z-10 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 max-w-7xl mx-auto w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>© {new Date().getFullYear()} Aperio Health. All rights reserved.</div>
                <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                    <span>🔒 {t('landing.footerPrivacy')}</span>
                    <span>•</span>
                    <span>{t('landing.footerLiteracy')}</span>
                </div>
            </footer>
        </div>
    );
};
