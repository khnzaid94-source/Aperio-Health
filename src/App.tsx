import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { SidebarLayout } from './components/SidebarLayout';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import type { ExtractedReportItem } from './components/UploadView';
import {
    SidebarTab,
    SupportedLanguage,
    SavedReport,
    TestResult,
    JournalEntry,
    UserProfile,
    ClassificationType,
    UrgencyType
} from './types';
import { CATALOG, getUrgency } from './constants/catalog';
import { getLanguageDirection, getTranslation } from './utils/language';
import { removeTestFromResults, shouldSeedDemoData } from './utils/historyOps';
import { MLInsightsData } from './components/MLInsightsCard';
import { apiFetch, ApiError, clearToken, getToken } from './api/client';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

const OnboardingView = lazy(() =>
    import('./components/OnboardingView').then((m) => ({ default: m.OnboardingView }))
);
const UploadView = lazy(() =>
    import('./components/UploadView').then((m) => ({ default: m.UploadView }))
);
const AnalyzeView = lazy(() =>
    import('./components/AnalyzeView').then((m) => ({ default: m.AnalyzeView }))
);
const HistoryAndTrends = lazy(() =>
    import('./components/HistoryAndTrends').then((m) => ({ default: m.HistoryAndTrends }))
);
const JournalView = lazy(() =>
    import('./components/JournalView').then((m) => ({ default: m.JournalView }))
);
const ProfileView = lazy(() =>
    import('./components/ProfileView').then((m) => ({ default: m.ProfileView }))
);
const AboutView = lazy(() =>
    import('./components/AboutView').then((m) => ({ default: m.AboutView }))
);

const ViewLoader = () => (
    <div className="flex min-h-[40vh] items-center justify-center" role="status">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />
        <span className="sr-only">Loading</span>
    </div>
);

const DEMO_PRESET_PROFILES: Record<string, UserProfile> = {
    'sarah.jenkins@example.com': {
        fullName: 'Sarah Jenkins',
        dateOfBirth: '1988-04-12',
        gender: 'Female',
        email: 'sarah.jenkins@example.com',
        bloodType: 'A+',
        language: 'en',
        measurementUnits: 'Conventional',
        timezone: 'America/New_York',
        phoneNumber: '+1 (555) 234-5678',
        chronicConditions: ['Diabetes (Type 1 or 2)'],
        otherChronicConditions: '',
        medications: 'Metformin 500mg, Vitamin D3 2000 IU',
        allergies: 'Penicillin',
        primaryDoctorName: 'Dr. Elizabeth Blackwell',
        primaryDoctorContact: 'Metro Health Clinic, (555) 123-4567',
        lastLogin: 'Today at 2:30 PM',
        consentEducation: true,
        consentPrivacy: true,
        onboardingCompleted: true
    },
    'david.chen@example.com': {
        fullName: 'David Chen',
        dateOfBirth: '1979-10-25',
        gender: 'Male',
        email: 'david.chen@example.com',
        bloodType: 'O+',
        language: 'en',
        measurementUnits: 'Conventional',
        timezone: 'America/Chicago',
        phoneNumber: '+1 (555) 876-5432',
        chronicConditions: ['Hypertension (High BP)'],
        otherChronicConditions: 'Gout',
        medications: 'Atorvastatin 20mg, Lisinopril 10mg',
        allergies: 'None',
        primaryDoctorName: 'Dr. Robert Vance',
        primaryDoctorContact: 'Cedar Heart Center',
        lastLogin: 'Today at 11:15 AM',
        consentEducation: true,
        consentPrivacy: true,
        onboardingCompleted: true
    },
    'maya.patel@example.com': {
        fullName: 'Maya Patel',
        dateOfBirth: '1994-06-18',
        gender: 'Female',
        email: 'maya.patel@example.com',
        bloodType: 'B+',
        language: 'en',
        measurementUnits: 'Conventional',
        timezone: 'America/Los_Angeles',
        phoneNumber: '+1 (555) 345-6789',
        chronicConditions: ['Thyroid Condition (Hypo/Hyper)'],
        otherChronicConditions: 'PCOS',
        medications: 'Levothyroxine 50mcg, Ferrous Sulfate 325mg',
        allergies: 'Sulfa drugs',
        primaryDoctorName: 'Dr. Anita Sharma',
        primaryDoctorContact: 'Pacific Endocrinology',
        lastLogin: 'Yesterday at 4:45 PM',
        consentEducation: true,
        consentPrivacy: true,
        onboardingCompleted: true
    }
};

// Demo Preset Sample Data Engine (clinical conditions, chronological visits, journal entries)
interface DemoPresetAccountData {
    condition: string;
    reports: SavedReport[];
    journal: JournalEntry[];
}

const buildPresetResult = (
    testId: string,
    measuredValue: number,
    classification: ClassificationType,
    urgencyOverride?: UrgencyType
): TestResult => {
    const entry = CATALOG.find((item) => item.id === testId);
    return {
        testId,
        name: entry ? entry.name : testId,
        category: entry ? entry.category : 'General',
        measuredValue,
        unit: entry ? entry.unit : '',
        referenceMin: entry ? entry.min : 0,
        referenceMax: entry ? entry.max : 0,
        classification,
        urgency: urgencyOverride ?? getUrgency(testId, measuredValue, classification),
        explanation:
            classification === 'Low'
                ? (entry ? entry.explanations.low : '')
                : classification === 'High'
                    ? (entry ? entry.explanations.high : '')
                : ''
    };
}

// Demo visit dates are computed relative to "now" so showcase accounts never look stale
const daysAgo = (n: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
};

