import React, { useState, useMemo, useEffect } from 'react';
import {
    Printer,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Search,
    Filter,
    ShieldAlert,
    Clock,
    AlertCircle,
    Info,
    Layers,
    Check,
    Lightbulb,
    Save,
    Pill,
    HeartPulse,
    Upload
} from 'lucide-react';
import {
    TestResult,
    SupportedLanguage,
    SavedReport,
    SampleConditionType,
    UserProfile,
    JournalEntry,
    SidebarTab
} from '../types';
import { generateDoctorQuestions } from '../utils/questionGenerator';
import { findDrugInteractionsForBiomarker, MatchedDrugInteraction } from '../constants/drugInteractions';
import { SYMPTOMS, findSymptomPromptsForBiomarker, MatchedSymptomPrompt } from '../constants/symptoms';
import {
    getTranslation,
    getLocalizedTestName,
    getLocalizedCategory,
    getLocalizedExplanation
} from '../utils/language';
import { RangeGauge } from './RangeGauge';
import { exportDoctorSummaryPDF } from '../utils/pdfExport';
import { MLInsightsCard, MLInsightsData } from './MLInsightsCard';

interface AnalyzeViewProps {
    userEmail: string;
    parsedResults: TestResult[];
    sourceLabel: string;
    mlInsights: MLInsightsData | null;
    currentLang: SupportedLanguage;
    onSaveToHistory?: (report: SavedReport) => void;
    initialSampleCondition?: SampleConditionType;
    userProfile?: UserProfile | null;
    journalEntries?: JournalEntry[];
    onNavigateToUpload?: () => void;
    onNavigate?: (tab: SidebarTab) => void;
    onLoadSampleReport?: (sampleText: string, sampleLabel: string) => void;
}

type UrgencyQuickFilter = 'ALL' | 'NEEDS_ATTENTION' | 'IN_TARGET';

/**
 * Calculates urgency tier (1, 2, or 3) based on clinical classification and mathematical range deviation.
 * - Tier 1: Immediate Discussion (High Urgency) -> Doctor urgency or >30% deviation outside reference range.
 * - Tier 2: Worth Monitoring (Moderate Variance) -> Monitor urgency or mild boundary deviations.
 * - Tier 3: Optimal & Stable -> Normal reference range.
 */
