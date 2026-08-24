import React, { useState, useEffect } from 'react';
import {
    User,
    Calendar,
    Mail,
    HeartPulse,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Globe,
    Scale,
    Droplet,
    Pill,
    AlertCircle,
    FileCheck2,
    Lock
} from 'lucide-react';
import {
    UserProfile,
    SupportedLanguage,
    BloodType,
    GenderType,
    MeasurementUnitPreference
} from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/translations';

interface OnboardingViewProps {
    userEmail: string;
    initialLanguage: SupportedLanguage;
    onComplete: (profile: UserProfile, targetTab: 'upload' | 'dashboard') => void;
    onSignOut?: () => void;
}

const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Prefer not to say'];
const GENDER_OPTIONS: GenderType[] = ['Male', 'Female', 'Prefer not to say'];

const CHRONIC_CONDITIONS = [
    { id: 'diabetes', label: 'Diabetes (Type 1 or 2)' },
    { id: 'hypertension', label: 'Hypertension (High BP)' },
    { id: 'heart_disease', label: 'Heart / Cardiovascular Disease' },
    { id: 'kidney_disease', label: 'Kidney Disease / Renal Impairment' },
    { id: 'thyroid_disorder', label: 'Thyroid Condition (Hypo/Hyper)' },
    { id: 'liver_disease', label: 'Liver Condition / Fatty Liver' },
    { id: 'none', label: 'No Known Chronic Conditions' }
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({
    userEmail,
    initialLanguage,
    onComplete,
    onSignOut
}) => {
    const [step, setStep] = useState<number>(1);
    const [maxStepReached, setMaxStepReached] = useState<number>(1);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Auto-detect browser language and units
    const detectBrowserLang = (): SupportedLanguage => {
        if (typeof navigator !== 'undefined' && navigator.language) {
            const code = navigator.language.slice(0, 2).toLowerCase();
            const supported = SUPPORTED_LANGUAGES.find((l) => l.code === code);
            if (supported) return supported.code;
        }
        return initialLanguage || 'en';
    };

    const detectMeasurementUnits = (): MeasurementUnitPreference => {
        if (typeof navigator !== 'undefined' && navigator.language) {
            const lang = navigator.language.toLowerCase();
            if (lang.includes('en-us') || lang.includes('en_us')) {
                return 'Conventional';
            }
        }
        return 'Conventional';
    };

    // Form State
    const [fullName, setFullName] = useState<string>('');
    const [dateOfBirth, setDateOfBirth] = useState<string>('');
    const [gender, setGender] = useState<GenderType | ''>('Male');
    const [bloodType, setBloodType] = useState<BloodType | ''>('Prefer not to say');
    const [language, setLanguage] = useState<SupportedLanguage>(detectBrowserLang);
    const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitPreference>(detectMeasurementUnits);

    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [otherChronicConditions, setOtherChronicConditions] = useState<string>('');
    const [medications, setMedications] = useState<string>('');
    const [allergies, setAllergies] = useState<string>('');

    const [consentEducation, setConsentEducation] = useState<boolean>(false);
    const [consentPrivacy, setConsentPrivacy] = useState<boolean>(true);

    // Pre-populate name if email has recognizable names
    useEffect(() => {
        if (userEmail && !fullName) {
            const prefix = userEmail.split('@')[0];
            const parts = prefix.split(/[._-]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1));
            if (parts.length > 1) {
                setFullName(parts.join(' '));
            } else if (prefix) {
                setFullName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
            }
        }
    }, [userEmail]);

    const toggleCondition = (condLabel: string) => {
        if (condLabel.includes('No Known')) {
            setSelectedConditions([condLabel]);
            return;
        }

        const filtered = selectedConditions.filter((c) => !c.includes('No Known'));
        if (filtered.includes(condLabel)) {
            setSelectedConditions(filtered.filter((c) => c !== condLabel));
        } else {
            setSelectedConditions([...filtered, condLabel]);
        }
    };

    const calculateAge = (dob: string): number | null => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) return null;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 0 ? age : null;
    };

    const goToStep = (next: number) => {
        setMaxStepReached((m) => Math.max(m, next));
        setStep(next);
    };

    const handleNextStep = () => {
        setErrorMsg(null);

        if (step === 1) {
            if (!fullName.trim()) {
                setErrorMsg('Please enter your full name to personalize your clinical reports.');
                return;
            }
            if (!dateOfBirth) {
                setErrorMsg('Please select your date of birth for age-specific reference ranges.');
                return;
            }
            if (!gender) {
                setErrorMsg('Please select your biological sex or gender.');
                return;
            }
            goToStep(2);
            return;
        }

        if (step === 2) {
            goToStep(3);
            return;
        }

        if (step === 3) {
            if (!consentEducation) {
                setErrorMsg('Please acknowledge that Aperio Health is an educational and literacy tool.');
                return;
            }
            if (!consentPrivacy) {
                setErrorMsg('Please acknowledge the privacy policy.');
                return;
            }
            goToStep(4);
            return;
        }
    };

    const buildProfileObject = (): UserProfile => {
        return {
            fullName: fullName.trim(),
            dateOfBirth,
            gender,
            email: userEmail,
            bloodType,
            language,
            measurementUnits,
            chronicConditions: selectedConditions,
            otherChronicConditions: otherChronicConditions.trim(),
            medications: medications.trim(),
            allergies: allergies.trim(),
            consentEducation,
            consentPrivacy,
            onboardingCompleted: true,
            completedAt: new Date().toISOString()
        };
    };

    const handleFinish = (targetTab: 'upload' | 'dashboard') => {
        const finalProfile = buildProfileObject();
        onComplete(finalProfile, targetTab);
    };

    const progressPercentage = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

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

            {/* Top Minimal Navigation */}
            <header className="relative z-20 max-w-5xl mx-auto w-full px-6 py-5 flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="bg-gradient-to-tr from-teal-500 to-emerald-400 p-2 rounded-xl text-slate-950 shadow-md font-black">
                        <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-lg font-black text-white tracking-tight">Aperio Health</span>
                        <span className="text-[10px] ml-2 bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                            Patient Setup
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                        Step <span className="text-teal-400 font-bold">{step}</span> of 4
                    </span>
                    {onSignOut && (
                        <button
                            onClick={onSignOut}
                            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                        >
                            Sign Out
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content Stepper Card (ReUI Onboarding-9 Template Design) */}
            <main className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col justify-center">
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                    {/* Top Multi-step Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
                        <div
                            className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    {/* Step Visual Indicator Pills */}
                    <div className="grid grid-cols-4 gap-2 mb-8 border-b border-slate-800/80 pb-6">
                        {[
                            { num: 1, title: 'Profile', icon: User },
                            { num: 2, title: 'Medical Context', icon: HeartPulse },
                            { num: 3, title: 'Consent', icon: ShieldCheck },
                            { num: 4, title: 'Ready', icon: CheckCircle2 }
                        ].map((s) => {
                            const isCurrent = step === s.num;
                            const isPassed = step > s.num;
                            const isUnlocked = s.num <= maxStepReached;
                            const Icon = s.icon;
                            return (
                                <button
                                    key={s.num}
                                    type="button"
                                    disabled={!isUnlocked}
                                    onClick={() => {
                                        if (!isUnlocked) {
                                            setErrorMsg('Please complete the current step before jumping ahead.');
                                            return;
                                        }
                                        setErrorMsg(null);
                                        setStep(s.num);
                                    }}
                                    className={`flex flex-col sm:flex-row items-center sm:space-x-2 rtl:space-x-reverse text-center sm:text-left transition-colors cursor-pointer group ${
                                        isCurrent
                                            ? 'text-teal-300 font-bold'
                                            : isPassed
                                            ? 'text-emerald-400 font-medium'
                                            : 'text-slate-500 font-normal hover:text-slate-300'
                                    }`}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all mb-1 sm:mb-0 ${
                                            isCurrent
                                                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                                                : isPassed
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-slate-500'
                                        }`}
                                    >
                                        {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="text-[10px] uppercase tracking-wider text-slate-500">Step 0{s.num}</div>
                                        <div className="text-xs">{s.title}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="mb-6 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs p-3.5 rounded-2xl flex items-center space-x-2 rtl:space-x-reverse">
                            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* STEP 1: Quick Profile */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    Let's build your health profile
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    Laboratory reference ranges (e.g. hemoglobin, fasting glucose) depend heavily on your age, sex, and measurement system.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Full Name <span className="text-teal-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="e.g. Jane Doe"
                                            className="w-full bg-slate-800/80 border border-slate-700 text-xs rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500"
                                        />
                                    </div>
                                </div>

                                {/* Email Address (Readonly/Prefilled) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                                        <input
                                            type="email"
                                            value={userEmail}
                                            disabled
                                            className="w-full bg-slate-800/40 border border-slate-700/60 text-xs rounded-xl pl-10 pr-4 py-3 text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold text-slate-300">
                                            Date of Birth <span className="text-teal-400">*</span>
                                        </label>
                                        {calculateAge(dateOfBirth) !== null && (
                                            <span className="text-[11px] font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-800/60">
                                                Age: {calculateAge(dateOfBirth)} yrs
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                                        <input
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-slate-800/80 border border-slate-700 text-xs rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                                        />
                                    </div>
                                </div>

                                {/* Sex */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Sex <span className="text-teal-400">*</span>
                                    </label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value as GenderType)}
                                        aria-label="Sex"
                                        className="w-full bg-slate-800/80 border border-slate-700 text-xs rounded-xl px-3.5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
                                    >
                                        {GENDER_OPTIONS.map((g) => (
                                            <option key={g} value={g}>
                                                {g}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Blood Type */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Blood Type (Optional)
                                    </label>
                                    <div className="relative">
                                        <Droplet className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5 pointer-events-none" />
                                        <select
                                            value={bloodType}
                                            onChange={(e) => setBloodType(e.target.value as BloodType)}
                                            aria-label="Blood Type"
                                            className="w-full bg-slate-800/80 border border-slate-700 text-xs rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
                                        >
                                            {BLOOD_TYPES.map((bt) => (
                                                <option key={bt} value={bt}>
                                                    {bt}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Preferred Language */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Language Preference
                                    </label>
                                    <div className="relative">
                                        <Globe className="w-4 h-4 text-teal-400 absolute left-3.5 top-3.5 pointer-events-none" />
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                                            aria-label="Language Preference"
                                            className="w-full bg-slate-800/80 border border-slate-700 text-xs rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
                                        >
                                            {SUPPORTED_LANGUAGES.map((lang) => (
                                                <option key={lang.code} value={lang.code}>
                                                    {lang.nativeName} ({lang.name})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Measurement Units */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Measurement System
                                    </label>
                                    <div className="relative">
                                        <Scale className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5 pointer-events-none" />
                                        <select
                                            value={measurementUnits}
                                            onChange={(e) => setMeasurementUnits(e.target.value as MeasurementUnitPreference)}
                                            aria-label="Measurement System"
                                            className="w-full bg-slate-800/80 border border-slate-700 text-xs rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
                                        >
                                            <option value="Conventional">Conventional / US (mg/dL, g/dL)</option>
                                            <option value="Metric">Metric / SI Units (mmol/L, g/L)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Medical Context */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <div className="inline-flex items-center space-x-1.5 text-teal-400 bg-teal-950/60 border border-teal-800/50 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Improves AI Explanations</span>
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    Medical context &amp; background
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    Sharing existing conditions and medications allows our ML engine to provide relevant, context-aware biomarker explanations.
                                </p>
                            </div>

                            {/* Chronic Conditions Pills */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-slate-300">
                                    Do you have any diagnosed chronic conditions?
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {CHRONIC_CONDITIONS.map((c) => {
                                        const isSelected = selectedConditions.includes(c.label);
                                        return (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => toggleCondition(c.label)}
                                                className={`p-3 rounded-xl border text-left rtl:text-right text-xs transition-all flex items-center justify-between ${
                                                    isSelected
                                                        ? 'bg-teal-500/20 border-teal-400 text-teal-200 font-bold shadow-xs'
                                                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                                                }`}
                                            >
                                                <span>{c.label}</span>
                                                <div
                                                    className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                                                        isSelected
                                                            ? 'bg-teal-500 border-teal-500 text-slate-950 font-black'
                                                            : 'border-slate-600'
                                                    }`}
                                                >
                                                    {isSelected && '✓'}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Other unlisted conditions field */}
                                <div className="pt-2">
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Other Diagnosed Condition(s) (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={otherChronicConditions}
                                        onChange={(e) => setOtherChronicConditions(e.target.value)}
                                        placeholder="e.g., Gout, PCOS, Asthma, Rheumatoid Arthritis, Celiac..."
                                        className="w-full bg-slate-800/80 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500"
                                    />
                                </div>
                            </div>

                            {/* Current Medications */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">
                                    Current Medications (Optional)
                                </label>
                                <div className="text-[11px] text-slate-400 mb-2 flex items-center space-x-1.5">
                                    <Pill className="w-3.5 h-3.5 text-teal-400" />
                                    <span>e.g., Metformin 500mg, Atorvastatin 20mg, Levothyroxine 50mcg</span>
                                </div>
                                <textarea
                                    value={medications}
                                    onChange={(e) => setMedications(e.target.value)}
                                    rows={2}
                                    placeholder="Enter your daily prescription medications or supplements..."
                                    className="w-full bg-slate-800/80 border border-slate-700 text-xs rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500"
                                />
                            </div>

                            {/* Known Allergies */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">
                                    Known Allergies (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={allergies}
                                    onChange={(e) => setAllergies(e.target.value)}
                                    placeholder="e.g. Penicillin, Sulfa drugs, Latex (or None)"
                                    className="w-full bg-slate-800/80 border border-slate-700 text-xs rounded-xl px-3.5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Consent & Safety */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    Consent &amp; Privacy Agreement
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    Please take 15 seconds to review our educational scope and local-first privacy commitments.
                                </p>
                            </div>

                            <div className="space-y-4 pt-2">
                                {/* Education Disclaimer Box */}
                                <div
                                    onClick={() => setConsentEducation(!consentEducation)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 rtl:space-x-reverse ${
                                        consentEducation
                                            ? 'bg-teal-500/15 border-teal-400/80 shadow-xs'
                                            : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                                    }`}
                                >
                                    <div
                                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center text-xs flex-shrink-0 transition-colors ${
                                            consentEducation
                                                ? 'bg-teal-500 border-teal-500 text-slate-950 font-black'
                                                : 'border-slate-500 bg-slate-800'
                                        }`}
                                    >
                                        {consentEducation && '✓'}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                                            <FileCheck2 className="w-4 h-4 text-teal-400" />
                                            <span>Educational &amp; Literacy Scope Notice <span className="text-teal-400">*</span></span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            I understand this application is for <strong>educational and health literacy purposes only</strong>. It is not a clinical diagnostic device, does not provide medical diagnoses or treatment prescriptions, and is not a substitute for a qualified physician or laboratory professional.
                                        </p>
                                    </div>
                                </div>

                                {/* Privacy Agreement Box */}
                                <div
                                    onClick={() => setConsentPrivacy(!consentPrivacy)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 rtl:space-x-reverse ${
                                        consentPrivacy
                                            ? 'bg-emerald-500/15 border-emerald-400/80 shadow-xs'
                                            : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                                    }`}
                                >
                                    <div
                                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center text-xs flex-shrink-0 transition-colors ${
                                            consentPrivacy
                                                ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black'
                                                : 'border-slate-500 bg-slate-800'
                                        }`}
                                    >
                                        {consentPrivacy && '✓'}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                                            <Lock className="w-4 h-4 text-emerald-400" />
                                            <span>Data Privacy &amp; Local Vault Policy <span className="text-emerald-400">*</span></span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            Your reports are stored behind your password-protected account and are visible only to you. This is an educational health-literacy demo — <strong>please upload sample or non-identifiable reports, never sensitive medical documents</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Ready / Done Celebration */}
                    {step === 4 && (
                        <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-teal-500/20">
                                <Sparkles className="w-8 h-8" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-white tracking-tight">
                                    You're all set, {fullName}!
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                                    Your personalized health profile has been configured. You can now upload your laboratory blood report or explore your dashboard.
                                </p>
                            </div>

                            {/* Summary Badge Cards */}
                            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 max-w-lg mx-auto text-left rtl:text-right grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">Patient Name</span>
                                    <span className="font-bold text-white">{fullName}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">Sex &amp; Blood Type</span>
                                    <span className="font-bold text-teal-300">{gender || 'Not specified'} • {bloodType || 'Prefer not to say'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">Language</span>
                                    <span className="font-bold text-white uppercase">{language}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">Units</span>
                                    <span className="font-bold text-cyan-300">{measurementUnits}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                                <button
                                    onClick={() => handleFinish('upload')}
                                    className="w-full sm:w-auto flex-1 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl text-xs shadow-lg shadow-teal-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 rtl:space-x-reverse"
                                >
                                    <span>Upload First Lab Report</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleFinish('dashboard')}
                                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-5 rounded-xl text-xs border border-slate-700 transition-colors"
                                >
                                    Go to Dashboard
                                </button>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-xs text-teal-400 hover:text-teal-300 font-medium hover:underline inline-flex items-center space-x-1"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Review &amp; Edit Profile Details</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step Navigation Controls (for Steps 1-3) */}
                    {step < 4 && (
                        <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setErrorMsg(null);
                                        setStep(step - 1);
                                    }}
                                    className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white font-bold px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Back</span>
                                </button>
                            ) : (
                                <div />
                            )}

                            <div className="flex items-center space-x-3">
                                {step === 2 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setErrorMsg(null);
                                            setStep(3);
                                        }}
                                        className="text-xs text-slate-400 hover:text-slate-200 font-medium px-3 py-2"
                                    >
                                        Skip for now
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 rtl:space-x-reverse"
                                >
                                    <span>{step === 3 ? 'Complete Setup' : 'Continue'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Subtle Tagline */}
            <footer className="relative z-10 py-4 text-center text-xs text-slate-500">
                🔒 100% Private Health Vault • Educational Reference Architecture
            </footer>
        </div>
    );
};