const DEMO_PRESET_DATA: Record<string, DemoPresetAccountData> = {
    'sarah.jenkins@example.com': {
        condition: 'Metabolic & Glucose Panel (Type 2 Diabetes & Vitamin D Deficiency)',
        reports: [
            {
                id: 'demo-sarah-r4',
                date: daysAgo(12),
                label: 'Metabolic & Glucose Panel (Latest Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('fbs', 108, 'High', 'Monitor'),
                    buildPresetResult('hba1c', 6.4, 'High', 'Monitor'),
                    buildPresetResult('vitamind', 38, 'Normal'),
                    buildPresetResult('cholesterol', 188, 'Normal'),
                    buildPresetResult('triglycerides', 135, 'Normal'),
                    buildPresetResult('egfr', 95, 'Normal')
                ]
            },
            {
                id: 'demo-sarah-r3',
                date: daysAgo(100),
                label: 'Metabolic & Glucose Panel (Visit 3)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('fbs', 124, 'High', 'Monitor'),
                    buildPresetResult('hba1c', 6.8, 'High', 'Monitor'),
                    buildPresetResult('vitamind', 24, 'Low', 'Monitor'),
                    buildPresetResult('cholesterol', 195, 'Normal'),
                    buildPresetResult('triglycerides', 148, 'Normal'),
                    buildPresetResult('egfr', 92, 'Normal')
                ]
            },
            {
                id: 'demo-sarah-r2',
                date: daysAgo(190),
                label: 'Metabolic & Glucose Panel (Visit 2)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('fbs', 138, 'High', 'Doctor'),
                    buildPresetResult('hba1c', 7.4, 'High', 'Doctor'),
                    buildPresetResult('vitamind', 18, 'Low', 'Monitor'),
                    buildPresetResult('cholesterol', 202, 'High'),
                    buildPresetResult('triglycerides', 170, 'High'),
                    buildPresetResult('creatinine', 0.98, 'Normal')
                ]
            },
            {
                id: 'demo-sarah-r1',
                date: daysAgo(280),
                label: 'Metabolic & Glucose Panel (Baseline Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('fbs', 152, 'High', 'Doctor'),
                    buildPresetResult('hba1c', 7.8, 'High', 'Doctor'),
                    buildPresetResult('vitamind', 14, 'Low', 'Doctor'),
                    buildPresetResult('cholesterol', 210, 'High'),
                    buildPresetResult('triglycerides', 185, 'High'),
                    buildPresetResult('creatinine', 1.0, 'Normal')
                ]
            }
        ],
        journal: [
            {
                id: 'demo-sarah-jrn-1',
                user_email: 'sarah.jenkins@example.com',
                entry_type: 'medication',
                name: 'Metformin',
                dosage: '500mg',
                start_date: daysAgo(280),
                notes: 'Daily with breakfast',
                created_at: `${daysAgo(280)}T09:00:00.000Z`
            },
            {
                id: 'demo-sarah-jrn-2',
                user_email: 'sarah.jenkins@example.com',
                entry_type: 'supplement',
                name: 'Vitamin D3',
                dosage: '2000 IU',
                start_date: daysAgo(280),
                notes: 'Daily',
                created_at: `${daysAgo(280)}T09:05:00.000Z`
            },
            {
                id: 'demo-sarah-jrn-3',
                user_email: 'sarah.jenkins@example.com',
                entry_type: 'lifestyle',
                name: 'Daily 30-minute walks',
                start_date: daysAgo(190),
                notes: 'Evening walk after dinner; glucose readings steadier since starting',
                created_at: `${daysAgo(190)}T09:10:00.000Z`
            }
        ]
    },
    'david.chen@example.com': {
        condition: 'Lipid & Cardiovascular Panel (Dyslipidemia & Hypertension)',
        reports: [
            {
                id: 'demo-david-r4',
                date: daysAgo(12),
                label: 'Lipid & Cardiovascular Panel (Latest Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('cholesterol', 196, 'Normal'),
                    buildPresetResult('ldl', 121, 'High', 'Monitor'),
                    buildPresetResult('hdl', 44, 'Normal'),
                    buildPresetResult('triglycerides', 158, 'High', 'Monitor'),
                    buildPresetResult('bun', 15, 'Normal'),
                    buildPresetResult('egfr', 90, 'Normal')
                ]
            },
            {
                id: 'demo-david-r3',
                date: daysAgo(100),
                label: 'Lipid & Cardiovascular Panel (Visit 3)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('cholesterol', 214, 'High', 'Monitor'),
                    buildPresetResult('ldl', 135, 'High', 'Monitor'),
                    buildPresetResult('hdl', 42, 'Normal'),
                    buildPresetResult('triglycerides', 180, 'High', 'Monitor'),
                    buildPresetResult('bun', 16, 'Normal'),
                    buildPresetResult('egfr', 88, 'Normal')
                ]
            },
            {
                id: 'demo-david-r2',
                date: daysAgo(190),
                label: 'Lipid & Cardiovascular Panel (Visit 2)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('cholesterol', 240, 'High', 'Doctor'),
                    buildPresetResult('ldl', 160, 'High', 'Doctor'),
                    buildPresetResult('hdl', 38, 'Low', 'Monitor'),
                    buildPresetResult('triglycerides', 220, 'High', 'Doctor'),
                    buildPresetResult('bun', 17, 'Normal'),
                    buildPresetResult('creatinine', 1.0, 'Normal')
                ]
            },
            {
                id: 'demo-david-r1',
                date: daysAgo(280),
                label: 'Lipid & Cardiovascular Panel (Baseline Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('cholesterol', 262, 'High', 'Doctor'),
                    buildPresetResult('ldl', 178, 'High', 'Doctor'),
                    buildPresetResult('hdl', 36, 'Low', 'Monitor'),
                    buildPresetResult('triglycerides', 245, 'High', 'Doctor'),
                    buildPresetResult('bun', 16, 'Normal'),
                    buildPresetResult('creatinine', 1.05, 'Normal')
                ]
            }
        ],
        journal: [
            {
                id: 'demo-david-jrn-1',
                user_email: 'david.chen@example.com',
                entry_type: 'medication',
                name: 'Atorvastatin',
                dosage: '20mg',
                start_date: daysAgo(280),
                notes: 'Bedtime',
                created_at: `${daysAgo(280)}T09:00:00.000Z`
            },
            {
                id: 'demo-david-jrn-2',
                user_email: 'david.chen@example.com',
                entry_type: 'medication',
                name: 'Lisinopril',
                dosage: '10mg',
                start_date: daysAgo(280),
                notes: 'Morning',
                created_at: `${daysAgo(280)}T09:05:00.000Z`
            },
            {
                id: 'demo-david-jrn-3',
                user_email: 'david.chen@example.com',
                entry_type: 'supplement',
                name: 'Omega-3 Fish Oil',
                dosage: '1000mg',
                start_date: daysAgo(100),
                notes: 'With dinner',
                created_at: `${daysAgo(100)}T09:10:00.000Z`
            },
            {
                id: 'demo-david-jrn-4',
                user_email: 'david.chen@example.com',
                entry_type: 'lifestyle',
                name: 'Low-sodium DASH diet',
                start_date: daysAgo(190),
                notes: 'Home-cooked meals; tracking blood pressure weekly',
                created_at: `${daysAgo(190)}T09:15:00.000Z`
            }
        ]
    },
    'maya.patel@example.com': {
        condition: 'Thyroid & Iron Studies (Hypothyroidism & Iron-Deficiency Anemia)',
        reports: [
            {
                id: 'demo-maya-r4',
                date: daysAgo(12),
                label: 'Thyroid & Iron Studies (Latest Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('tsh', 3.9, 'Normal'),
                    buildPresetResult('ft4', 1.3, 'Normal'),
                    buildPresetResult('ft3', 3.1, 'Normal'),
                    buildPresetResult('hemoglobin', 12.9, 'Normal'),
                    buildPresetResult('ferritin', 41, 'Normal'),
                    buildPresetResult('iron', 82, 'Normal')
                ]
            },
            {
                id: 'demo-maya-r3',
                date: daysAgo(100),
                label: 'Thyroid & Iron Studies (Visit 3)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('tsh', 5.1, 'High', 'Monitor'),
                    buildPresetResult('ft4', 1.1, 'Normal'),
                    buildPresetResult('ft3', 2.9, 'Normal'),
                    buildPresetResult('hemoglobin', 11.8, 'Normal'),
                    buildPresetResult('ferritin', 24, 'Normal'),
                    buildPresetResult('iron', 68, 'Normal')
                ]
            },
            {
                id: 'demo-maya-r2',
                date: daysAgo(190),
                label: 'Thyroid & Iron Studies (Visit 2)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('tsh', 8.2, 'High', 'Doctor'),
                    buildPresetResult('ft4', 0.8, 'Low', 'Doctor'),
                    buildPresetResult('ft3', 2.7, 'Low', 'Monitor'),
                    buildPresetResult('hemoglobin', 10.2, 'Low', 'Monitor'),
                    buildPresetResult('ferritin', 9, 'Low', 'Doctor'),
                    buildPresetResult('iron', 55, 'Low', 'Monitor'),
                    buildPresetResult('cholesterol', 212, 'High')
                ]
            },
            {
                id: 'demo-maya-r1',
                date: daysAgo(280),
                label: 'Thyroid & Iron Studies (Baseline Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('tsh', 8.9, 'High', 'Doctor'),
                    buildPresetResult('ft4', 0.7, 'Low', 'Doctor'),
                    buildPresetResult('ft3', 2.5, 'Low', 'Monitor'),
                    buildPresetResult('hemoglobin', 9.8, 'Low', 'Doctor'),
                    buildPresetResult('ferritin', 6, 'Low', 'Doctor'),
                    buildPresetResult('iron', 42, 'Low'),
                    buildPresetResult('cholesterol', 228, 'High', 'Doctor')
                ]
            }
        ],
        journal: [
            {
                id: 'demo-maya-jrn-1',
                user_email: 'maya.patel@example.com',
                entry_type: 'medication',
                name: 'Levothyroxine',
                dosage: '50mcg',
                start_date: daysAgo(280),
                notes: '30 mins before breakfast',
                created_at: `${daysAgo(280)}T09:00:00.000Z`
            },
            {
                id: 'demo-maya-jrn-2',
                user_email: 'maya.patel@example.com',
                entry_type: 'supplement',
                name: 'Ferrous Sulfate',
                dosage: '325mg',
                start_date: daysAgo(280),
                notes: 'With orange juice',
                created_at: `${daysAgo(280)}T09:05:00.000Z`
            },
            {
                id: 'demo-maya-jrn-3',
                user_email: 'maya.patel@example.com',
                entry_type: 'lifestyle',
                name: 'Iron-rich meal planning',
                start_date: daysAgo(190),
                notes: 'Pairing plant iron with citrus; avoiding tea with meals',
                created_at: `${daysAgo(190)}T09:10:00.000Z`
            }
        ]
    }
};

