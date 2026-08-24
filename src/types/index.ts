export type ClassificationType = 'Normal' | 'High' | 'Low';
export type UrgencyType = 'Normal' | 'Monitor' | 'Doctor';

export interface TestResult {
    testId: string; // references CatalogEntry.id
    name: string;
    category: string;
    measuredValue: number;
    unit: string;
    referenceMin: number;
    referenceMax: number;
    classification: ClassificationType;
    urgency: UrgencyType;
    explanation: string;
    isAutoCorrected?: boolean;
    originalValue?: number;
    rangeOverridden?: boolean;
rangeSource?: string;
}

export type SampleConditionType = 'fasting' | 'non-fasting' | 'post-exercise';

export interface SavedReport {
    id: string;
    date: string;
    label: string;
    results: TestResult[];
    sampleCondition?: SampleConditionType;
}

export interface CatalogEntry {
    id: string;
    name: string;
    category: string;
    min: number;
    max: number;
    unit: string;
    explanations: {
        low: string; // English
        high: string; // English
    };
}

export type SupportedLanguage =
    | 'en'
    | 'hi' // Hindi
    | 'mr' // Marathi
    | 'bn' // Bengali
    | 'te' // Telugu
    | 'ta' // Tamil
    | 'gu' // Gujarati
    | 'es' // Spanish
    | 'fr' // French
    | 'zh'; // Mandarin Chinese

export interface LanguageConfig {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    dir: 'ltr' | 'rtl';
}

export type SidebarTab =
    | 'dashboard'
    | 'upload'
    | 'analyze'
    | 'history'
    | 'journal'
    | 'about'
    | 'profile';

export interface JournalEntry {
    id: string;
    user_email: string;
    entry_type: 'medication' | 'supplement' | 'lifestyle';
    name: string;
    dosage?: string;
    start_date?: string;
    notes?: string;
    created_at?: string;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Prefer not to say';
export type GenderType = 'Male' | 'Female' | 'Prefer not to say';
export type MeasurementUnitPreference = 'Conventional' | 'Metric';

export interface UserProfile {
    fullName: string;
    dateOfBirth: string;
    gender: GenderType | '';
    email: string;
    bloodType: BloodType | '';
    language: SupportedLanguage;
    measurementUnits: MeasurementUnitPreference;
    chronicConditions: string[];
    otherChronicConditions?: string;
    medications: string;
    allergies: string;
    timezone?: string;
    phoneNumber?: string;
    primaryDoctorName?: string;
    primaryDoctorContact?: string;
    lastLogin?: string;
    consentEducation: boolean;
    consentPrivacy: boolean;
    onboardingCompleted: boolean;
    completedAt?: string;
}