export function getBiomarkerTier(result: TestResult): 1 | 2 | 3 {
    if (result.classification === 'Normal') {
        return 3;
    }

    const rangeWidth = Math.max(0.0001, result.referenceMax - result.referenceMin);
    let deviation = 0;
    if (result.classification === 'High') {
        deviation = (result.measuredValue - result.referenceMax) / rangeWidth;
    } else if (result.classification === 'Low') {
        deviation = (result.referenceMin - result.measuredValue) / rangeWidth;
    }

    if (result.urgency === 'Doctor' || deviation > 0.30) {
        return 1;
    }
    return 2;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
    userEmail,
    parsedResults,
    sourceLabel,
    mlInsights,
    currentLang,
    onSaveToHistory,
    initialSampleCondition,
    userProfile,
    journalEntries,
    onNavigateToUpload,
    onNavigate
}) => {
    const t = (key: string, params?: Record<string, string>): string =>
        getTranslation(key, currentLang, params);

    const [sampleCondition, setSampleCondition] = useState<SampleConditionType>(
        initialSampleCondition || 'fasting'
    );
    const [isSavedSuccess, setIsSavedSuccess] = useState(false);
    const [copyToastMessage, setCopyToastMessage] = useState<string | null>(null);

    const doctorQuestions = useMemo(() => {
        return generateDoctorQuestions(parsedResults, userProfile, journalEntries);
    }, [parsedResults, userProfile, journalEntries]);

    const handleCopyQuestions = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (doctorQuestions.length === 0) return;
        const formatted = doctorQuestions.map((q, idx) => `${idx + 1}. ${q}`).join('\n\n');
        navigator.clipboard.writeText(formatted);
        setCopyToastMessage(t('an.copiedToast'));
        setTimeout(() => setCopyToastMessage(null), 3000);
    };

    const [expandedExplanationMap, setExpandedExplanationMap] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        parsedResults.forEach((r) => {
            if (r.classification !== 'Normal') initial[r.testId] = true;
        });
        return initial;
    });

    useEffect(() => {
        const initial: Record<string, boolean> = {};
        parsedResults.forEach((r) => {
            if (r.classification !== 'Normal') initial[r.testId] = true;
        });
        setExpandedExplanationMap(initial);
        setExpandedDrugInteractions({});
        setSelectedSymptomIds([]);
    }, [parsedResults]);

    const [expandedDrugInteractions, setExpandedDrugInteractions] = useState<Record<string, boolean>>({});
    const [isSymptomBarExpanded, setIsSymptomBarExpanded] = useState(false);
    const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
    const [urgencyFilter, setUrgencyFilter] = useState<UrgencyQuickFilter>('ALL');

    // Tier accordion collapse states (all tiers collapsed by default - full overview first)
    const [tier1Expanded, setTier1Expanded] = useState(false);
    const [tier2Expanded, setTier2Expanded] = useState(false);
    const [tier3Expanded, setTier3Expanded] = useState(false);

    const toggleExplanation = (testId: string) => {
        setExpandedExplanationMap((prev) => ({
            ...prev,
            [testId]: !prev[testId]
        }));
    };

    const toggleDrugInteraction = (interactionKey: string) => {
        setExpandedDrugInteractions((prev) => ({
            ...prev,
            [interactionKey]: !prev[interactionKey]
        }));
    };

    const toggleSymptom = (symptomId: string) => {
        setSelectedSymptomIds((prev) =>
            prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]
        );
    };

    const handleUrgencyFilterChange = (filter: UrgencyQuickFilter) => {
        setUrgencyFilter(filter);
        if (filter === 'IN_TARGET') {
            setTier3Expanded(true);
        }
    };

    // Partition parsedResults into 3 urgency tiers
    const { allTier1, allTier2, allTier3 } = useMemo(() => {
        const t1: TestResult[] = [];
        const t2: TestResult[] = [];
        const t3: TestResult[] = [];

        parsedResults.forEach((r) => {
            const tier = getBiomarkerTier(r);
            if (tier === 1) t1.push(r);
            else if (tier === 2) t2.push(r);
            else t3.push(r);
        });

        return { allTier1: t1, allTier2: t2, allTier3: t3 };
    }, [parsedResults]);

    const availableCategories = useMemo(() => {
        const cats = new Set<string>();
        parsedResults.forEach((r) => cats.add(r.category));
        return Array.from(cats);
    }, [parsedResults]);

    // Matching helper for category and search filters
    const matchesFilter = (result: TestResult) => {
        if (selectedCategoryFilter === 'FLAGGED' && result.classification === 'Normal') {
            return false;
        }
        if (
            selectedCategoryFilter !== 'ALL' &&
            selectedCategoryFilter !== 'FLAGGED' &&
            result.category !== selectedCategoryFilter
        ) {
            return false;
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const localizedName = getLocalizedTestName(result.testId, currentLang).toLowerCase();
            const originalName = result.name.toLowerCase();
            const category = result.category.toLowerCase();
            return localizedName.includes(q) || originalName.includes(q) || category.includes(q);
        }

        return true;
    };

    // Filtered lists for each tier
    const filteredTier1 = useMemo(() => {
        if (urgencyFilter === 'IN_TARGET') return [];
        return allTier1.filter(matchesFilter);
    }, [allTier1, urgencyFilter, selectedCategoryFilter, searchQuery, currentLang]);

    const filteredTier2 = useMemo(() => {
        if (urgencyFilter === 'IN_TARGET') return [];
        return allTier2.filter(matchesFilter);
    }, [allTier2, urgencyFilter, selectedCategoryFilter, searchQuery, currentLang]);

    const filteredTier3 = useMemo(() => {
        if (urgencyFilter === 'NEEDS_ATTENTION') return [];
        return allTier3.filter(matchesFilter);
    }, [allTier3, urgencyFilter, selectedCategoryFilter, searchQuery, currentLang]);

    const totalVisibleTests = filteredTier1.length + filteredTier2.length + filteredTier3.length;
    const allNormal = parsedResults.length > 0 && parsedResults.every((r) => r.classification === 'Normal');
    const needsAttentionCount = allTier1.length + allTier2.length;
    const inTargetCount = allTier3.length;

    const handleSaveToHistory = () => {
        const reportToSave: SavedReport = {
            id: `rep-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            label: sourceLabel,
            results: parsedResults,
            sampleCondition: sampleCondition
        };
        if (onSaveToHistory) {
            onSaveToHistory(reportToSave);
            setIsSavedSuccess(true);
            setTimeout(() => setIsSavedSuccess(false), 3000);
        }
    };

    const handleExportDoctorSummary = () => {
        const reportToExport: SavedReport = {
            id: `summary-${Date.now()}`,
            date: new Date().toLocaleDateString(),
            label: sourceLabel,
            results: parsedResults,
            sampleCondition: sampleCondition
        };
        exportDoctorSummaryPDF(reportToExport, userEmail, currentLang, {
            userProfile,
            questions: doctorQuestions
        });
    };

    const renderClinicalContextChip = (testId: string) => {
        if (sampleCondition === 'non-fasting' && (testId === 'fbs' || testId === 'triglycerides')) {
            return (
                <div className="bg-indigo-50/90 border border-indigo-200/90 text-indigo-950 text-xs p-3 rounded-xl flex items-start space-x-2.5 rtl:space-x-reverse mt-2">
                    <Lightbulb className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold text-indigo-900">{t('an.postprandialTag')} </span>
                        {t('an.postprandialBody')}
                    </div>
                </div>
            );
        }

        if (sampleCondition === 'post-exercise' && (testId === 'ast' || testId === 'bun' || testId === 'creatinine')) {
            return (
                <div className="bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs p-3 rounded-xl flex items-start space-x-2.5 rtl:space-x-reverse mt-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold text-amber-900">{t('an.exerciseTag')} </span>
                        {t('an.exerciseBody')}
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderDrugInteractionChip = (result: TestResult) => {
        const interactions: MatchedDrugInteraction[] = findDrugInteractionsForBiomarker(
            result.testId,
            userProfile,
            journalEntries
        );

        if (interactions.length === 0) return null;

        return (
            <div className="space-y-2 mt-2">
                {interactions.map((interaction) => {
                    const interactionKey = `${result.testId}-${interaction.matchedDrugName}-${interaction.rule.drugClass}`;
                    const isExpanded = !!expandedDrugInteractions[interactionKey];

                    return (
                        <div
                            key={interactionKey}
                            onClick={() => toggleDrugInteraction(interactionKey)}
                            className="bg-purple-50/90 hover:bg-purple-100/90 border border-purple-200/90 text-purple-950 text-xs p-3 rounded-xl cursor-pointer transition-all shadow-2xs"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleDrugInteraction(interactionKey);
                                }
                            }}
                            aria-expanded={isExpanded}
                            aria-label={t('an.medContextAria', { summary: interaction.summaryText })}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-start sm:items-center space-x-2 rtl:space-x-reverse min-w-0">
                                    <Pill className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <div className="text-xs text-purple-950 leading-snug">
                                        <span className="font-extrabold text-purple-900">
                                            {t('an.medContextTag')}{' '}
                                        </span>
                                        <span className="font-semibold text-purple-950">
                                            {interaction.summaryText}{' '}
                                        </span>
                                        <span className="text-[11px] text-purple-700 font-medium whitespace-nowrap">
                                            ({isExpanded ? t('an.clickToCollapse') : t('an.clickForContext')})
                                        </span>
                                    </div>
                                </div>
                                <div className="text-purple-600 hover:text-purple-900 flex-shrink-0 flex items-center space-x-1 text-[11px] font-bold">
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="pt-2.5 mt-2 border-t border-purple-200/90 text-xs text-purple-900 leading-relaxed space-y-1.5 bg-purple-100/50 p-2.5 rounded-lg"
                                >
                                    <div>
                                        <span className="font-extrabold text-purple-950">{t('an.clinicalMechanism')} </span>
                                        <span>{interaction.rule.clinicalMechanism}</span>
                                    </div>
                                    <div className="pt-1.5 border-t border-purple-200/60">
                                        <span className="font-extrabold text-purple-950">{t('an.patientGuidance')} </span>
                                        <span>{interaction.rule.patientGuidance}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderSymptomPromptChip = (result: TestResult) => {
        const matchedPrompts: MatchedSymptomPrompt[] = findSymptomPromptsForBiomarker(
            result,
            selectedSymptomIds
        );

        if (matchedPrompts.length === 0) return null;

        return (
            <div className="space-y-2 mt-2">
                {matchedPrompts.map((prompt) => (
                    <div
                        key={`${result.testId}-${prompt.symptomId}`}
                        className="bg-sky-50/90 border border-sky-200/90 text-sky-950 text-xs p-3 rounded-xl flex items-start space-x-2.5 rtl:space-x-reverse shadow-2xs"
                    >
                        <span className="text-sm flex-shrink-0 mt-0.5">💬</span>
                        <div className="leading-relaxed">
                            <span className="font-extrabold text-sky-900">{t('an.discussionPromptTag')} </span>
                            <span className="font-medium text-sky-950">{prompt.promptText}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* 1. Unified Top Control Strip */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                {/* Left: Active Report Title & Biomarker Count */}
                <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-start space-x-2 rtl:space-x-reverse">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full flex-shrink-0 mt-0.5">
                            {t('an.activeReport')}
                        </span>
                        <h2
                            className="text-sm sm:text-base font-extrabold text-slate-900 line-clamp-2"
                            title={sourceLabel}
                        >
                            {sourceLabel}
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        {t('an.biomarkerSummary', { count: String(parsedResults.length) })}
                    </p>
                </div>

                {/* Center / Inline: Fasting / Non-Fasting / Post-Exercise 3-Pill Toggle */}
                {parsedResults.length > 0 && (
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 flex-wrap gap-y-1">
                        <button
                            onClick={() => setSampleCondition('fasting')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1 rtl:space-x-reverse ${
                                sampleCondition === 'fasting'
                                    ? 'bg-teal-700 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                            }`}
                        >
                            <Check className={`w-3 h-3 ${sampleCondition === 'fasting' ? 'opacity-100' : 'opacity-0'}`} />
                            <span>{t('an.fastingWindow')}</span>
                        </button>

                        <button
                            onClick={() => setSampleCondition('non-fasting')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1 rtl:space-x-reverse ${
                                sampleCondition === 'non-fasting'
                                    ? 'bg-indigo-700 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                            }`}
                        >
                            <Check className={`w-3 h-3 ${sampleCondition === 'non-fasting' ? 'opacity-100' : 'opacity-0'}`} />
                            <span>{t('dash.nonFasting')}</span>
                        </button>

                        <button
                            onClick={() => setSampleCondition('post-exercise')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1 rtl:space-x-reverse ${
                                sampleCondition === 'post-exercise'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                            }`}
                        >
                            <Check className={`w-3 h-3 ${sampleCondition === 'post-exercise' ? 'opacity-100' : 'opacity-0'}`} />
                            <span>{t('dash.postWorkout')}</span>
                        </button>
                    </div>
                )}

                {/* Right: Actions (stacked vertically to keep the title readable) */}
                {parsedResults.length > 0 && (
                    <div className="flex flex-col items-stretch sm:items-end gap-2 flex-shrink-0">
                        {onSaveToHistory && (
                            <button
                                onClick={handleSaveToHistory}
                                className={`text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all inline-flex items-center space-x-1.5 rtl:space-x-reverse active:scale-95 whitespace-nowrap ${
                                    isSavedSuccess
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                                }`}
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>{isSavedSuccess ? t('an.savedToHistory') : t('an.saveReport')}</span>
                            </button>
                        )}

                        <button
                            onClick={handleExportDoctorSummary}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all inline-flex items-center space-x-1.5 rtl:space-x-reverse active:scale-95 whitespace-nowrap"
                        >
                            <Printer className="w-3.5 h-3.5 text-teal-400" />
                            <span>{t('an.downloadPdf')}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Experiencing Symptoms Today? (Optional) Collapsible Horizontal Pill Bar */}
            {parsedResults.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
                    <div
                        onClick={() => setIsSymptomBarExpanded(!isSymptomBarExpanded)}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsSymptomBarExpanded(!isSymptomBarExpanded);
                            }
                        }}
                        aria-expanded={isSymptomBarExpanded}
                    >
                        <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                            <HeartPulse className="w-4 h-4 text-rose-500 flex-shrink-0" />
                            <div className="flex items-center space-x-2 rtl:space-x-reverse flex-wrap">
                                <span className="text-xs font-bold text-slate-900">
                                    {t('an.symptomsQuestion')}
                                </span>
                                {selectedSymptomIds.length > 0 ? (
                                    <span className="text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full">
                                        {t('an.symptomCountActive', { count: String(selectedSymptomIds.length) })}
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                                        • {t('an.symptomsHint')}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2.5 rtl:space-x-reverse flex-shrink-0">
                            {selectedSymptomIds.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSymptomIds([]);
                                    }}
                                    className="text-[11px] font-bold text-slate-500 hover:text-rose-600 px-2 py-0.5 rounded-lg hover:bg-rose-50 transition-colors"
                                >
                                    {t('an.clearSelection')}
                                </button>
                            )}
                            <div className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                                <span className="hidden sm:inline">{isSymptomBarExpanded ? t('an.collapse') : t('an.select')}</span>
                                {isSymptomBarExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-slate-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-500" />
                                )}
                            </div>
                        </div>
                    </div>

                    {isSymptomBarExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-[11px] text-slate-500 font-medium mb-3">
                                {t('an.symptomsHelp')}
                            </p>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse flex-wrap gap-y-2">
                                {SYMPTOMS.map((symptom) => {
                                    const isSelected = selectedSymptomIds.includes(symptom.id);
                                    return (
                                        <button
                                            key={symptom.id}
                                            onClick={() => toggleSymptom(symptom.id)}
                                            className={`px-3 py-1.5 rounded-xl text-xs transition-all inline-flex items-center space-x-1.5 rtl:space-x-reverse ${
                                                isSelected
                                                    ? 'bg-sky-700 text-white font-extrabold shadow-xs border border-sky-800'
                                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 font-semibold'
                                            }`}
                                            title={symptom.description}
                                        >
                                            <span>{symptom.icon}</span>
                                            <span>{symptom.name}</span>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-white ml-0.5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {parsedResults.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs my-6">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                        <Layers className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-base font-extrabold text-slate-900">{t('an.noReportTitle')}</div>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                            {t('an.noReportDesc')}
                        </p>
                    </div>
                    {(onNavigateToUpload || onNavigate) && (
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (onNavigateToUpload) {
                                        onNavigateToUpload();
                                    } else if (onNavigate) {
                                        onNavigate('upload');
                                    }
                                }}
                                className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-xs transition-all active:scale-95"
                            >
                                <Upload className="w-4 h-4" />
                                <span>{t('dash.ctaUploadNow')}</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* 2. Collapsible Clinical Intelligence Deck */}
                    <MLInsightsCard
                        mlInsights={mlInsights}
                        defaultExpanded={false}
                        doctorQuestions={doctorQuestions}
                        onCopyQuestions={handleCopyQuestions}
                        currentLang={currentLang}
                    />

                    {/* Toast notification for copying */}
                    {copyToastMessage && (
                        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-teal-300 border border-teal-500/40 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 rtl:space-x-reverse text-xs font-bold animate-bounce">
                            <Check className="w-4 h-4 text-teal-400" />
                            <span>{copyToastMessage}</span>
                        </div>
                    )}

                    {/* All Clear Confirmation Message */}
                    {allNormal && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-5 flex items-start space-x-3 rtl:space-x-reverse shadow-xs">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-sm text-emerald-950 mb-1">
                                    {t('an.allNormalHeading')}
                                </h3>
                                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                                    {getTranslation('allClearMessage', currentLang)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 3. Unified Filter Toolbar */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            {/* Urgency Segmented Tabs */}
                            <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-100 p-1 rounded-2xl border border-slate-200/80 flex-wrap gap-y-1">
                                <button
                                    onClick={() => handleUrgencyFilterChange('ALL')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1.5 rtl:space-x-reverse ${
                                        urgencyFilter === 'ALL'
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <span>{t('an.filterAll')}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                        urgencyFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        {parsedResults.length}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleUrgencyFilterChange('NEEDS_ATTENTION')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1.5 rtl:space-x-reverse ${
                                        urgencyFilter === 'NEEDS_ATTENTION'
                                            ? 'bg-rose-600 text-white shadow-xs'
                                            : 'text-rose-700 hover:bg-rose-50'
                                    }`}
                                >
                                    <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                    <span>{t('an.filterNeedsAttention')}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                        urgencyFilter === 'NEEDS_ATTENTION' ? 'bg-rose-700 text-rose-100' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                        {needsAttentionCount}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleUrgencyFilterChange('IN_TARGET')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1.5 rtl:space-x-reverse ${
                                        urgencyFilter === 'IN_TARGET'
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'text-emerald-700 hover:bg-emerald-50'
                                    }`}
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{t('an.filterInTarget')}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                        urgencyFilter === 'IN_TARGET' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                        {inTargetCount}
                                    </span>
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative min-w-[240px]">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('an.searchPlaceholder')}
                                    aria-label={t('an.searchAria')}
                                    className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Row 2: Category Filter Chips */}
                        <div className="flex items-center space-x-1.5 rtl:space-x-reverse overflow-x-auto pb-1 text-xs">
                            <span className="text-slate-400 font-bold flex items-center mr-1 flex-shrink-0">
                                <Filter className="w-3.5 h-3.5 mr-1" />
                                {t('an.categoryColon')}
                            </span>
                            <button
                                onClick={() => setSelectedCategoryFilter('ALL')}
                                className={`px-3 py-1 rounded-xl font-bold transition-colors whitespace-nowrap ${
                                    selectedCategoryFilter === 'ALL'
                                        ? 'bg-teal-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {t('an.allWithCount', { count: String(parsedResults.length) })}
                            </button>
                            <button
                                onClick={() => setSelectedCategoryFilter('FLAGGED')}
                                className={`px-3 py-1 rounded-xl font-bold transition-colors whitespace-nowrap ${
                                    selectedCategoryFilter === 'FLAGGED'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-rose-700 hover:bg-slate-200'
                                }`}
                            >
                                {t('an.flaggedOnlyWithCount', { count: String(parsedResults.filter((r) => r.classification !== 'Normal').length) })}
                            </button>
                            {availableCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategoryFilter(cat)}
                                    className={`px-3 py-1 rounded-xl font-bold transition-colors whitespace-nowrap ${
                                        selectedCategoryFilter === cat
                                            ? 'bg-teal-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {getLocalizedCategory(cat, currentLang)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* No matching results fallback */}
                    {totalVisibleTests === 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-2">
                            <Info className="w-6 h-6 text-slate-400 mx-auto" />
                            <div className="text-xs font-bold text-slate-700">{t('an.noMatchesTitle')}</div>
                            <p className="text-[11px] text-slate-500">
                                {t('an.noMatchesDesc')}
                            </p>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TIER 1: IMMEDIATE DISCUSSION (HIGH URGENCY)                               */}
                    {/* ========================================================================= */}
                    {filteredTier1.length > 0 && (
                        <div className="space-y-4">
                            {/* Tier 1 Section Header */}
                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-0.5">
                                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                                        <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                                            <ShieldAlert className="w-3.5 h-3.5" />
                                        </div>
                                        <h3 className="text-sm sm:text-base font-extrabold text-rose-950">
                                            {t('an.tier1Title')}
                                        </h3>
                                        <span className="bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
                                            {t('an.tierConcerns', { count: String(filteredTier1.length) })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-rose-800/90 font-medium pl-8.5 rtl:pl-0 rtl:pr-8.5">
                                        {t('an.tier1Sub')}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setTier1Expanded(!tier1Expanded)}
                                    className="self-end sm:self-center text-xs font-bold text-rose-800 hover:text-rose-950 bg-rose-100/80 hover:bg-rose-200/80 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors inline-flex items-center space-x-1 rtl:space-x-reverse"
                                >
                                    <span>{tier1Expanded ? t('an.collapse') : t('an.expand')}</span>
                                    {tier1Expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Tier 1 Full Cards */}
                            {tier1Expanded && (
                                <div className="space-y-4">
                                    {filteredTier1.map((result) => {
                                        const isDoctor = result.urgency === 'Doctor';
                                        const isExpanded = !!expandedExplanationMap[result.testId];
                                        const translatedTestName = getLocalizedTestName(result.testId, currentLang);
                                        const translatedCategory = getLocalizedCategory(result.category, currentLang);
                                        const translatedExplanation = getLocalizedExplanation(
                                            result.testId,
                                            result.classification,
                                            currentLang
                                        );

                                        return (
                                            <div
                                                key={result.testId}
                                                className="bg-white rounded-2xl border border-rose-300 ring-1 ring-rose-200/60 transition-all shadow-xs overflow-hidden"
                                            >
                                                <div className="p-4 sm:p-5 space-y-3.5">
                                                    {/* Result Header Row */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        <div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200/80">
                                                                {translatedCategory}
                                                            </span>
                                                            <h3 className="text-base font-bold text-slate-900 mt-1">
                                                                {translatedTestName}
                                                            </h3>
                                                        </div>

                                                        {/* Value & Classification Badges */}
                                                        <div className="flex items-center space-x-3 rtl:space-x-reverse flex-wrap gap-y-2">
                                                            <div className="text-right rtl:text-left">
                                                                <div className="text-xl font-black text-rose-950">
                                                                    {result.measuredValue}{' '}
                                                                    <span className="text-xs font-medium text-slate-500">
                                                                        {result.unit}
                                                                    </span>
                                                                </div>
                                                                <div className="text-[11px] text-slate-500 font-medium" dir="ltr">
                                                                    {t('an.rangeLine', { min: String(result.referenceMin), max: String(result.referenceMax), unit: result.unit })}
                                                                </div>
                                                            </div>

                                                            {/* Status Badge */}
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                                    result.classification === 'High'
                                                                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                                                                        : 'bg-amber-100/90 text-amber-900 border-amber-300/80 font-bold'
                                                                }`}
                                                            >
                                                                {result.classification === 'High' &&
                                                                    getTranslation('highBadge', currentLang)}
                                                                {result.classification === 'Low' &&
                                                                    getTranslation('lowBadge', currentLang)}
                                                            </span>

                                                            {/* Urgency Badge */}
                                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 rtl:space-x-reverse bg-rose-600 text-white shadow-xs">
                                                                <ShieldAlert className="w-3.5 h-3.5" />
                                                                <span>
                                                                    {isDoctor
                                                                        ? getTranslation('doctorBadge', currentLang)
                                                                        : t('an.priorityDiscussion')}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Visual Reference Range Gauge */}
                                                    <RangeGauge
                                                        value={result.measuredValue}
                                                        min={result.referenceMin}
                                                        max={result.referenceMax}
                                                        unit={result.unit}
                                                        classification={result.classification}
                                                        currentLang={currentLang}
                                                    />

                                                    {/* Value Correction Safeguard Alert */}
                                                    {result.isAutoCorrected && (
                                                        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-xl flex items-start space-x-2 rtl:space-x-reverse">
                                                            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <span className="font-bold">{t('an.autoCorrectTag')} </span>
                                                                {getTranslation('correctedValueAlert', currentLang, {
                                                                    original: String(result.originalValue),
                                                                    corrected: String(result.measuredValue)
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Reference Range Override Alert */}
                                                    {result.rangeOverridden && (
                                                        <div className="bg-slate-100 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl flex items-start space-x-2 rtl:space-x-reverse">
                                                            <Info className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                {getTranslation('rangeOverriddenAlert', currentLang)}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Dynamic Clinical Context Chip */}
                                                    {renderClinicalContextChip(result.testId)}

                                                    {/* 💊 Active Medication Safety Cross-Examiner Inline Badge / Expandable Chip */}
                                                    {renderDrugInteractionChip(result)}

                                                    {/* 💬 Guardrailed Symptom-to-Lab Discussion Prompt Chip */}
                                                    {renderSymptomPromptChip(result)}

                                                    {/* Plain Language Biomarker Explanation Dropdown */}
                                                    <div className="pt-2 border-t border-slate-100">
                                                        <button
                                                            onClick={() => toggleExplanation(result.testId)}
                                                            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-rose-700 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                                                        >
                                                            <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                                                                <Info className="w-3.5 h-3.5 text-rose-600" />
                                                                <span>
                                                                    {getTranslation('explanationLabel', currentLang)} —{' '}
                                                                    <span className="font-medium text-slate-500">
                                                                        {t('an.whySignificant')}
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-4 h-4 text-slate-400" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                                            )}
                                                        </button>

                                                        {isExpanded && (
                                                            <div className="mt-2 p-3.5 rounded-xl border text-xs leading-relaxed space-y-2 bg-rose-50/70 border-rose-200 text-rose-950">
                                                                <p>{translatedExplanation}</p>
                                                                <div className="pt-2 font-semibold text-rose-700 border-t border-rose-200/80 flex items-center space-x-1.5 rtl:space-x-reverse">
                                                                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                                                                    <span>
                                                                        {getTranslation('doctorClosingGuidance', currentLang)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TIER 2: WORTH MONITORING (MODERATE VARIANCE)                              */}
                    {/* ========================================================================= */}
                    {filteredTier2.length > 0 && (
                        <div className="space-y-4">
                            {/* Tier 2 Section Header */}
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-0.5">
                                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                                        <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                                            <Clock className="w-3.5 h-3.5" />
                                        </div>
                                        <h3 className="text-sm sm:text-base font-extrabold text-amber-950">
                                            {t('an.tier2Title')}
                                        </h3>
                                        <span className="bg-amber-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
                                            {t('an.tierMarkers', { count: String(filteredTier2.length) })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-amber-900/90 font-medium pl-8.5 rtl:pl-0 rtl:pr-8.5">
                                        {t('an.tier2Sub')}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setTier2Expanded(!tier2Expanded)}
                                    className="self-end sm:self-center text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100/80 hover:bg-amber-200/80 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors inline-flex items-center space-x-1 rtl:space-x-reverse"
                                >
                                    <span>{tier2Expanded ? t('an.collapse') : t('an.expand')}</span>
                                    {tier2Expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Tier 2 Full Cards */}
                            {tier2Expanded && (
                                <div className="space-y-4">
                                    {filteredTier2.map((result) => {
                                        const isExpanded = !!expandedExplanationMap[result.testId];
                                        const translatedTestName = getLocalizedTestName(result.testId, currentLang);
                                        const translatedCategory = getLocalizedCategory(result.category, currentLang);
                                        const translatedExplanation = getLocalizedExplanation(
                                            result.testId,
                                            result.classification,
                                            currentLang
                                        );

                                        return (
                                            <div
                                                key={result.testId}
                                                className="bg-white rounded-2xl border border-amber-250 ring-1 ring-amber-200/50 transition-all shadow-xs overflow-hidden"
                                            >
                                                <div className="p-4 sm:p-5 space-y-3.5">
                                                    {/* Result Header Row */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        <div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/80">
                                                                {translatedCategory}
                                                            </span>
                                                            <h3 className="text-base font-bold text-slate-900 mt-1">
                                                                {translatedTestName}
                                                            </h3>
                                                        </div>

                                                        {/* Value & Classification Badges */}
                                                        <div className="flex items-center space-x-3 rtl:space-x-reverse flex-wrap gap-y-2">
                                                            <div className="text-right rtl:text-left">
                                                                <div className="text-xl font-black text-amber-950">
                                                                    {result.measuredValue}{' '}
                                                                    <span className="text-xs font-medium text-slate-500">
                                                                        {result.unit}
                                                                    </span>
                                                                </div>
                                                                <div className="text-[11px] text-slate-500 font-medium" dir="ltr">
                                                                    {t('an.rangeLine', { min: String(result.referenceMin), max: String(result.referenceMax), unit: result.unit })}
                                                                </div>
                                                            </div>

                                                            {/* Status Badge */}
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                                    result.classification === 'High'
                                                                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                                                                        : 'bg-amber-100/90 text-amber-900 border-amber-300/80 font-bold'
                                                                }`}
                                                            >
                                                                {result.classification === 'High' &&
                                                                    getTranslation('highBadge', currentLang)}
                                                                {result.classification === 'Low' &&
                                                                    getTranslation('lowBadge', currentLang)}
                                                            </span>

                                                            {/* Urgency Badge */}
                                                            <span className="px-2.5 py-1 rounded-full text-[11px] flex items-center space-x-1 rtl:space-x-reverse bg-amber-100/90 text-amber-900 border border-amber-300/80 font-bold">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                <span>{getTranslation('monitorBadge', currentLang)}</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Visual Reference Range Gauge */}
                                                    <RangeGauge
                                                        value={result.measuredValue}
                                                        min={result.referenceMin}
                                                        max={result.referenceMax}
                                                        unit={result.unit}
                                                        classification={result.classification}
                                                        currentLang={currentLang}
                                                    />

                                                    {/* Value Correction Safeguard Alert */}
                                                    {result.isAutoCorrected && (
                                                        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-xl flex items-start space-x-2 rtl:space-x-reverse">
                                                            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <span className="font-bold">{t('an.autoCorrectTag')} </span>
                                                                {getTranslation('correctedValueAlert', currentLang, {
                                                                    original: String(result.originalValue),
                                                                    corrected: String(result.measuredValue)
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Reference Range Override Alert */}
                                                    {result.rangeOverridden && (
                                                        <div className="bg-slate-100 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl flex items-start space-x-2 rtl:space-x-reverse">
                                                            <Info className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                {getTranslation('rangeOverriddenAlert', currentLang)}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Dynamic Clinical Context Chip */}
                                                    {renderClinicalContextChip(result.testId)}

                                                    {/* 💊 Active Medication Safety Cross-Examiner Inline Badge / Expandable Chip */}
                                                    {renderDrugInteractionChip(result)}

                                                    {/* 💬 Guardrailed Symptom-to-Lab Discussion Prompt Chip */}
                                                    {renderSymptomPromptChip(result)}

                                                    {/* Plain Language Biomarker Explanation Dropdown */}
                                                    <div className="pt-2 border-t border-slate-100">
                                                        <button
                                                            onClick={() => toggleExplanation(result.testId)}
                                                            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-amber-700 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                                                        >
                                                            <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                                                                <Info className="w-3.5 h-3.5 text-amber-600" />
                                                                <span>
                                                                    {getTranslation('explanationLabel', currentLang)} —{' '}
                                                                    <span className="font-medium text-slate-500">
                                                                        {t('an.whySlight')}
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-4 h-4 text-slate-400" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                                            )}
                                                        </button>

                                                        {isExpanded && (
                                                            <div className="mt-2 p-3.5 rounded-xl border text-xs leading-relaxed space-y-2 bg-amber-50/70 border-amber-200 text-amber-950">
                                                                <p>{translatedExplanation}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TIER 3: OPTIMAL & STABLE (COLLAPSED COMPACT ACCORDION)                    */}
                    {/* ========================================================================= */}
                    {filteredTier3.length > 0 && (
                        <div className="space-y-3">
                            {/* Accordion Trigger Header: Height & Clutter Guard */}
                            <button
                                onClick={() => setTier3Expanded(!tier3Expanded)}
                                className="w-full bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left rtl:text-right transition-colors"
                            >
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse flex-wrap">
                                            <h3 className="text-sm sm:text-base font-extrabold text-emerald-950">
                                                ✅ {t('an.tier3Heading', { count: String(filteredTier3.length) })}
                                            </h3>
                                            <span className="bg-emerald-200/80 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {t('an.tier3Badge')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-emerald-800 font-medium mt-0.5">
                                            {t('an.tier3Hint', { action: tier3Expanded ? t('an.collapse').toLowerCase() : t('an.expand').toLowerCase() })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 rtl:space-x-reverse self-end sm:self-center">
                                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl border border-emerald-200 inline-flex items-center space-x-1.5 rtl:space-x-reverse">
                                        <span>{tier3Expanded ? t('an.collapseRows') : t('an.expandRows')}</span>
                                        {tier3Expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </span>
                                </div>
                            </button>

                            {/* Tier 3 Single-Line Compact Rows */}
                            {tier3Expanded && (
                                <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-2">
                                    {filteredTier3.map((result) => {
                                        const isExpanded = !!expandedExplanationMap[result.testId];
                                        const translatedTestName = getLocalizedTestName(result.testId, currentLang);
                                        const translatedCategory = getLocalizedCategory(result.category, currentLang);
                                        const translatedExplanation = getLocalizedExplanation(
                                            result.testId,
                                            result.classification,
                                            currentLang
                                        );

                                        return (
                                            <div
                                                key={result.testId}
                                                className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl p-3 sm:px-4 sm:py-2.5 transition-colors space-y-2"
                                            >
                                                {/* Single Compact Line */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    {/* Test Name & Category */}
                                                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                                                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 flex-shrink-0">
                                                             {translatedCategory}
                                                        </span>
                                                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                                            {translatedTestName}
                                                        </span>
                                                    </div>

                                                    {/* Value, Range & Status Pill */}
                                                    <div className="flex items-center space-x-3 rtl:space-x-reverse flex-wrap gap-y-1 justify-between sm:justify-end">
                                                        <span className="text-[11px] text-slate-500 font-medium" dir="ltr">
                                                            {t('an.targetLine', { min: String(result.referenceMin), max: String(result.referenceMax), unit: result.unit })}
                                                        </span>

                                                        <div className="text-xs sm:text-sm font-black text-slate-900" dir="ltr">
                                                            {result.measuredValue}{' '}
                                                            <span className="text-[11px] font-medium text-slate-500">
                                                                {result.unit}
                                                            </span>
                                                        </div>

                                                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                                                            {getTranslation('normalBadge', currentLang)}
                                                        </span>

                                                        {/* Mini info button to toggle healthy explanation */}
                                                        <button
                                                            onClick={() => toggleExplanation(result.testId)}
                                                            className="text-slate-400 hover:text-teal-700 p-1 rounded-md hover:bg-white transition-colors"
                                                            title={t('an.toggleExplanationAria')}
                                                            aria-label={t('an.toggleExplanationAria')}
                                                        >
                                                            <Info className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Dynamic Clinical Context Chip for compact rows */}
                                                {renderClinicalContextChip(result.testId)}

                                                {/* 💊 Active Medication Safety Cross-Examiner Inline Badge / Expandable Chip */}
                                                {renderDrugInteractionChip(result)}

                                                {/* 💬 Guardrailed Symptom-to-Lab Discussion Prompt Chip */}
                                                {renderSymptomPromptChip(result)}

                                                {/* Compact Inline Explanation (if toggled) */}
                                                {isExpanded && (
                                                    <div className="pt-2 mt-1 border-t border-slate-200/60 text-xs text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-lg">
                                                        {translatedExplanation}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