const isEmptyStoredArray = (storageKey: string): boolean => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return true;
    try {
        const parsed = JSON.parse(stored);
        return !Array.isArray(parsed) || parsed.length === 0;
    } catch {
        return true;
    }
};

// Set when a demo-account owner explicitly empties their data; blocks auto-seed resurrection
const demoClearedKey = (email: string): string => `aperio_democleared_${email.toLowerCase()}`;

export function App() {
    // Auth State
    const [userEmail, setUserEmail] = useState<string | null>(() => {
        return localStorage.getItem('aperio_current_user') || null;
    });

    // Prefetch the lazily-split views once signed in, after first paint, so
    // tab switches never show the loader while keeping them out of the
    // critical main bundle for initial load.
    useEffect(() => {
        if (!userEmail) return undefined;
        const timer = window.setTimeout(() => {
            void import('./components/OnboardingView');
            void import('./components/UploadView');
            void import('./components/AnalyzeView');
            void import('./components/HistoryAndTrends');
            void import('./components/JournalView');
            void import('./components/ProfileView');
            void import('./components/AboutView');
        }, 1500);
        return () => window.clearTimeout(timer);
    }, [userEmail]);

    // Profile & Onboarding State
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        const email = localStorage.getItem('aperio_current_user');
        if (!email) return null;
        const stored = localStorage.getItem(`aperio_profile_${email}`);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return null;
            }
        }
        return DEMO_PRESET_PROFILES[email] || null;
    });

    const [isOnboarding, setIsOnboarding] = useState<boolean>(() => {
        const email = localStorage.getItem('aperio_current_user');
        if (!email) return false;
        const stored = localStorage.getItem(`aperio_profile_${email}`);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return !parsed.onboardingCompleted;
            } catch {
                return true;
            }
        }
        if (DEMO_PRESET_PROFILES[email]) return false;
        return true;
    });

    // Navigation & Language
    const [currentTab, setCurrentTab] = useState<SidebarTab>('dashboard');
    const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
    const langChosenRef = useRef(false);

    // Explicit in-app language choice always wins over stored profile preferences
    const chooseLanguage = useCallback((lang: SupportedLanguage) => {
        langChosenRef.current = true;
        setCurrentLang(lang);
    }, []);

    const showSyncNotice = useCallback(() => {
        setSyncNotice(getTranslation('ui.syncFail', currentLang));
        if (syncNoticeTimer.current) window.clearTimeout(syncNoticeTimer.current);
        syncNoticeTimer.current = window.setTimeout(() => setSyncNotice(null), 6000);
    }, [currentLang]);

    const showSuccessNotice = useCallback((key: string) => {
        setSuccessNotice(getTranslation(key, currentLang));
        if (successNoticeTimer.current) window.clearTimeout(successNoticeTimer.current);
        successNoticeTimer.current = window.setTimeout(() => setSuccessNotice(null), 4000);
    }, [currentLang]);

    const resetAnalyzerSession = useCallback(() => {
        setCurrentParsedResults([]);
        setCurrentSourceLabel('No report uploaded');
        setCurrentMlInsights(null);
        setCurrentRawText('');
        setCurrentSourceReportId(null);
    }, []);

    // Data State
    const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

    // Active Analyzer State
    const [currentRawText, setCurrentRawText] = useState<string>('');
    const [currentSourceLabel, setCurrentSourceLabel] = useState<string>('No report uploaded');
    const [currentParsedResults, setCurrentParsedResults] = useState<TestResult[]>([]);
    const [currentMlInsights, setCurrentMlInsights] = useState<MLInsightsData | null>(null);
    const [currentSourceReportId, setCurrentSourceReportId] = useState<string | null>(null);

    // Honest notice when a deletion could not be confirmed by the server
    const [syncNotice, setSyncNotice] = useState<string | null>(null);
    const [successNotice, setSuccessNotice] = useState<string | null>(null);
    const [sessionEnded, setSessionEnded] = useState<boolean>(false);
    const syncNoticeTimer = useRef<number | null>(null);
    const successNoticeTimer = useRef<number | null>(null);

    // RTL & Language support
    useEffect(() => {
        const dir = getLanguageDirection(currentLang);
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', currentLang);
    }, [currentLang]);

    // Sign Out Handler
    const handleSignOut = useCallback((opts?: { sessionEnded?: boolean }) => {
        if (opts?.sessionEnded) {
            setSessionEnded(true);
        }
        const token = getToken();
        if (token) {
            apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
        }
        setUserEmail(null);
        setUserProfile(null);
        setIsOnboarding(false);
        setSavedReports([]);
        setJournalEntries([]);
        setCurrentParsedResults([]);
        setCurrentSourceLabel('No report uploaded');
        setCurrentRawText('');
        setCurrentMlInsights(null);
        clearToken();
        langChosenRef.current = false;
        Object.keys(localStorage)
            .filter((key) => key.startsWith('aperio_'))
            .forEach((key) => localStorage.removeItem(key));
        setCurrentTab('dashboard');
    }, []);

    const forceSessionEnd = useCallback(() => {
        setSessionEnded(true);
        handleSignOut();
    }, [handleSignOut]);

    // 30-Minute Inactivity Session Timeout
    useEffect(() => {
        if (!userEmail) return;

        // Check last active timestamp from localStorage
        const checkLastActive = () => {
            const lastActive = localStorage.getItem(`aperio_last_active_${userEmail}`);
            if (lastActive) {
                const elapsed = Date.now() - parseInt(lastActive, 10);
                if (elapsed >= SESSION_TIMEOUT_MS) {
                    forceSessionEnd();
                    return true;
                }
            }
            return false;
        };

        if (checkLastActive()) return;

        // Reset activity timestamp on user interactions
        const updateActivity = () => {
            if (userEmail) {
                localStorage.setItem(`aperio_last_active_${userEmail}`, Date.now().toString());
            }
        };

        updateActivity();

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        events.forEach((evt) => window.addEventListener(evt, updateActivity));

        // Periodic 1-minute interval timer check
        const timer = setInterval(() => {
            const lastActive = localStorage.getItem(`aperio_last_active_${userEmail}`);
            if (lastActive) {
                const elapsed = Date.now() - parseInt(lastActive, 10);
                if (elapsed >= SESSION_TIMEOUT_MS) {
                    forceSessionEnd();
                }
            }
        }, 60000);

        return () => {
            events.forEach((evt) => window.removeEventListener(evt, updateActivity));
            clearInterval(timer);
        };
    }, [userEmail, handleSignOut, forceSessionEnd]);

    // Load Profile, History, and Journal when user logs in
    useEffect(() => {
        if (!userEmail) {
            setUserProfile(null);
            setIsOnboarding(false);
            setSavedReports([]);
            setJournalEntries([]);
            return;
        }

        // 1. Fetch Profile
        const fetchProfile = async () => {
            const stored = localStorage.getItem(`aperio_profile_${userEmail}`);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setUserProfile(parsed);
                    setIsOnboarding(!parsed.onboardingCompleted);
                    if (parsed.language && !langChosenRef.current) setCurrentLang(parsed.language);
                    return;
                } catch {
                    // Stored corrupted
                }
            }

            try {
                const serverProf = await apiFetch<any>(`/api/profile`);
                const formattedProf: UserProfile = {
                    fullName: serverProf.full_name,
                    dateOfBirth: serverProf.date_of_birth || '',
                    gender: serverProf.gender || '',
                    email: serverProf.user_email,
                    bloodType: serverProf.blood_type || '',
                    language: serverProf.language || 'en',
                    measurementUnits: serverProf.measurement_units || 'Conventional',
                    timezone: serverProf.timezone || 'UTC',
                    phoneNumber: serverProf.phone_number || '',
                    chronicConditions: serverProf.chronic_conditions || [],
                    otherChronicConditions: serverProf.other_chronic_conditions || '',
                    medications: serverProf.medications || '',
                    allergies: serverProf.allergies || '',
                    primaryDoctorName: serverProf.primary_doctor_name || '',
                    primaryDoctorContact: serverProf.primary_doctor_contact || '',
                    lastLogin: serverProf.last_login || 'Recently',
                    consentEducation: true,
                    consentPrivacy: true,
                    onboardingCompleted: Boolean(serverProf.onboarding_completed)
                };
                setUserProfile(formattedProf);
                setIsOnboarding(!formattedProf.onboardingCompleted);
                localStorage.setItem(`aperio_profile_${userEmail}`, JSON.stringify(formattedProf));
                if (formattedProf.language && !langChosenRef.current) setCurrentLang(formattedProf.language);
                return;
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    handleSignOut({ sessionEnded: true });
                    return;
                }
                if (err instanceof ApiError && err.status === 404 && DEMO_PRESET_PROFILES[userEmail]) {
                    const preset = DEMO_PRESET_PROFILES[userEmail];
                    setUserProfile(preset);
                    setIsOnboarding(false);
                    localStorage.setItem(`aperio_profile_${userEmail}`, JSON.stringify(preset));
                    if (preset.language && !langChosenRef.current) setCurrentLang(preset.language);
                    return;
                }
            }

            setUserProfile(null);
            setIsOnboarding(true);
        };

        // 2. Fetch History from backend / localStorage
        const fetchHistory = async () => {
            // Auto-Seed Rule: only for the 3 preset demo accounts (strict isolation).
            // Skipped when the owner explicitly emptied their data (tombstone flag).
            const presetAccount = DEMO_PRESET_DATA[userEmail.toLowerCase()] ?? DEMO_PRESET_DATA[userEmail];
            if (
                presetAccount &&
                shouldSeedDemoData(
                    true,
                    Boolean(localStorage.getItem(demoClearedKey(userEmail))),
                    isEmptyStoredArray(`aperio_history_${userEmail}`)
                )
            ) {
                setSavedReports(presetAccount.reports);
                localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(presetAccount.reports));
                // Persist seeded reports to server so next reload's GET returns them (Sarah/Maya refill fix)
                apiFetch('/api/history/bulk', { method: 'POST', json: { reports: presetAccount.reports } }).catch(() => undefined);
                return;
            }

            try {
                const serverReports = await apiFetch<any[]>(`/api/history`);
                if (Array.isArray(serverReports)) {
                    // Guard: empty server must not overwrite a valid preset when not tombstoned
                    if (
                        serverReports.length === 0 &&
                        presetAccount &&
                        !localStorage.getItem(demoClearedKey(userEmail))
                    ) {
                        const localRaw = localStorage.getItem(`aperio_history_${userEmail}`);
                        if (localRaw) {
                            try {
                                const parsed = JSON.parse(localRaw);
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    setSavedReports(parsed);
                                    // backfill server in background
                                    apiFetch('/api/history/bulk', { method: 'POST', json: { reports: parsed } }).catch(() => undefined);
                                    return;
                                }
                            } catch {
                                // fall through to seed
                            }
                        }
                        // No valid local (first login after server wipe) — reseed locally + persist
                        setSavedReports(presetAccount.reports);
                        localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(presetAccount.reports));
                        apiFetch('/api/history/bulk', { method: 'POST', json: { reports: presetAccount.reports } }).catch(() => undefined);
                        return;
                    }
                    setSavedReports(serverReports);
                    localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(serverReports));
                    return;
                }
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    handleSignOut({ sessionEnded: true });
                    return;
                }
                // Offline / waking up -> fall back to local cache below
            }

            const stored = localStorage.getItem(`aperio_history_${userEmail}`);
            if (stored) {
                try {
                    setSavedReports(JSON.parse(stored));
                } catch {
                    setSavedReports([]);
                }
            } else {
                setSavedReports([]);
            }
        };

        // 3. Fetch Journal Entries
        const fetchJournal = async () => {
            // Auto-Seed Rule: only for the 3 preset demo accounts (strict isolation).
            const journalPreset = DEMO_PRESET_DATA[userEmail.toLowerCase()] ?? DEMO_PRESET_DATA[userEmail];
            if (
                journalPreset &&
                shouldSeedDemoData(
                    true,
                    Boolean(localStorage.getItem(demoClearedKey(userEmail))),
                    isEmptyStoredArray(`aperio_journal_${userEmail}`)
                )
            ) {
                setJournalEntries(journalPreset.journal);
                localStorage.setItem(`aperio_journal_${userEmail}`, JSON.stringify(journalPreset.journal));
                // Persist seeded journal entries to server (per-entry POST; bulk endpoint not available)
                for (const entry of journalPreset.journal) {
                    apiFetch('/api/journal', {
                        method: 'POST',
                        json: {
                            id: entry.id,
                            entry_type: entry.entry_type,
                            name: entry.name,
                            dosage: (entry as any).dosage ?? null,
                            start_date: (entry as any).start_date ?? null,
                            notes: (entry as any).notes ?? null
                        }
                    }).catch(() => undefined);
                }
                return;
            }

            try {
                const serverEntries = await apiFetch<any[]>(`/api/journal`);
                if (Array.isArray(serverEntries)) {
                    // Guard: empty server must not overwrite a valid preset when not tombstoned
                    if (
                        serverEntries.length === 0 &&
                        journalPreset &&
                        !localStorage.getItem(demoClearedKey(userEmail))
                    ) {
                        const localRaw = localStorage.getItem(`aperio_journal_${userEmail}`);
                        if (localRaw) {
                            try {
                                const parsed = JSON.parse(localRaw);
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    setJournalEntries(parsed);
                                    for (const entry of parsed) {
                                        apiFetch('/api/journal', {
                                            method: 'POST',
                                            json: {
                                                id: (entry as any).id,
                                                entry_type: (entry as any).entry_type,
                                                name: (entry as any).name,
                                                dosage: (entry as any).dosage ?? null,
                                                start_date: (entry as any).start_date ?? null,
                                                notes: (entry as any).notes ?? null
                                            }
                                        }).catch(() => undefined);
                                    }
                                    return;
                                }
                            } catch {
                                // fall through
                            }
                        }
                        setJournalEntries(journalPreset.journal);
                        localStorage.setItem(`aperio_journal_${userEmail}`, JSON.stringify(journalPreset.journal));
                        for (const entry of journalPreset.journal) {
                            apiFetch('/api/journal', {
                                method: 'POST',
                                json: {
                                    id: entry.id,
                                    entry_type: entry.entry_type,
                                    name: entry.name,
                                    dosage: (entry as any).dosage ?? null,
                                    start_date: (entry as any).start_date ?? null,
                                    notes: (entry as any).notes ?? null
                                }
                            }).catch(() => undefined);
                        }
                        return;
                    }
                    setJournalEntries(serverEntries);
                    localStorage.setItem(`aperio_journal_${userEmail}`, JSON.stringify(serverEntries));
                    return;
                }
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    handleSignOut({ sessionEnded: true });
                    return;
                }
            }

            const storedJournal = localStorage.getItem(`aperio_journal_${userEmail}`);
            if (storedJournal) {
                try {
                    setJournalEntries(JSON.parse(storedJournal));
                } catch {
                    setJournalEntries([]);
                }
            } else {
                setJournalEntries([]);
            }
        };

        fetchProfile();
        fetchHistory();
        fetchJournal();
    }, [userEmail]);

    // Auto-Hydrate Analyzer on Session Start: default to latest saved report when currentParsedResults is empty
    useEffect(() => {
        if (currentParsedResults.length === 0 && savedReports.length > 0) {
            const latest = savedReports[0];
            if (latest && latest.results && latest.results.length > 0) {
                setCurrentParsedResults(latest.results);
                setCurrentSourceLabel(latest.label || 'Saved Report');
                setCurrentSourceReportId(latest.id);
            }
        }
    }, [savedReports, currentParsedResults.length]);

    const persistReports = async (reports: SavedReport[]) => {
        setSavedReports(reports);
        if (userEmail) {
            localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(reports));
            if (reports.length > 0) {
                const latest = reports[0];
                try {
                    await apiFetch('/api/history', {
                        method: 'POST',
                        json: {
                            id: latest.id,
                            date: latest.date,
                            label: latest.label,
                            results: latest.results
                        }
                    });
                } catch (err) {
                    if (err instanceof ApiError && err.status === 401) {
                        handleSignOut({ sessionEnded: true });
                    }
                    // Offline / waking up -> local copy already saved
                }
            }
        }
    };

    const handleSignIn = (email: string) => {
        setSessionEnded(false);
        setUserEmail(email);
        localStorage.setItem('aperio_current_user', email);
        localStorage.setItem(`aperio_last_active_${email}`, Date.now().toString());

        const storedProf = localStorage.getItem(`aperio_profile_${email}`);
        if (storedProf) {
            try {
                const parsed = JSON.parse(storedProf);
                setUserProfile(parsed);
                setIsOnboarding(!parsed.onboardingCompleted);
                if (parsed.language && !langChosenRef.current) setCurrentLang(parsed.language);
                setCurrentTab('dashboard');
                return;
            } catch {
                // Ignore
            }
        }

        if (DEMO_PRESET_PROFILES[email]) {
            const preset = DEMO_PRESET_PROFILES[email];
            setUserProfile(preset);
            setIsOnboarding(false);
            localStorage.setItem(`aperio_profile_${email}`, JSON.stringify(preset));
            setCurrentTab('dashboard');
            return;
        }

        // New Account -> Start onboarding
        setUserProfile(null);
        setIsOnboarding(true);
    };

    const handleOnboardingComplete = async (profile: UserProfile, targetTab: 'upload' | 'dashboard') => {
        setUserProfile(profile);
        setIsOnboarding(false);
        if (profile.language) {
            langChosenRef.current = true;
            setCurrentLang(profile.language);
        }

        if (userEmail) {
            localStorage.setItem(`aperio_profile_${userEmail}`, JSON.stringify(profile));

            try {
                await apiFetch('/api/profile', {
                    method: 'POST',
                    json: {
                        full_name: profile.fullName,
                        date_of_birth: profile.dateOfBirth,
                        gender: profile.gender,
                        blood_type: profile.bloodType,
                        language: profile.language,
                        measurement_units: profile.measurementUnits,
                        timezone: profile.timezone,
                        phone_number: profile.phoneNumber,
                        chronic_conditions: profile.chronicConditions,
                        other_chronic_conditions: profile.otherChronicConditions,
                        medications: profile.medications,
                        allergies: profile.allergies,
                        primary_doctor_name: profile.primaryDoctorName,
                        primary_doctor_contact: profile.primaryDoctorContact,
                        last_login: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        onboarding_completed: true
                    }
                });
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) handleSignOut({ sessionEnded: true });
            }

            // Sync medications into health journal
            if (profile.medications) {
                const medsList = profile.medications.split(/[,;\n]+/).map((m) => m.trim()).filter(Boolean);
                for (const medName of medsList) {
                    const alreadyPresent = journalEntries.some(
                        (j) => j.name.toLowerCase() === medName.toLowerCase()
                    );
                    if (!alreadyPresent) {
                        await handleAddJournalEntry({
                            user_email: userEmail,
                            entry_type: 'medication',
                            name: medName,
                            start_date: new Date().toISOString().split('T')[0],
                            notes: 'Configured during initial patient onboarding'
                        });
                    }
                }
            }
        }

        if (profile.language) {
            langChosenRef.current = true;
            setCurrentLang(profile.language);
        }

        setCurrentTab(targetTab);
    };

    const handleSaveProfile = async (updatedProfile: UserProfile) => {
        setUserProfile(updatedProfile);
        if (userEmail) {
            localStorage.setItem(`aperio_profile_${userEmail}`, JSON.stringify(updatedProfile));
            try {
                await apiFetch('/api/profile', {
                    method: 'POST',
                    json: {
                        full_name: updatedProfile.fullName,
                        date_of_birth: updatedProfile.dateOfBirth,
                        gender: updatedProfile.gender,
                        blood_type: updatedProfile.bloodType,
                        language: updatedProfile.language,
                        measurement_units: updatedProfile.measurementUnits,
                        timezone: updatedProfile.timezone,
                        phone_number: updatedProfile.phoneNumber,
                        chronic_conditions: updatedProfile.chronicConditions,
                        other_chronic_conditions: updatedProfile.otherChronicConditions,
                        medications: updatedProfile.medications,
                        allergies: updatedProfile.allergies,
                        primary_doctor_name: updatedProfile.primaryDoctorName,
                        primary_doctor_contact: updatedProfile.primaryDoctorContact,
                        last_login: updatedProfile.lastLogin,
                        onboarding_completed: true
                    }
                });
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) handleSignOut({ sessionEnded: true });
            }
        }
    };

    const handleExportAllData = () => {
        const exportData = {
            exportDate: new Date().toISOString(),
            userEmail,
            profile: userProfile,
            savedReports,
            journalEntries
        };
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AperioHealth_HealthVault_${userEmail?.replace(/[@.]/g, '_')}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDeleteAccount = async () => {
        if (!userEmail) return;
        try {
            await apiFetch('/api/profile/delete', { method: 'DELETE' });
        } catch (err) {
            if (!(err instanceof ApiError && err.status === 401)) {
                // Still clear local data even if server unreachable
            }
        }

        Object.keys(localStorage)
            .filter((key) => key.startsWith('aperio_'))
            .forEach((key) => localStorage.removeItem(key));

        handleSignOut();
    };

    const handleSaveReport = (newReport: SavedReport) => {
        const updated = [newReport, ...savedReports];
        persistReports(updated);
        setCurrentSourceReportId(newReport.id);
    };

    const handleClearHistory = async () => {
        setSavedReports([]);
        resetAnalyzerSession();
        if (userEmail) {
            localStorage.removeItem(`aperio_history_${userEmail}`);
            if (DEMO_PRESET_DATA[userEmail.toLowerCase()] ?? DEMO_PRESET_DATA[userEmail]) {
                localStorage.setItem(demoClearedKey(userEmail), '1');
            }
            try {
                await apiFetch(`/api/history`, { method: 'DELETE' });
                showSuccessNotice('hist.historyCleared');
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    handleSignOut({ sessionEnded: true });
                    return;
                }
                showSyncNotice();
            }
        }
    };

    const handleDeleteSingleReport = async (reportId: string) => {
        const updated = savedReports.filter((r) => r.id !== reportId);
        setSavedReports(updated);
        setCurrentRawText('');
        if (currentSourceReportId === reportId) {
            setCurrentParsedResults([]);
            setCurrentSourceLabel('No report uploaded');
            setCurrentMlInsights(null);
            setCurrentSourceReportId(null);
        }
        if (userEmail) {
            localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(updated));
            if ((DEMO_PRESET_DATA[userEmail.toLowerCase()] ?? DEMO_PRESET_DATA[userEmail]) && updated.length === 0) {
                localStorage.setItem(demoClearedKey(userEmail), '1');
            }
            try {
                await apiFetch(`/api/history/report/${encodeURIComponent(reportId)}`, { method: 'DELETE' });
                showSuccessNotice('hist.reportDeleted');
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    handleSignOut({ sessionEnded: true });
                    return;
                }
                showSyncNotice();
            }
        }
    };

    const handleDeleteSingleTest = async (reportId: string, testId: string) => {
        const updated = savedReports
            .map((r) => {
                if (r.id !== reportId) return r;
                return { ...r, results: removeTestFromResults(r.results, testId) };
            })
            .filter((r) => r.results.length > 0);

        setSavedReports(updated);
        setCurrentRawText('');
        if (currentSourceReportId === reportId) {
            const remainingAnalyzerResults = removeTestFromResults(currentParsedResults, testId);
            if (remainingAnalyzerResults.length === 0) {
                resetAnalyzerSession();
            } else {
                setCurrentParsedResults(remainingAnalyzerResults);
            }
        }
        if (userEmail) {
            localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(updated));
            if ((DEMO_PRESET_DATA[userEmail.toLowerCase()] ?? DEMO_PRESET_DATA[userEmail]) && updated.length === 0) {
                localStorage.setItem(demoClearedKey(userEmail), '1');
            }
            try {
                await apiFetch(
                    `/api/history/result/${encodeURIComponent(reportId)}/${encodeURIComponent(testId)}`,
                    { method: 'DELETE' }
                );
                showSuccessNotice('hist.testRemoved');
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    handleSignOut({ sessionEnded: true });
                    return;
                }
                showSyncNotice();
            }
        }
    };

    const handleAddJournalEntry = async (entry: Omit<JournalEntry, 'id'>) => {
        const newEntry: JournalEntry = {
            ...entry,
            id: `jrn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
        };
        const updated = [newEntry, ...journalEntries];
        setJournalEntries(updated);
        if (userEmail) {
            localStorage.setItem(`aperio_journal_${userEmail}`, JSON.stringify(updated));
            try {
                await apiFetch('/api/journal', {
                    method: 'POST',
                    json: {
                        entry_type: newEntry.entry_type,
                        name: newEntry.name,
                        dosage: newEntry.dosage ?? null,
                        start_date: newEntry.start_date ?? null,
                        notes: newEntry.notes ?? null
                    }
                });
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) handleSignOut({ sessionEnded: true });
            }
        }
    };

    const handleDeleteJournalEntry = async (id: string) => {
        const updated = journalEntries.filter((e) => e.id !== id);
        setJournalEntries(updated);
        if (userEmail) {
            localStorage.setItem(`aperio_journal_${userEmail}`, JSON.stringify(updated));
            if ((DEMO_PRESET_DATA[userEmail.toLowerCase()] ?? DEMO_PRESET_DATA[userEmail]) && updated.length === 0) {
                localStorage.setItem(demoClearedKey(userEmail), '1');
            }
            try {
                await apiFetch(`/api/journal/${encodeURIComponent(id)}`, { method: 'DELETE' });
                showSuccessNotice('jrn.entryDeleted');
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) handleSignOut({ sessionEnded: true });
                else showSyncNotice();
            }
        }
    };

    // Extraction Callback
    const handleReportExtracted = (
        results: TestResult[],
        sourceLabel: string,
        rawText: string,
        _cvQuality: unknown,
        mlInsights: MLInsightsData | null
    ) => {
        setCurrentParsedResults(results);
        setCurrentSourceLabel(sourceLabel);
        setCurrentRawText(rawText);
        setCurrentMlInsights(mlInsights);
        setCurrentSourceReportId(null);
        setCurrentTab('analyze');
    };

    const handleBatchReportsExtracted = async (reports: ExtractedReportItem[]) => {
        if (!reports || reports.length === 0) return;

        // Save extracted visits into savedReports and persist ALL of them to /api/history/bulk
        const newReports: SavedReport[] = reports.map((rep, idx) => ({
            id: `rep-${Date.now()}-${idx}`,
            date: rep.date || new Date().toISOString().split('T')[0],
            label: rep.sourceLabel,
            results: rep.results
        }));

        const updatedHistory = [...newReports, ...savedReports];
        setSavedReports(updatedHistory);
        if (userEmail) {
            localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(updatedHistory));
            try {
                await apiFetch('/api/history/bulk', { method: 'POST', json: { reports: newReports } });
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    handleSignOut({ sessionEnded: true });
                    return;
                }
                // Offline / waking up -> local copies already saved; server catches up on next save
            }
        }

        // Load primary/latest report into active AnalyzeView state
        const primary = reports[0];
        setCurrentParsedResults(primary.results);
        setCurrentSourceLabel(primary.sourceLabel);
        setCurrentRawText(primary.rawText);
        setCurrentMlInsights(primary.mlInsights);
        setCurrentSourceReportId(null);

        // Redirect to Dashboard (if multi-report stack) or AnalyzeView (if single report)
        if (reports.length > 1) {
            setCurrentTab('dashboard');
        } else {
            setCurrentTab('analyze');
        }
    };

    // 1. Not Logged In -> Show Landing Page
    if (!userEmail) {
        return (
            <LandingView
                onSignIn={handleSignIn}
                currentLang={currentLang}
                onLanguageChange={chooseLanguage}
                sessionEndedNotice={sessionEnded}
            />
        );
    }

    // 2. Logged In, but Needs Onboarding -> Show Onboarding Page
    if (isOnboarding || !userProfile || !userProfile.onboardingCompleted) {
        return (
            <OnboardingView
                userEmail={userEmail}
                initialLanguage={currentLang}
                onComplete={handleOnboardingComplete}
                onSignOut={handleSignOut}
            />
        );
    }

    // 3. Logged In & Onboarded -> Main Health Application
    return (
        <SidebarLayout
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            userEmail={userEmail}
            userProfile={userProfile}
            currentLang={currentLang}
            onLanguageChange={chooseLanguage}
            onSignOut={handleSignOut}
            savedReportsCount={savedReports.length}
            journalCount={journalEntries.length}
        >
            {syncNotice && (
                <div
                    role="status"
                    className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900 shadow-xs"
                >
                    {syncNotice}
                </div>
            )}
            {successNotice && (
                <div
                    role="status"
                    className="mb-4 rounded-xl border border-teal-300 bg-teal-50 px-4 py-3 text-xs font-semibold text-teal-900 shadow-xs"
                >
                    {successNotice}
                </div>
            )}

            <Suspense fallback={<ViewLoader />}>
            {currentTab === 'dashboard' && (
                <DashboardView
                    userEmail={userEmail}
                    userProfile={userProfile}
                    savedReports={savedReports}
                    journalEntries={journalEntries}
                    onNavigate={setCurrentTab}
                    currentLang={currentLang}
                />
            )}

            {currentTab === 'upload' && (
                <UploadView
                    userProfile={userProfile}
                    currentLang={currentLang}
                    onReportExtracted={handleReportExtracted}
                    onBatchReportsExtracted={handleBatchReportsExtracted}
                    currentRawText={currentRawText}
                    onUpdateRawText={setCurrentRawText}
                />
            )}

            {currentTab === 'analyze' && (
                <AnalyzeView
                    userEmail={userEmail}
                    parsedResults={currentParsedResults}
                    sourceLabel={currentSourceLabel}
                    mlInsights={currentMlInsights}
                    currentLang={currentLang}
                    onSaveToHistory={handleSaveReport}
                    userProfile={userProfile}
                    journalEntries={journalEntries}
                    onNavigate={setCurrentTab}
                />
            )}

            {currentTab === 'history' && (
                <HistoryAndTrends
                    currentLang={currentLang}
                    savedReports={savedReports}
                    onClearHistory={handleClearHistory}
                    onDeleteSingleReport={handleDeleteSingleReport}
                    onDeleteSingleTest={handleDeleteSingleTest}
                    onNavigate={setCurrentTab}
                />
            )}

            {currentTab === 'journal' && (
                <JournalView
                    userEmail={userEmail}
                    journalEntries={journalEntries}
                    onAddEntry={handleAddJournalEntry}
                    onDeleteEntry={handleDeleteJournalEntry}
                    currentLang={currentLang}
                />
            )}

            {currentTab === 'profile' && (
                <ProfileView
                    userEmail={userEmail}
                    userProfile={userProfile}
                    savedReports={savedReports}
                    journalEntries={journalEntries}
                    onSaveProfile={handleSaveProfile}
                    onExportData={handleExportAllData}
                    onDeleteAccount={handleDeleteAccount}
                    onSignOut={handleSignOut}
                    currentLang={currentLang}
                />
            )}

            {currentTab === 'about' && <AboutView currentLang={currentLang} />}
            </Suspense>
        </SidebarLayout>
    );
}

export default App;
