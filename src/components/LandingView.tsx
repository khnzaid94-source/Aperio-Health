import React, { useState } from 'react';
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

interface LandingViewProps {
    onSignIn: (email: string) => void;
    currentLang: SupportedLanguage;
}

type AuthMode = 'login' | 'signup' | null;

const MOCK_PROFILES = [
    { name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', badge: 'Metabolic & Glucose Panel' },
    { name: 'David Chen', email: 'david.chen@example.com', badge: 'Lipid & Cardiovascular Panel' },
    { name: 'Maya Patel', email: 'maya.patel@example.com', badge: 'Thyroid & Iron Studies' }
];

export const LandingView: React.FC<LandingViewProps> = ({ onSignIn }) => {
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

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!email.trim() || !email.includes('@')) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        if (!password.trim()) {
            setErrorMessage('Please enter your password.');
            return;
        }

        if (authModal === 'signup') {
            if (!fullName.trim()) {
                setErrorMessage('Please enter your full name.');
                return;
            }
            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match.');
                return;
            }
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onSignIn(email.trim().toLowerCase());
        }, 350);
    };

    const handleGoogleAuth = () => {
        setIsLoading(true);
        setErrorMessage(null);
        setTimeout(() => {
            setIsLoading(false);
            onSignIn('google.user@example.com');
        }, 300);
    };

    const handleProfileSelect = (selectedEmail: string) => {
        setIsLoading(true);
        setErrorMessage(null);
        setTimeout(() => {
            setIsLoading(false);
            onSignIn(selectedEmail);
        }, 250);
    };

    return (
        <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-teal-500 selection:text-white">
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
                        <p className="text-xs text-slate-400">The intelligence behind your bloodwork.</p>
                    </div>
                </div>

                {/* Right Header Navigation: Log In & Sign Up Buttons */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="hidden md:flex items-center space-x-1.5 text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full text-xs mr-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>HIPAA Aligned</span>
                    </span>

                    <a
                        href="https://github.com"
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
                        Log In
                    </button>

                    <button
                        onClick={() => openAuth('signup')}
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs shadow-lg shadow-teal-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Sign Up
                    </button>
                </div>
            </header>

            {/* Main Showcase Hero Section */}
            <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center items-center text-center space-y-5 sm:space-y-6">
                <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-slate-800/80 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-semibold text-teal-300 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Machine Learning &amp; Computer Vision Powered</span>
                </div>

                <div className="max-w-3xl space-y-3">
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
                        Understand your blood tests in{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                            plain language
                        </span>
                        .
                    </h1>

                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        Aperio Health reads your multi-page lab reports using computer vision, translates 63 clinical biomarkers into plain everyday language, detects connected multi-marker health patterns using machine learning, and tracks your biological balance across visits — so you walk into every doctor's appointment fully prepared.
                    </p>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                        onClick={() => openAuth('signup')}
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-teal-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 rtl:space-x-reverse"
                    >
                        <span>Get Started Free</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => openAuth('login')}
                        className="bg-slate-800/90 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center space-x-2 rtl:space-x-reverse"
                    >
                        <span>Sign In to Portal</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {/* Core Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-4 text-left rtl:text-right">
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md space-y-2 hover:border-slate-700 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-white">63 Clinical Biomarkers</div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                            Full coverage across CBC, Lipid, Thyroid, LFT, KFT, Glucose, HbA1c, Iron, Vitamins, Hormones, and Inflammation panels.
                        </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md space-y-2 hover:border-slate-700 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-white">Isolation Forest ML Engine</div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                            Scikit-Learn anomaly scoring calculates your Metabolic Balance Index, detects cross-marker physiological synergy patterns, and powers automated multi-page visit segmentation.
                        </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md space-y-2 hover:border-slate-700 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-white">10 Regional &amp; World Languages</div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                            Full interface translation across English, Hindi, Marathi, Bengali, Telugu, Tamil, Gujarati, Spanish, French, and Mandarin Chinese.
                        </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md space-y-2 hover:border-slate-700 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-white">Doctor Consultation Brief</div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                            One-click printable PDF summary with biomarker trajectories, active prescriptions context, and pre-formulated physician discussion questions.
                        </div>
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
                                {authModal === 'signup' ? 'Create an Account' : 'Welcome Back'}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {authModal === 'signup'
                                    ? 'Enter your details below to create your Aperio Health account.'
                                    : 'Enter your credentials to access your Aperio Health portal.'}
                            </p>
                        </div>

                        {/* Google Social Auth Button */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={handleGoogleAuth}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center space-x-3 rtl:space-x-reverse bg-white hover:bg-slate-100 text-slate-900 font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 text-xs sm:text-sm"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </button>

                            <div className="relative flex items-center justify-center">
                                <div className="border-t border-slate-800 w-full" />
                                <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider absolute">
                                    OR WITH EMAIL
                                </span>
                            </div>
                        </div>

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
                                        Full Name
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
                                    Email Address
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
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-semibold text-slate-300">Password</label>
                                    {authModal === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setErrorMessage('Password reset link sent to demo environment.')}
                                            className="text-[11px] text-teal-400 hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
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
                                        Confirm Password
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
                                    <span>Processing...</span>
                                ) : authModal === 'signup' ? (
                                    <span>Create Account</span>
                                ) : (
                                    <span>Sign In</span>
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
                                <span>Quick Test: Select a Demo Profile</span>
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
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => openAuth('login')}
                                        className="text-teal-400 hover:underline font-bold"
                                    >
                                        Log In
                                    </button>
                                </span>
                            ) : (
                                <span>
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => openAuth('signup')}
                                        className="text-teal-400 hover:underline font-bold"
                                    >
                                        Sign Up
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
                    <span>🔒 100% Private — No Data Used for AI Model Training</span>
                    <span>•</span>
                    <span>Educational &amp; Literacy Tool Only</span>
                </div>
            </footer>
        </div>
    );
};
