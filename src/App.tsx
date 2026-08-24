import { useState, useEffect, useCallback } from 'react';
import { SidebarLayout } from './components/SidebarLayout';
import { LandingView } from './components/LandingView';
import { OnboardingView } from './components/OnboardingView';
import { ProfileView } from './components/ProfileView';
import { DashboardView } from './components/DashboardView';
import { UploadView, ExtractedReportItem } from './components/UploadView';
import { AnalyzeView } from './components/AnalyzeView';
import { HistoryAndTrends } from './components/HistoryAndTrends';
import { JournalView } from './components/JournalView';
import { AboutView } from './components/AboutView';
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
import { getLanguageDirection } from './utils/language';
import { CVQualityData, MLInsightsData } from './components/MLInsightsCard';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

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
};

const DEMO_PRESET_DATA: Record<string, DemoPresetAccountData> = {
    'sarah.jenkins@example.com': {
        condition: 'Metabolic & Glucose Panel (Type 2 Diabetes & Vitamin D Deficiency)',
        reports: [
            {
                id: 'demo-sarah-report-recent',
                date: '2026-01-15',
                label: 'Metabolic & Glucose Panel (Recent Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('fbs', 126, 'High', 'Monitor'),
                    buildPresetResult('hba1c', 6.8, 'High', 'Monitor'),
                    buildPresetResult('vitamind', 22, 'Low', 'Monitor'),
                    buildPresetResult('cholesterol', 195, 'Normal'),
                    buildPresetResult('creatinine', 0.9, 'Normal'),
                    buildPresetResult('egfr', 95, 'Normal')
                ]
            },
            {
                id: 'demo-sarah-report-prior',
                date: '2025-10-12',
                label: 'Metabolic & Glucose Panel (Prior Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('fbs', 138, 'High', 'Doctor'),
                    buildPresetResult('hba1c', 7.4, 'High', 'Doctor'),
                    buildPresetResult('vitamind', 14, 'Low', 'Doctor'),
                    buildPresetResult('cholesterol', 205, 'High')
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
                start_date: '2025-10-12',
                notes: 'Daily with breakfast',
                created_at: '2025-10-12T09:00:00.000Z'
            },
            {
                id: 'demo-sarah-jrn-2',
                user_email: 'sarah.jenkins@example.com',
                entry_type: 'supplement',
                name: 'Vitamin D3',
                dosage: '2000 IU',
                start_date: '2025-10-12',
                notes: 'Daily',
                created_at: '2025-10-12T09:05:00.000Z'
            }
        ]
    },
    'david.chen@example.com': {
        condition: 'Lipid & Cardiovascular Panel (Dyslipidemia & Hypertension)',
        reports: [
            {
                id: 'demo-david-report-recent',
                date: '2026-01-20',
                label: 'Lipid & Cardiovascular Panel (Recent Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('cholesterol', 215, 'High'),
                    buildPresetResult('ldl', 135, 'High', 'Monitor'),
                    buildPresetResult('hdl', 42, 'Normal'),
                    buildPresetResult('triglycerides', 180, 'High'),
                    buildPresetResult('bun', 16, 'Normal')
                ]
            },
            {
                id: 'demo-david-report-prior',
                date: '2025-09-18',
                label: 'Lipid & Cardiovascular Panel (Prior Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('cholesterol', 245, 'High', 'Doctor'),
                    buildPresetResult('ldl', 165, 'High', 'Doctor'),
                    buildPresetResult('hdl', 38, 'Low', 'Monitor'),
                    buildPresetResult('triglycerides', 220, 'High')
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
                start_date: '2025-09-18',
                notes: 'Bedtime',
                created_at: '2025-09-18T09:00:00.000Z'
            },
            {
                id: 'demo-david-jrn-2',
                user_email: 'david.chen@example.com',
                entry_type: 'medication',
                name: 'Lisinopril',
                dosage: '10mg',
                start_date: '2025-09-18',
                notes: 'Morning',
                created_at: '2025-09-18T09:05:00.000Z'
            }
        ]
    },
    'maya.patel@example.com': {
        condition: 'Thyroid & Iron Studies (Hypothyroidism & Iron-Deficiency Anemia)',
        reports: [
            {
                id: 'demo-maya-report-recent',
                date: '2026-02-02',
                label: 'Thyroid & Iron Studies (Recent Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('tsh', 5.1, 'High', 'Monitor'),
                    buildPresetResult('ft4', 1.1, 'Normal'),
                    buildPresetResult('ft3', 2.8, 'Normal'),
                    buildPresetResult('hemoglobin', 11.8, 'Normal'),
                    buildPresetResult('ferritin', 24, 'Normal'),
                    buildPresetResult('iron', 68, 'Normal')
                ]
            },
            {
                id: 'demo-maya-report-prior',
                date: '2025-11-05',
                label: 'Thyroid & Iron Studies (Prior Visit)',
                sampleCondition: 'fasting',
                results: [
                    buildPresetResult('tsh', 8.2, 'High', 'Doctor'),
                    buildPresetResult('ft4', 0.8, 'Low', 'Doctor'),
                    buildPresetResult('hemoglobin', 10.2, 'Low', 'Monitor'),
                    buildPresetResult('ferritin', 9, 'Low', 'Doctor'),
                    buildPresetResult('iron', 42, 'Low')
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
                start_date: '2025-11-05',
                notes: '30 mins before breakfast',
                created_at: '2025-11-05T09:00:00.000Z'
            },
            {
                id: 'demo-maya-jrn-2',
                user_email: 'maya.patel@example.com',
                entry_type: 'supplement',
                name: 'Ferrous Sulfate',
                dosage: '325mg',
                start_date: '2025-11-05',
                notes: 'With orange juice',
                created_at: '2025-11-05T09:05:00.000Z'
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

export function App() {
    // Auth State
    const [userEmail, setUserEmail] = useState<string | null>(() => {
        return localStorage.getItem('aperio_current_user') || null;
    });

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

    // Data State
    const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

    // Active Analyzer State
    const [currentRawText, setCurrentRawText] = useState<string>('');
    const [currentSourceLabel, setCurrentSourceLabel] = useState<string>('No report uploaded');
    const [currentParsedResults, setCurrentParsedResults] = useState<TestResult[]>([]);
    const [currentCvQuality, setCurrentCvQuality] = useState<CVQualityData | null>(null);
    const [currentMlInsights, setCurrentMlInsights] = useState<MLInsightsData | null>(null);

    // RTL & Language support
    useEffect(() => {
        const dir = getLanguageDirection(currentLang);
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', currentLang);
    }, [currentLang]);

    // Sign Out Handler
    const handleSignOut = useCallback(() => {
        setUserEmail(null);
        setUserProfile(null);
        setIsOnboarding(false);
        setSavedReports([]);
        setJournalEntries([]);
        setCurrentParsedResults([]);
        setCurrentSourceLabel('No report uploaded');
        setCurrentRawText('');
        setCurrentCvQuality(null);
        setCurrentMlInsights(null);
        localStorage.removeItem('aperio_current_user');
        setCurrentTab('dashboard');
    }, []);

    // 30-Minute Inactivity Session Timeout
    useEffect(() => {
        if (!userEmail) return;

        // Check last active timestamp from localStorage
        const checkLastActive = () => {
            const lastActive = localStorage.getItem(`aperio_last_active_${userEmail}`);
            if (lastActive) {
                const elapsed = Date.now() - parseInt(lastActive, 10);
                if (elapsed >= SESSION_TIMEOUT_MS) {
                    alert('Session expired due to 30 minutes of inactivity. For your health privacy, please sign in again.');
                    handleSignOut();
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
                    alert('Session expired due to 30 minutes of inactivity. For your health privacy, please sign in again.');
                    handleSignOut();
                }
            }
        }, 60000);

        return () => {
            events.forEach((evt) => window.removeEventListener(evt, updateActivity));
            clearInterval(timer);
        };
    }, [userEmail, handleSignOut]);

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
                    if (parsed.language) setCurrentLang(parsed.language);
                    return;
                } catch {
                    // Stored corrupted
                }
            }

            if (DEMO_PRESET_PROFILES[userEmail]) {
                const preset = DEMO_PRESET_PROFILES[userEmail];
                setUserProfile(preset);
                setIsOnboarding(false);
                localStorage.setItem(`aperio_profile_${userEmail}`, JSON.stringify(preset));
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/api/profile/${encodeURIComponent(userEmail)}`);
                if (res.ok) {
                    const serverProf = await res.json();
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
                    if (formattedProf.language) setCurrentLang(formattedProf.language);
                    return;
                }
            } catch {
                // Backend offline
            }

            setUserProfile(null);
            setIsOnboarding(true);
        };

        // 2. Fetch History from backend / localStorage
        const fetchHistory = async () => {
            // Auto-Seed Rule: only for the 3 preset demo accounts (strict isolation)
            const presetAccount = DEMO_PRESET_DATA[userEmail];
            if (presetAccount && isEmptyStoredArray(`aperio_history_${userEmail}`)) {
                setSavedReports(presetAccount.reports);
                localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(presetAccount.reports));
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/api/history/${encodeURIComponent(userEmail)}`);
                if (res.ok) {
                    const serverReports = await res.json();
                    if (Array.isArray(serverReports) && serverReports.length > 0) {
                        setSavedReports(serverReports);
                        localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(serverReports));
                        return;
                    }
                }
            } catch {
                // Offline
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
            // Auto-Seed Rule: only for the 3 preset demo accounts (strict isolation)
            const presetAccount = DEMO_PRESET_DATA[userEmail];
            if (presetAccount && isEmptyStoredArray(`aperio_journal_${userEmail}`)) {
                setJournalEntries(presetAccount.journal);
                localStorage.setItem(`aperio_journal_${userEmail}`, JSON.stringify(presetAccount.journal));
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/api/journal/${encodeURIComponent(userEmail)}`);
                if (res.ok) {
                    const serverEntries = await res.json();
                    if (Array.isArray(serverEntries)) {
                        setJournalEntries(serverEntries);
                        localStorage.setItem(`aperio_journal_${userEmail}`, JSON.stringify(serverEntries));
                        return;
                    }
                }
            } catch {
                // Offline
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
                    await fetch('http://localhost:8000/api/history', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_email: userEmail,
                            id: latest.id,
                            date: latest.date,
                            label: latest.label,
                            results: latest.results
                        })
                    });
                } catch {
                    // Offline
                }
            }
        }
    };

    const handleSignIn = (email: string) => {
        setUserEmail(email);
        localStorage.setItem('aperio_current_user', email);
        localStorage.setItem(`aperio_last_active_${email}`, Date.now().toString());

        const storedProf = localStorage.getItem(`aperio_profile_${email}`);
        if (storedProf) {
            try {
                const parsed = JSON.parse(storedProf);
                setUserProfile(parsed);
                setIsOnboarding(!parsed.onboardingCompleted);
                if (parsed.language) setCurrentLang(parsed.language);
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

        if (userEmail) {
            localStorage.setItem(`aperio_profile_${userEmail}`, JSON.stringify(profile));

            try {
                await fetch('http://localhost:8000/api/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_email: userEmail,
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
                    })
                });
            } catch {
                // Offline
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
            setCurrentLang(profile.language);
        }

        setCurrentTab(targetTab);
    };

    const handleSaveProfile = async (updatedProfile: UserProfile) => {
        setUserProfile(updatedProfile);
        if (userEmail) {
            localStorage.setItem(`aperio_profile_${userEmail}`, JSON.stringify(updatedProfile));
            try {
                await fetch('http://localhost:8000/api/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_email: userEmail,
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
                    })
                });
            } catch {
                // Offline
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
            await fetch(`http://localhost:8000/api/profile/delete/${encodeURIComponent(userEmail)}`, {
                method: 'DELETE'
            });
        } catch {
            // Offline
        }

        localStorage.removeItem(`aperio_profile_${userEmail}`);
        localStorage.removeItem(`aperio_history_${userEmail}`);
        localStorage.removeItem(`aperio_journal_${userEmail}`);
        localStorage.removeItem(`aperio_last_active_${userEmail}`);

        handleSignOut();
    };

    const handleSaveReport = (newReport: SavedReport) => {
        const updated = [newReport, ...savedReports];
        persistReports(updated);
    };

    const handleClearHistory = async () => {
        setSavedReports([]);
        if (userEmail) {
            localStorage.removeItem(`aperio_history_${userEmail}`);
            try {
                await fetch(`http://localhost:8000/api/history/${encodeURIComponent(userEmail)}`, {
                    method: 'DELETE'
                });
            } catch {
                // Offline
            }
        }
    };

    const handleDeleteSingleReport = async (reportId: string) => {
        const updated = savedReports.filter((r) => r.id !== reportId);
        setSavedReports(updated);
        if (userEmail) {
            localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(updated));
            try {
                await fetch(
                    `http://localhost:8000/api/history/${encodeURIComponent(userEmail)}/report/${encodeURIComponent(reportId)}`,
                    { method: 'DELETE' }
                );
            } catch {
                // Offline
            }
        }
    };

    const handleDeleteSingleTest = async (reportId: string, testId: string) => {
        const updated = savedReports
            .map((r) => {
                if (r.id !== reportId) return r;
                const filtered = r.results.filter((res) => res.testId !== testId);
                return { ...r, results: filtered };
            })
            .filter((r) => r.results.length > 0);

        setSavedReports(updated);
        if (userEmail) {
            localStorage.setItem(`aperio_history_${userEmail}`, JSON.stringify(updated));
            try {
                await fetch(
                    `http://localhost:8000/api/history/${encodeURIComponent(userEmail)}/result/${encodeURIComponent(reportId)}/${encodeURIComponent(testId)}`,
                    { method: 'DELETE' }
                );
            } catch {
                // Offline
            }
        }
    };

    // Journal Handlers
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
                await fetch('http://localhost:8000/api/journal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newEntry)
                });
            } catch {
                // Offline
            }
        }
    };

    const handleDeleteJournalEntry = async (id: string) => {
        const updated = journalEntries.filter((e) => e.id !== id);
        setJournalEntries(updated);
        if (userEmail) {
            localStorage.setItem(`aperio_journal_${userEmail}`, JSON.stringify(updated));
            try {
                await fetch(`http://localhost:8000/api/journal/${encodeURIComponent(id)}`, {
                    method: 'DELETE'
                });
            } catch {
                // Offline
            }
        }
    };

    // Extraction Callback
    const handleReportExtracted = (
        results: TestResult[],
        sourceLabel: string,
        rawText: string,
        cvQuality: CVQualityData | null,
        mlInsights: MLInsightsData | null
    ) => {
        setCurrentParsedResults(results);
        setCurrentSourceLabel(sourceLabel);
        setCurrentRawText(rawText);
        setCurrentCvQuality(cvQuality);
        setCurrentMlInsights(mlInsights);
        setCurrentTab('analyze');
    };

    const handleBatchReportsExtracted = (reports: ExtractedReportItem[]) => {
        if (!reports || reports.length === 0) return;

        // Save extracted visits into savedReports and persist to SQLite /api/history
        const newReports: SavedReport[] = reports.map((rep, idx) => ({
            id: `rep-${Date.now()}-${idx}`,
            date: rep.date || new Date().toISOString().split('T')[0],
            label: rep.sourceLabel,
            results: rep.results
        }));

        const updatedHistory = [...newReports, ...savedReports];
        persistReports(updatedHistory);

        // Load primary/latest report into active AnalyzeView state
        const primary = reports[0];
        setCurrentParsedResults(primary.results);
        setCurrentSourceLabel(primary.sourceLabel);
        setCurrentRawText(primary.rawText);
        setCurrentCvQuality(primary.cvQuality);
        setCurrentMlInsights(primary.mlInsights);

        // Redirect to Dashboard (if multi-report stack) or AnalyzeView (if single report)
        if (reports.length > 1) {
            setCurrentTab('dashboard');
        } else {
            setCurrentTab('analyze');
        }
    };

    // 1. Not Logged In -> Show Landing Page
    if (!userEmail) {
        return <LandingView onSignIn={handleSignIn} currentLang={currentLang} />;
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
            onLanguageChange={setCurrentLang}
            onSignOut={handleSignOut}
            savedReportsCount={savedReports.length}
            journalCount={journalEntries.length}
        >
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
                    userEmail={userEmail}
                    currentLang={currentLang}
                    onReportExtracted={handleReportExtracted}
                    onBatchReportsExtracted={handleBatchReportsExtracted}
                    onSaveToHistory={handleSaveReport}
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
                    cvQuality={currentCvQuality}
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
        </SidebarLayout>
    );
}

export default App;
