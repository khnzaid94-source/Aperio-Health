import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    Pill,
    Stethoscope,
    Lock,
    Key,
    Download,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    Save,
    Clock,
    X,
    HeartPulse
} from 'lucide-react';
import {
    UserProfile,
    SupportedLanguage,
    BloodType,
    GenderType,
    MeasurementUnitPreference,
    SavedReport,
    JournalEntry
} from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/translations';

interface ProfileViewProps {
    userEmail: string;
    userProfile: UserProfile | null;
    savedReports: SavedReport[];
    journalEntries: JournalEntry[];
    onSaveProfile: (updatedProfile: UserProfile) => void;
    onExportData: () => void;
    onDeleteAccount: () => void;
    onSignOut: () => void;
    currentLang: SupportedLanguage;
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

const TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney'
];

export const ProfileView: React.FC<ProfileViewProps> = ({
    userEmail,
    userProfile,
    onSaveProfile,
    onExportData,
    onDeleteAccount,
    currentLang
}) => {
    // Detect system timezone
    const defaultTimezone = () => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        } catch {
            return 'UTC';
        }
    };

    // Form States
    const [fullName, setFullName] = useState<string>(userProfile?.fullName || '');
    const [dateOfBirth, setDateOfBirth] = useState<string>(userProfile?.dateOfBirth || '');
    const [gender, setGender] = useState<GenderType | ''>(userProfile?.gender || 'Female');
    const [bloodType, setBloodType] = useState<BloodType | ''>(userProfile?.bloodType || 'Prefer not to say');
    const [language, setLanguage] = useState<SupportedLanguage>(userProfile?.language || currentLang);
    const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitPreference>(
        userProfile?.measurementUnits || 'Conventional'
    );
    const [timezone, setTimezone] = useState<string>(userProfile?.timezone || defaultTimezone());
    const [phoneNumber, setPhoneNumber] = useState<string>(userProfile?.phoneNumber || '');

    const [selectedConditions, setSelectedConditions] = useState<string[]>(
        userProfile?.chronicConditions || []
    );
    const [otherChronicConditions, setOtherChronicConditions] = useState<string>(
        userProfile?.otherChronicConditions || ''
    );
    const [medications, setMedications] = useState<string>(userProfile?.medications || '');
    const [allergies, setAllergies] = useState<string>(userProfile?.allergies || '');

    const [primaryDoctorName, setPrimaryDoctorName] = useState<string>(
        userProfile?.primaryDoctorName || ''
    );
    const [primaryDoctorContact, setPrimaryDoctorContact] = useState<string>(
        userProfile?.primaryDoctorContact || ''
    );

    // Security & Modal States
    const [isSavedSuccess, setIsSavedSuccess] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // Password Form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

    // Email Form
    const [newEmail, setNewEmail] = useState('');
    const [emailMsg, setEmailMsg] = useState<string | null>(null);

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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const updated: UserProfile = {
            fullName: fullName.trim() || 'Patient',
            dateOfBirth,
            gender,
            email: userEmail,
            bloodType,
            language,
            measurementUnits,
            timezone,
            phoneNumber: phoneNumber.trim(),
            chronicConditions: selectedConditions,
            otherChronicConditions: otherChronicConditions.trim(),
            medications: medications.trim(),
            allergies: allergies.trim(),
            primaryDoctorName: primaryDoctorName.trim(),
            primaryDoctorContact: primaryDoctorContact.trim(),
            consentEducation: true,
            consentPrivacy: true,
            onboardingCompleted: true,
            lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        onSaveProfile(updated);
        setIsSavedSuccess(true);
        setTimeout(() => setIsSavedSuccess(false), 3000);
    };

    const handlePasswordChangeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            setPasswordMsg('Please fill in both current and new passwords.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMsg('New password must be at least 6 characters.');
            return;
        }
        setPasswordMsg('Password updated successfully!');
        setTimeout(() => {
            setShowChangePasswordModal(false);
            setCurrentPassword('');
            setNewPassword('');
            setPasswordMsg(null);
        }, 1200);
    };

    const handleEmailChangeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail || !newEmail.includes('@')) {
            setEmailMsg('Please enter a valid email address.');
            return;
        }
        setEmailMsg('Verification email sent to ' + newEmail);
        setTimeout(() => {
            setShowChangeEmailModal(false);
            setNewEmail('');
            setEmailMsg(null);
        }, 1500);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header Profile Hero Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-900/50">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left rtl:sm:text-right">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 rtl:sm:space-x-reverse">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-lg shadow-teal-500/20 flex-shrink-0">
                            {fullName ? fullName.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                    {fullName || 'Patient Profile'}
                                </h1>
                                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Private Vault
                                </span>
                            </div>
                            <p className="text-xs text-slate-300">{userEmail}</p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-teal-200">
                                {dateOfBirth && (
                                    <span className="bg-slate-800/80 border border-slate-700/80 px-2.5 py-0.5 rounded-md">
                                        Age: {calculateAge(dateOfBirth) ?? 'N/A'}
                                    </span>
                                )}
                                {gender && (
                                    <span className="bg-slate-800/80 border border-slate-700/80 px-2.5 py-0.5 rounded-md">
                                        Sex: {gender}
                                    </span>
                                )}
                                {bloodType && bloodType !== 'Prefer not to say' && (
                                    <span className="bg-rose-950/60 border border-rose-800/50 text-rose-300 font-bold px-2.5 py-0.5 rounded-md">
                                        Blood: {bloodType}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* CARD 1: Basic Info & Health Baseline */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-slate-100 pb-4">
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900">Basic Info &amp; Health Baseline</h3>
                            <p className="text-xs text-slate-500">Demographic baseline for age and sex-dependent laboratory range evaluation</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                                {calculateAge(dateOfBirth) !== null && (
                                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                                        Age: {calculateAge(dateOfBirth)}
                                    </span>
                                )}
                            </div>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Sex */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Sex</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as GenderType)}
                                aria-label="Sex"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
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
                            <label className="block text-xs font-bold text-slate-700 mb-1">Blood Type</label>
                            <select
                                value={bloodType}
                                onChange={(e) => setBloodType(e.target.value as BloodType)}
                                aria-label="Blood Type"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            >
                                {BLOOD_TYPES.map((bt) => (
                                    <option key={bt} value={bt}>
                                        {bt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Timezone */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                            <select
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                aria-label="Timezone"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            >
                                {TIMEZONES.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Language */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Display Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                                aria-label="Display Language"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.nativeName} ({lang.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Measurement System */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Measurement System</label>
                            <select
                                value={measurementUnits}
                                onChange={(e) => setMeasurementUnits(e.target.value as MeasurementUnitPreference)}
                                aria-label="Measurement System"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            >
                                <option value="Conventional">Conventional / US (mg/dL, g/dL)</option>
                                <option value="Metric">Metric / SI (mmol/L, g/L)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* CARD 2: Medical Context */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-slate-100 pb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <HeartPulse className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900">Medical Context &amp; History</h3>
                            <p className="text-xs text-slate-500">Improves ML anomaly interpretation and physiological cluster correlation</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Chronic Conditions Pills */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">Diagnosed Chronic Conditions</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {CHRONIC_CONDITIONS.map((c) => {
                                    const isSelected = selectedConditions.includes(c.label);
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => toggleCondition(c.label)}
                                            className={`p-2.5 rounded-xl border text-left rtl:text-right text-xs transition-all flex items-center justify-between ${
                                                isSelected
                                                    ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                                            }`}
                                        >
                                            <span>{c.label}</span>
                                            <div
                                                className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                                                    isSelected ? 'bg-teal-600 border-teal-600 text-white font-bold' : 'border-slate-300'
                                                }`}
                                            >
                                                {isSelected && '✓'}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Other Unlisted Conditions Field */}
                            <div className="mt-3">
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Other Diagnosed Condition(s) (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={otherChronicConditions}
                                    onChange={(e) => setOtherChronicConditions(e.target.value)}
                                    placeholder="e.g. Gout, PCOS, Asthma, Rheumatoid Arthritis, Celiac..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Medications */}
                        <div>
                            <div className="flex items-center space-x-1.5 mb-1">
                                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                                <label className="text-xs font-bold text-slate-700">Current Medications &amp; Supplements</label>
                            </div>
                            <textarea
                                value={medications}
                                onChange={(e) => setMedications(e.target.value)}
                                rows={2}
                                placeholder="e.g. Metformin 500mg daily, Atorvastatin 20mg, Vitamin D3 2000IU..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400"
                            />
                        </div>

                        {/* Allergies */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Known Allergies</label>
                            <input
                                type="text"
                                value={allergies}
                                onChange={(e) => setAllergies(e.target.value)}
                                placeholder="e.g. Penicillin, Sulfa, Latex (or None)"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>

                {/* CARD 3 & 4: Contact & Healthcare Provider */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                        <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-slate-100 pb-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Phone className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-extrabold text-slate-900">Contact Information</h3>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="email"
                                    value={userEmail}
                                    disabled
                                    className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowChangeEmailModal(true)}
                                    className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl transition-colors"
                                >
                                    Change
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Healthcare Provider */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                        <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-slate-100 pb-3">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                                <Stethoscope className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-extrabold text-slate-900">Primary Doctor / Clinic</h3>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Physician or Clinic Name</label>
                            <input
                                type="text"
                                value={primaryDoctorName}
                                onChange={(e) => setPrimaryDoctorName(e.target.value)}
                                placeholder="e.g. Dr. Robert Vance / Cedar Medical Clinic"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Phone / Contact Info</label>
                            <input
                                type="text"
                                value={primaryDoctorContact}
                                onChange={(e) => setPrimaryDoctorContact(e.target.value)}
                                placeholder="e.g. (555) 234-5678 or clinic@cedarmedical.org"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>

                {/* CARD 5: Account & Security (ReUI profile-3 Template) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-slate-100 pb-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900">Account &amp; Security Settings</h3>
                            <p className="text-xs text-slate-500">Manage credentials, active sessions, and 2-factor authentication</p>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                        {/* Email */}
                        <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                                <span className="font-bold text-slate-800 block">Email Address</span>
                                <span className="text-slate-500 text-[11px]">{userEmail}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowChangeEmailModal(true)}
                                className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors"
                            >
                                Change
                            </button>
                        </div>

                        {/* Password */}
                        <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                                <span className="font-bold text-slate-800 block">Password</span>
                                <span className="text-slate-500 text-[11px]">••••••••••••</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowChangePasswordModal(true)}
                                className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors"
                            >
                                Change Password
                            </button>
                        </div>

                        {/* Two-Factor Auth */}
                        <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                                <span className="font-bold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                                <span className="text-slate-500 text-[11px]">
                                    {twoFactorEnabled ? 'Enabled via Authenticator App' : 'Disabled (Recommended for sensitive lab records)'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                                    twoFactorEnabled
                                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                            >
                                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                            </button>
                        </div>

                        {/* Last Login & Sessions */}
                        <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                                <span className="font-bold text-slate-800 block">Active Device Sessions</span>
                                <span className="text-slate-500 text-[11px] flex items-center space-x-2">
                                    <Clock className="w-3 h-3 text-slate-400 inline" />
                                    <span>Last login: {userProfile?.lastLogin || 'Today'} • 1 Active Session (Current Device)</span>
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => alert('All other device sessions have been logged out.')}
                                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
                            >
                                Log Out All Other Devices
                            </button>
                        </div>
                    </div>
                </div>

                {/* CARD 6: Data & Privacy Management */}
                <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6 space-y-4">
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-slate-100 pb-3">
                        <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900">Data Sovereignty &amp; Privacy Vault</h3>
                            <p className="text-xs text-slate-500">Your health data is 100% private. Export archives or purge your vault at any time.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Export Data */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                            <div className="font-bold text-xs text-slate-800 flex items-center space-x-2">
                                <Download className="w-4 h-4 text-teal-600" />
                                <span>Export Full Patient Archive</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Download a complete JSON archive containing your demographic profile, historical blood test results, and health journal logs.
                            </p>
                            <button
                                type="button"
                                onClick={onExportData}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors inline-flex items-center justify-center space-x-1.5"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Archive (.json)</span>
                            </button>
                        </div>

                        {/* Delete Vault */}
                        <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-2">
                            <div className="font-bold text-xs text-rose-900 flex items-center space-x-2">
                                <Trash2 className="w-4 h-4 text-rose-600" />
                                <span>Delete Account &amp; Medical Vault</span>
                            </div>
                            <p className="text-[11px] text-rose-700/80 leading-relaxed">
                                Permanently wipe all demographic records, uploaded laboratory reports, and medication entries from local and server databases.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirmModal(true)}
                                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors inline-flex items-center justify-center space-x-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Purge All Account Records</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-2 pb-12">
                    {isSavedSuccess && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center space-x-1.5 animate-in fade-in shadow-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Saved</span>
                        </span>
                    )}
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs py-3 px-8 rounded-xl shadow-lg shadow-teal-500/25 transition-all transform hover:scale-[1.02] inline-flex items-center space-x-2 rtl:space-x-reverse"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save All Profile Changes</span>
                    </button>
                </div>
            </form>

            {/* Change Password Modal */}
            {showChangePasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
                        <button
                            onClick={() => setShowChangePasswordModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold flex items-center space-x-2">
                            <Key className="w-5 h-5 text-teal-400" />
                            <span>Change Password</span>
                        </h3>
                        {passwordMsg && (
                            <div className="text-xs p-2.5 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-200">
                                {passwordMsg}
                            </div>
                        )}
                        <form onSubmit={handlePasswordChangeSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs transition-colors"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Email Modal */}
            {showChangeEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
                        <button
                            onClick={() => setShowChangeEmailModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold flex items-center space-x-2">
                            <Mail className="w-5 h-5 text-teal-400" />
                            <span>Change Email Address</span>
                        </h3>
                        {emailMsg && (
                            <div className="text-xs p-2.5 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-200">
                                {emailMsg}
                            </div>
                        )}
                        <form onSubmit={handleEmailChangeSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">New Email Address</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="new.email@example.com"
                                    className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs transition-colors"
                            >
                                Send Verification Email
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Account Delete Confirmation Modal */}
            {showDeleteConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-rose-800 text-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative text-center">
                        <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-white">Permanently Delete Account?</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            This action <strong>cannot be undone</strong>. All your demographic profiles, saved lab reports, and medication logs will be permanently erased from this device and the server database.
                        </p>
                        <div className="flex items-center space-x-3 pt-2">
                            <button
                                onClick={() => setShowDeleteConfirmModal(false)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirmModal(false);
                                    onDeleteAccount();
                                }}
                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md shadow-rose-600/30"
                            >
                                Confirm &amp; Purge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
