import React, { useMemo } from 'react';
import {
    FileSpreadsheet,
    LineChart,
    BookOpen,
    UploadCloud,
    ArrowRight,
    Activity,
    CheckCircle2,
    Calendar,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Minus,
    GitCompare
} from 'lucide-react';
import { SavedReport, JournalEntry, SidebarTab, SupportedLanguage, UserProfile } from '../types';
import { computeDeltaAnalysis } from '../utils/deltas';
import { getLocalizedTestName } from '../utils/language';
import { EkgMonitorCanvas } from './EkgMonitorCanvas';

interface DashboardViewProps {
    userEmail: string;
    userProfile?: UserProfile | null;
    savedReports: SavedReport[];
    journalEntries: JournalEntry[];
    onNavigate: (tab: SidebarTab) => void;
    currentLang: SupportedLanguage;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
    userEmail,
    userProfile,
    savedReports,
    journalEntries,
    onNavigate,
    currentLang
}) => {
    const displayName = userProfile?.fullName || (userEmail ? userEmail.split('@')[0] : 'Patient');

    // Calculate age from dateOfBirth if available
    const calculateAge = (dob?: string): number | null => {
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

    const userAge = calculateAge(userProfile?.dateOfBirth);

    // Aggregate statistics
    const totalReports = savedReports?.length || 0;
    const allUniqueTests = new Set<string>();
    let totalFlaggedBiomarkers = 0;

    savedReports?.forEach((r) => {
        r?.results?.forEach((res) => {
            if (res?.testId) {
                allUniqueTests.add(res.testId);
                if (res.classification !== 'Normal') {
                    totalFlaggedBiomarkers++;
                }
            }
        });
    });

    const activeMedsCount = journalEntries.filter((j) => j.entry_type === 'medication').length;
    const activeSuppsCount = journalEntries.filter((j) => j.entry_type === 'supplement').length;

    const latestReport = savedReports && savedReports.length > 0 ? savedReports[0] : null;
    const latestAbnormals = latestReport?.results
        ? latestReport.results.filter((r) => r && r.classification !== 'Normal')
        : [];

    // Delta Pulse executive summary (shared engine)
    const deltaAnalysis = useMemo(
        () => computeDeltaAnalysis(savedReports?.[1] ?? null, savedReports?.[0] ?? null),
        [savedReports]
    );

    const chronicConditionsList = useMemo(() => {
        if (!userProfile?.chronicConditions || userProfile.chronicConditions.length === 0) return [];
        return userProfile.chronicConditions.filter(
            (c) => c && !c.toLowerCase().includes('no known') && c.toLowerCase() !== 'none'
        );
    }, [userProfile?.chronicConditions]);

    return (
        <div className="space-y-6">
            {/* 1. Compact Welcome Banner (~130px height) */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl text-white shadow-md relative overflow-hidden border border-teal-900/40">
                    {/* TOP ZONE - greeting + ambient EKG (scoped to this zone) */}
                    <div className="relative p-4 sm:p-5 overflow-hidden">
                        <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
                            <EkgMonitorCanvas bpm={45} color="#2dd4bf" />
                        </div>

                        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-2">

                    {/* Left: Greeting + Demographic Chips */}
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                                Welcome back, <span className="text-teal-400">{displayName}</span>
                            </h1>

                            {/* Demographic Chips */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                {userAge !== null && (
                                    <span className="bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded-lg text-[11px] font-medium text-slate-200">
                                        {userAge} yrs
                                    </span>
                                )}
                                {userProfile?.gender && (
                                    <span className="bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded-lg text-[11px] font-medium text-slate-200">
                                        {userProfile.gender}
                                    </span>
                                )}
                                {userProfile?.bloodType && userProfile.bloodType !== 'Prefer not to say' && (
                                    <span className="bg-rose-950/60 border border-rose-800/50 text-rose-300 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                                        Blood: {userProfile.bloodType}
                                    </span>
                                )}
                                {chronicConditionsList.length > 0 && (
                                    <span className="bg-teal-950/70 border border-teal-800/50 text-teal-300 px-2 py-0.5 rounded-lg text-[11px] font-medium max-w-xs truncate">
                                        {chronicConditionsList.join(', ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                            Track blood biomarkers, monitor multi-test interactions, and log daily medications and lifestyle context in one secure dashboard.
                        </p>
                    </div>
                        </div>
                    </div>

                    {/* BOTTOM ZONE - primary actions, clear of the waveform */}
                    <div className="relative border-t border-white/10 bg-slate-950/50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-2.5">
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                        <button
                            onClick={() => onNavigate('upload')}
                            className="bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs transition-all inline-flex items-center space-x-1.5 rtl:space-x-reverse whitespace-nowrap w-full sm:w-auto"
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload New Report</span>
                        </button>

                        <button
                            onClick={() => onNavigate('journal')}
                            className="bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 font-bold text-xs py-2 px-3.5 rounded-xl transition-all inline-flex items-center space-x-1.5 rtl:space-x-reverse whitespace-nowrap w-full sm:w-auto"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Log Context</span>
                        </button>
                    </div>
                    </div>
                </div>

{/* 2. "Delta Pulse" Executive Strip */}
            {savedReports && savedReports.length >= 2 && deltaAnalysis ? (
                <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl p-3.5 sm:p-4 text-white shadow-md border border-slate-750/90 relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Left Info & Key Shifts */}
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20 flex-shrink-0">
                                    <GitCompare className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                                    Delta Pulse
                                </h2>
                                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                                    Visit-over-Visit
                                </span>
                                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                                <span className="text-xs text-slate-400">
                                    Latest Visit (<span className="text-teal-300 font-medium">{deltaAnalysis.latestDate}</span>) vs Previous (<span className="text-slate-300 font-medium">{deltaAnalysis.prevDate}</span>)
                                </span>
                            </div>

                            {/* Key Highlights: 2-3 most critical shifts */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Shifts:</span>
                                {deltaAnalysis.deltas.length > 0 ? (
                                    deltaAnalysis.deltas.slice(0, 3).map((d) => {
                                        const isVariance = d.status === 'variance';
                                        const isImproved = d.status === 'improved';
                                        return (
                                            <span
                                                key={d.testId}
                                                className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2 py-0.5 rounded-md text-xs font-medium border ${
                                                    isVariance
                                                        ? 'bg-rose-950/40 text-rose-200 border-rose-800/40'
                                                        : isImproved
                                                        ? 'bg-emerald-950/40 text-emerald-200 border-emerald-800/40'
                                                        : 'bg-slate-800/80 text-slate-300 border-slate-700'
                                                }`}
                                            >
                                                <span className="font-semibold text-white">{getLocalizedTestName(d.testId, currentLang)}:</span>
                                                <span className="font-mono text-[11px]">{d.prevValue} → {d.currValue} {d.unit}</span>
                                                <span className="text-[10px] font-bold">({d.arrow} {d.diffSign}{d.unit === '%' ? '' : ` ${d.unit}`})</span>
                                                {d.arrow === '↑' ? (
                                                    <TrendingUp className={`w-3 h-3 ${isVariance ? 'text-rose-400' : 'text-amber-400'}`} />
                                                ) : d.arrow === '↓' ? (
                                                    <TrendingDown className={`w-3 h-3 ${isImproved ? 'text-emerald-400' : 'text-teal-400'}`} />
                                                ) : (
                                                    <Minus className="w-3 h-3 text-slate-400" />
                                                )}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span className="text-xs text-slate-400">No overlapping biomarkers to calculate deltas.</span>
                                )}
                            </div>
                        </div>

                        {/* Right: Counter Badges & Actionable CTA */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-2.5 py-1 rounded-full font-medium text-[11px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>{deltaAnalysis.improvedCount} Improved</span>
                                </span>
                                <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-rose-950/60 border border-rose-800/60 text-rose-300 px-2.5 py-1 rounded-full font-medium text-[11px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                    <span>{deltaAnalysis.varianceCount} New Variances</span>
                                </span>
                                <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-full font-medium text-[11px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <span>{deltaAnalysis.stableCount} Stable</span>
                                </span>
                            </div>

                            <button
                                onClick={() => onNavigate('history')}
                                className="bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-bold text-xs py-1.5 px-3 rounded-xl shadow-xs transition-all inline-flex items-center space-x-1.5 rtl:space-x-reverse flex-shrink-0"
                            >
                                <span>View Full Breakdown</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Compact 1-line Card when < 2 reports saved */
                <div className="bg-slate-900/80 rounded-xl px-4 py-3 text-white border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse text-slate-300">
                        <GitCompare className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <span>
                            <strong className="text-white font-semibold">Delta Pulse:</strong> Upload a second report to unlock automatic visit-over-visit trajectory tracking and variance detection.
                        </span>
                    </div>
                    <button
                        onClick={() => onNavigate('upload')}
                        className="text-teal-400 hover:text-teal-300 font-bold text-xs inline-flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0"
                    >
                        <span>Upload Second Report</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* 3. 4 KPI Stat Widgets (supporting counts) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Reports Logged */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reports Logged</span>
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                            <FileSpreadsheet className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{totalReports}</div>
                    <div className="text-[11px] text-slate-400 font-medium">Total laboratory visits saved</div>
                </div>

                {/* Unique Biomarkers */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unique Biomarkers</span>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{allUniqueTests.size}</div>
                    <div className="text-[11px] text-slate-400 font-medium">Across 11 medical panel categories</div>
                </div>

                {/* Active Prescriptions */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Prescriptions</span>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <BookOpen className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{activeMedsCount + activeSuppsCount}</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                        {activeMedsCount} medication(s), {activeSuppsCount} supplement(s)
                    </div>
                </div>

                {/* Flagged Deviations */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Flagged Deviations</span>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <LineChart className="w-4 h-4" />
                        </div>
                    </div>
                    <div className={`text-2xl sm:text-3xl font-black tracking-tight ${totalFlaggedBiomarkers > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                        {totalFlaggedBiomarkers}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">Values outside standard reference bands</div>
                </div>
            </div>

            {/* 4. 2-Column Lower Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left (7 cols): Latest Report Snapshot */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Calendar className="w-4 h-4 text-teal-600" />
                            <h3 className="text-sm font-bold text-slate-900">Latest Report Overview</h3>
                        </div>
                        {latestReport && (
                            <button
                                onClick={() => onNavigate('analyze')}
                                className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center space-x-1 rtl:space-x-reverse"
                            >
                                <span>Open Full Analysis</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {latestReport ? (
                        <div className="space-y-3">
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-slate-900">{latestReport.label}</div>
                                    <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                                        <span>Date: {latestReport.date}</span>
                                        <span className="text-[10px] px-1.5 py-0.2 rounded font-black tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                                            {latestReport.sampleCondition?.toLowerCase() === 'non-fasting'
                                                ? 'Non-Fasting'
                                                : latestReport.sampleCondition?.toLowerCase() === 'post-exercise'
                                                ? 'Post-Workout'
                                                : 'Fasting'}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                    {latestReport.results.length} Tests Recorded
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-slate-600">Key Out-of-Range Markers:</div>
                                {latestAbnormals.length === 0 ? (
                                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs flex items-center space-x-2 rtl:space-x-reverse">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                        <span>All parameters in your latest report are within normal range.</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {latestAbnormals.slice(0, 4).map((r) => (
                                            <div
                                                key={r.testId}
                                                className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl text-xs flex items-center justify-between"
                                            >
                                                <span className="font-bold text-slate-800 truncate mr-2">
                                                    {getLocalizedTestName(r.testId, currentLang)}
                                                </span>
                                                <span className="font-mono font-bold text-rose-700 flex-shrink-0">
                                                    {r.measuredValue} {r.unit} ({r.classification})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 space-y-3">
                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <div className="text-xs font-bold text-slate-700">No laboratory reports saved yet</div>
                            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                                Upload your blood test or select an example report to populate your personal dashboard.
                            </p>
                            <button
                                onClick={() => onNavigate('upload')}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors"
                            >
                                Upload Report Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Right (5 cols): 3 Sleek Quick Navigation Cards */}
                <div className="lg:col-span-5 space-y-3">
                    <div
                        onClick={() => onNavigate('analyze')}
                        className="bg-white hover:bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 hover:border-teal-300 shadow-xs cursor-pointer transition-all duration-200 flex items-center justify-between group"
                    >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-105 transition-transform">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                                    Analyze &amp; Plain Language
                                </div>
                                <div className="text-[11px] text-slate-400">
                                    Review ML balance score &amp; range gauges
                                </div>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
                    </div>

                    <div
                        onClick={() => onNavigate('history')}
                        className="bg-white hover:bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs cursor-pointer transition-all duration-200 flex items-center justify-between group"
                    >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform">
                                <LineChart className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                    Biomarker Trajectory Trends
                                </div>
                                <div className="text-[11px] text-slate-400">
                                    Interactive Recharts graph with reference bands
                                </div>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                    </div>

                    <div
                        onClick={() => onNavigate('journal')}
                        className="bg-white hover:bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs cursor-pointer transition-all duration-200 flex items-center justify-between group"
                    >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    Medication &amp; Context Journal
                                </div>
                                <div className="text-[11px] text-slate-400">
                                    Log supplements, fasting &amp; lifestyle changes
                                </div>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

