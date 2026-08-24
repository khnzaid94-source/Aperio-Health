import React, { useState, useMemo } from 'react';
import {
    Calendar,
    LineChart as LineChartIcon,
    Trash2,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Info,
    AlertTriangle,
    CheckCircle2,
    X,
    GitCompare,
    TrendingUp,
    TrendingDown,
    Minus,
    LayoutGrid,
    Table,
    Upload
} from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceArea,
    ReferenceLine
} from 'recharts';
import { SavedReport, SupportedLanguage, SidebarTab } from '../types';
import { computeDeltaAnalysis } from '../utils/deltas';
import {
    getTranslation,
    getLocalizedTestName,
    getLocalizedExplanation,
    generateRetrospectiveTrendSummary
} from '../utils/language';
import { CATALOG_INDEX } from '../constants/catalog';

interface HistoryAndTrendsProps {
    currentLang: SupportedLanguage;
    savedReports: SavedReport[];
    onClearHistory: () => void;
    onDeleteSingleReport: (reportId: string) => void;
    onDeleteSingleTest: (reportId: string, testId: string) => void;
    onNavigateToUpload?: () => void;
    onNavigate?: (tab: SidebarTab) => void;
}

export const HistoryAndTrends: React.FC<HistoryAndTrendsProps> = ({
    currentLang,
    savedReports,
    onClearHistory,
    onDeleteSingleReport,
    onDeleteSingleTest,
    onNavigateToUpload,
    onNavigate
}) => {
    const [expandedReportIds, setExpandedReportIds] = useState<Record<string, boolean>>({});
    const [selectedTrendTestId, setSelectedTrendTestId] = useState<string>('');
    const [activeView, setActiveView] = useState<'charts' | 'compare'>('charts');
    const [compareSubView, setCompareSubView] = useState<'cards' | 'table'>('cards');
    const [deltaFilter, setDeltaFilter] = useState<'all' | 'improved' | 'variance' | 'stable'>('all');
    const [selectedReportAId, setSelectedReportAId] = useState<string>('');
    const [selectedReportBId, setSelectedReportBId] = useState<string>('');
    const [showClearConfirmModal, setShowClearConfirmModal] = useState<boolean>(false);
    const [deleteReportTarget, setDeleteReportTarget] = useState<string | null>(null);
    const [deleteTestTarget, setDeleteTestTarget] = useState<{ reportId: string; testId: string; testName: string } | null>(null);

    const getDistance = (val: number, min: number, max: number) => {
        if (typeof val !== 'number' || isNaN(val)) return 0;
        if (typeof min !== 'number' || isNaN(min)) return 0;
        if (typeof max !== 'number' || isNaN(max)) return 0;
        if (val < min) return min - val;
        if (val > max) return val - max;
        return 0;
    };

    // Default dropdowns to Visit A = Previous Report (savedReports[1]) and Visit B = Latest Report (savedReports[0])
    const activeReportAId = useMemo(() => {
        if (selectedReportAId && savedReports.some(r => r.id === selectedReportAId)) {
            return selectedReportAId;
        }
        if (savedReports.length >= 2) {
            return savedReports[1].id;
        }
        return savedReports[0]?.id || '';
    }, [selectedReportAId, savedReports]);

    const activeReportBId = useMemo(() => {
        if (selectedReportBId && savedReports.some(r => r.id === selectedReportBId)) {
            return selectedReportBId;
        }
        return savedReports[0]?.id || '';
    }, [selectedReportBId, savedReports]);

    const reportA = useMemo(() => {
        return savedReports.find(r => r.id === activeReportAId);
    }, [savedReports, activeReportAId]);

    const reportB = useMemo(() => {
        return savedReports.find(r => r.id === activeReportBId);
    }, [savedReports, activeReportBId]);

    // Delta Analysis between Visit A (Baseline/Previous) and Visit B (Follow-up/Latest)
    const isSelfComparison = Boolean(activeReportAId) && activeReportAId === activeReportBId;

    const deltaAnalysis = useMemo(() => {
        if (!reportA || !reportB || isSelfComparison) return null;
        return computeDeltaAnalysis(reportA, reportB);
    }, [reportA, reportB, isSelfComparison]);

    const filteredDeltas = useMemo(() => {
        if (!deltaAnalysis) return [];
        if (deltaFilter === 'all') return deltaAnalysis.deltas;
        return deltaAnalysis.deltas.filter((d) => d.status === deltaFilter);
    }, [deltaAnalysis, deltaFilter]);

    const uniqueBiomarkerIds = useMemo(() => {
        if (!reportA || !reportB) return [];
        const ids = new Set<string>();
        reportA.results.forEach(r => { if (r?.testId) ids.add(r.testId); });
        reportB.results.forEach(r => { if (r?.testId) ids.add(r.testId); });
        
        const catalogIdsOrder = Array.from(CATALOG_INDEX.keys());
        return Array.from(ids).sort((a, b) => {
            const indexA = catalogIdsOrder.indexOf(a);
            const indexB = catalogIdsOrder.indexOf(b);
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }, [reportA, reportB]);

    const toggleReportExpansion = (id: string) => {
        setExpandedReportIds((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Calculate eligible tests for trend tracking (appears in 2+ saved reports)
    const eligibleTrendTests = useMemo(() => {
        const testCounts: Record<string, number> = {};
        savedReports.forEach((rep) => {
            rep.results.forEach((r) => {
                testCounts[r.testId] = (testCounts[r.testId] || 0) + 1;
            });
        });

        return Object.entries(testCounts)
            .filter(([_, count]) => count >= 2)
            .map(([testId]) => testId);
    }, [savedReports]);

    const activeTrendTestId =
        selectedTrendTestId || (eligibleTrendTests.length > 0 ? eligibleTrendTests[0] : '');

    // Prepare chart data for active trend test (sorted oldest to newest)
    const chartData = useMemo(() => {
        if (!activeTrendTestId) return [];

        const points: { date: string; value: number; classification: string; rawDate: string }[] = [];

        const sortedReports = [...savedReports].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        sortedReports.forEach((rep) => {
            const match = rep.results.find((r) => r.testId === activeTrendTestId);
            if (match && typeof match.measuredValue === 'number' && Number.isFinite(match.measuredValue)) {
                points.push({
                    date: rep.date,
                    rawDate: rep.date,
                    value: match.measuredValue,
                    classification: match.classification
                });
            }
        });

        return points;
    }, [savedReports, activeTrendTestId]);

    const activeTestCatalog = useMemo(() => {
        return CATALOG_INDEX.get(activeTrendTestId);
    }, [activeTrendTestId]);

    const trendSummary = useMemo(() => {
        if (chartData.length < 2 || !activeTestCatalog) return '';

        const first = chartData[0];
        const latest = chartData[chartData.length - 1];
        const testName = getLocalizedTestName(activeTrendTestId, currentLang);

        return generateRetrospectiveTrendSummary(
            testName,
            first.value,
            latest.value,
            activeTestCatalog.min,
            activeTestCatalog.max,
            activeTestCatalog.unit,
            currentLang
        );
    }, [chartData, activeTestCatalog, activeTrendTestId, currentLang]);

    const handleClearClick = () => {
        setShowClearConfirmModal(true);
    };

    const handleDeleteReport = (e: React.MouseEvent, reportId: string) => {
        e.stopPropagation();
        setDeleteReportTarget(reportId);
    };

    const handleDeleteTest = (reportId: string, testId: string, testName: string) => {
        setDeleteTestTarget({ reportId, testId, testName });
    };

    return (
        <div className="space-y-8">
            {savedReports.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                        <LineChartIcon className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-slate-900">
                            {getTranslation('emptyHistoryTitle', currentLang)}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
                            {getTranslation('emptyHistorySubtitle', currentLang)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (onNavigateToUpload) {
                                onNavigateToUpload();
                            } else if (onNavigate) {
                                onNavigate('upload');
                            }
                        }}
                        className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold py-3 px-6 rounded-xl shadow-lg shadow-teal-500/20 transition-all text-xs sm:text-sm transform hover:scale-[1.02]"
                    >
                        <Upload className="w-4 h-4" />
                        <span>📤 Upload First Lab Report</span>
                    </button>
                </div>
            ) : (
                <>
                    {/* Primary ReUI Segmented Pill Navigation Switcher */}
                    <div className="flex justify-center sm:justify-start">
                        <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex items-center gap-1.5 border border-slate-200/80 shadow-inner">
                            <button
                                type="button"
                                onClick={() => setActiveView('charts')}
                                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 ${
                                    activeView === 'charts'
                                        ? 'bg-white text-teal-700 shadow-sm border border-slate-200/60'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                }`}
                            >
                                <LineChartIcon className="w-4 h-4" />
                                <span>📈 Time-Series Trends</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveView('compare')}
                                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 ${
                                    activeView === 'compare'
                                        ? 'bg-white text-teal-700 shadow-sm border border-slate-200/60'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                }`}
                            >
                                <GitCompare className="w-4 h-4" />
                                <span>⚖️ Compare Two Visits</span>
                            </button>
                        </div>
                    </div>

                    {/* Time-Series Charts View */}
                    {activeView === 'charts' ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                                        <LineChartIcon className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        {getTranslation('trendChartTitle', currentLang)}
                                    </h2>
                                </div>

                                {eligibleTrendTests.length > 0 && (
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <label className="text-xs font-semibold text-slate-600">
                                            {getTranslation('selectTestForTrend', currentLang)}
                                        </label>
                                        <select
                                            value={activeTrendTestId}
                                            onChange={(e) => setSelectedTrendTestId(e.target.value)}
                                            aria-label="Select lab test parameter to view trend graph"
                                            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            {eligibleTrendTests.map((tId) => (
                                                <option key={tId} value={tId}>
                                                    {getLocalizedTestName(tId, currentLang)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {eligibleTrendTests.length === 0 ? (
                                <div className="bg-slate-50 border border-slate-200 text-slate-600 text-xs p-6 rounded-xl text-center space-y-2">
                                    <Info className="w-5 h-5 text-teal-600 mx-auto" />
                                    <p>{getTranslation('noTrendAvailable', currentLang)}</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {activeTestCatalog && chartData.length >= 2 && (
                                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                                            <div className="h-64 sm:h-72 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                                                        <YAxis
                                                            domain={[
                                                                Math.min(
                                                                    activeTestCatalog.min * 0.7,
                                                                    ...chartData.map((d) => d.value)
                                                                ) * 0.9,
                                                                Math.max(
                                                                    activeTestCatalog.max * 1.3,
                                                                    ...chartData.map((d) => d.value)
                                                                ) * 1.1
                                                            ]}
                                                            tick={{ fontSize: 11, fill: '#64748b' }}
                                                        />
                                                        <Tooltip
                                                            content={({ active, payload }) => {
                                                                if (active && payload && payload.length) {
                                                                    const data = payload[0].payload;
                                                                    return (
                                                                        <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-md space-y-1">
                                                                            <div className="font-bold">{data.date}</div>
                                                                            <div>
                                                                                Value:{' '}
                                                                                <span className="font-bold text-teal-300">
                                                                                    {data.value} {activeTestCatalog.unit}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-[10px] text-slate-300">
                                                                                Normal Range: {activeTestCatalog.min} – {activeTestCatalog.max}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            }}
                                                        />
                                                        <ReferenceArea
                                                            y1={activeTestCatalog.min}
                                                            y2={activeTestCatalog.max}
                                                            fill="#10b981"
                                                            fillOpacity={0.12}
                                                        />
                                                        <ReferenceLine
                                                            y={activeTestCatalog.min}
                                                            stroke="#059669"
                                                            strokeDasharray="3 3"
                                                            label={{
                                                                value: `Min (${activeTestCatalog.min})`,
                                                                position: 'insideBottomLeft',
                                                                fill: '#059669',
                                                                fontSize: 10
                                                            }}
                                                        />
                                                        <ReferenceLine
                                                            y={activeTestCatalog.max}
                                                            stroke="#059669"
                                                            strokeDasharray="3 3"
                                                            label={{
                                                                value: `Max (${activeTestCatalog.max})`,
                                                                position: 'insideTopLeft',
                                                                fill: '#059669',
                                                                fontSize: 10
                                                            }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="value"
                                                            stroke="#0d9488"
                                                            strokeWidth={3}
                                                            dot={{ r: 6, fill: '#0d9488', stroke: '#ffffff', strokeWidth: 2 }}
                                                            activeDot={{ r: 8 }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="text-[11px] text-slate-500 text-center mt-2 flex items-center justify-center space-x-2">
                                                <span className="w-3 h-3 bg-emerald-200 border border-emerald-400 rounded-xs inline-block" />
                                                <span>Highlighted band indicates the normal reference range</span>
                                            </div>
                                        </div>
                                    )}

                                    {trendSummary && (
                                        <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-4 space-y-1">
                                            <div className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                                                {getTranslation('trendWrittenSummaryHeader', currentLang)}
                                            </div>
                                            <p className="text-xs text-teal-900 leading-relaxed font-medium">
                                                {trendSummary}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : savedReports.length < 2 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center max-w-2xl mx-auto space-y-6">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900">At least 2 saved lab reports are required to compare visits.</h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
                                    Please upload another blood test report in the Upload section to enable comparative analysis and trajectory tracking.
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Compare Two Visits View */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                            {/* Header & Sub-view Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                                        <GitCompare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">
                                            Dual-Report Side-by-Side Comparison Workspace
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Compare clinical biomarker changes between baseline and follow-up lab visits.
                                        </p>
                                    </div>
                                </div>

                                {/* Sub-toggle in header: [ 🎴 Visual Delta Cards ] (Default) vs [ 📊 Clinical Table ] */}
                                <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => setCompareSubView('cards')}
                                        className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            compareSubView === 'cards'
                                                ? 'bg-white text-teal-700 shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <LayoutGrid className="w-3.5 h-3.5" />
                                        <span>🎴 Visual Delta Cards</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCompareSubView('table')}
                                        className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            compareSubView === 'table'
                                                ? 'bg-white text-teal-700 shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Table className="w-3.5 h-3.5" />
                                        <span>📊 Clinical Table</span>
                                    </button>
                                </div>
                            </div>

                            {/* Visit Selector Dropdowns (Defaults: Visit A = Previous Report, Visit B = Latest Report) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Visit A (Previous Report / Baseline)
                                    </label>
                                    <select
                                        value={activeReportAId}
                                        onChange={(e) => setSelectedReportAId(e.target.value)}
                                        aria-label="Select Visit A Baseline Report"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        {savedReports.map((rep, idx) => (
                                            <option key={rep.id} value={rep.id}>
                                                {rep.label} {idx === 1 ? '(Previous Report)' : idx === 0 ? '(Latest Report)' : ''} — {rep.date || 'Unknown Date'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Visit B (Latest Report / Follow-up)
                                    </label>
                                    <select
                                        value={activeReportBId}
                                        onChange={(e) => setSelectedReportBId(e.target.value)}
                                        aria-label="Select Visit B Follow-up Report"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        {savedReports.map((rep, idx) => (
                                            <option key={rep.id} value={rep.id}>
                                                {rep.label} {idx === 0 ? '(Latest Report)' : idx === 1 ? '(Previous Report)' : ''} — {rep.date || 'Unknown Date'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {isSelfComparison && (
                                <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-center font-bold flex items-center justify-center space-x-2">
                                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                    <span>
                                        You've selected the same visit for both sides. Pick two different dates above to see meaningful biomarker changes.
                                    </span>
                                </div>
                            )}

                            {/* Sub-View Mode 1: Visual Delta Cards */}
                            {compareSubView === 'cards' ? (
                                <div className="space-y-5">
                                    {/* Plain-Language Summary Box */}
                                    <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 space-y-3 shadow-md">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <Sparkles className="w-4 h-4 text-teal-400" />
                                                <span className="text-xs sm:text-sm font-bold text-slate-100">
                                                    Visit-over-Visit Plain-Language Summary
                                                </span>
                                            </div>
                                            {deltaAnalysis && (
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-2.5 py-0.5 rounded-full font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                        <span>{deltaAnalysis.improvedCount} Improved</span>
                                                    </span>
                                                    <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-rose-950/60 border border-rose-800/60 text-rose-300 px-2.5 py-0.5 rounded-full font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                        <span>{deltaAnalysis.varianceCount} New Variances</span>
                                                    </span>
                                                    <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                        <span>{deltaAnalysis.stableCount} Stable</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <ul className="space-y-1.5 text-xs text-slate-300">
                                            {deltaAnalysis && deltaAnalysis.improvedCount > 0 && (
                                                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                                    <span>
                                                        <strong className="text-emerald-300 font-semibold">{deltaAnalysis.improvedCount}</strong> biomarker{deltaAnalysis.improvedCount === 1 ? '' : 's'} improved toward healthy targets.
                                                    </span>
                                                </li>
                                            )}
                                            {deltaAnalysis && deltaAnalysis.varianceCount > 0 && (
                                                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                                                    <span>
                                                        <strong className="text-rose-300 font-semibold">{deltaAnalysis.varianceCount}</strong> new variance{deltaAnalysis.varianceCount === 1 ? '' : 's'} detected.
                                                    </span>
                                                </li>
                                            )}
                                            {deltaAnalysis && deltaAnalysis.stableCount > 0 && (
                                                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                                                    <span>
                                                        <strong className="text-slate-200 font-semibold">{deltaAnalysis.stableCount}</strong> biomarker{deltaAnalysis.stableCount === 1 ? '' : 's'} remained steady within normal reference boundaries.
                                                    </span>
                                                </li>
                                            )}
                                            {!isSelfComparison && (!deltaAnalysis || deltaAnalysis.totalCompared === 0) && (
                                                <li className="text-slate-400 text-xs">
                                                    No overlapping biomarkers found between the selected visits to calculate deltas.
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Status Filter Tabs */}
                                    {deltaAnalysis && deltaAnalysis.totalCompared > 0 && (
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setDeltaFilter('all')}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                                    deltaFilter === 'all'
                                                        ? 'bg-teal-600 text-white shadow-xs'
                                                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                                                }`}
                                            >
                                                All ({deltaAnalysis.totalCompared})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeltaFilter('improved')}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                                    deltaFilter === 'improved'
                                                        ? 'bg-emerald-600 text-white shadow-xs'
                                                        : 'bg-slate-100 text-emerald-700 hover:text-emerald-800 border border-slate-200'
                                                }`}
                                            >
                                                🟢 Improved ({deltaAnalysis.improvedCount})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeltaFilter('variance')}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                                    deltaFilter === 'variance'
                                                        ? 'bg-rose-600 text-white shadow-xs'
                                                        : 'bg-slate-100 text-rose-700 hover:text-rose-800 border border-slate-200'
                                                }`}
                                            >
                                                🔴 New Variances ({deltaAnalysis.varianceCount})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeltaFilter('stable')}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                                    deltaFilter === 'stable'
                                                        ? 'bg-slate-700 text-white shadow-xs'
                                                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                                                }`}
                                            >
                                                ⚪ Stable ({deltaAnalysis.stableCount})
                                            </button>
                                        </div>
                                    )}

                                    {/* Complete Directional Delta Card Grid with Reference Bands */}
                                    {filteredDeltas.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                            {filteredDeltas.map((d) => {
                                                const isImproved = d.status === 'improved';
                                                const isVariance = d.status === 'variance';

                                                const min = d.referenceMin;
                                                const max = d.referenceMax;
                                                const valA = d.prevValue;
                                                const valB = d.currValue;

                                                const spanMin = Math.min(min * 0.8, valA * 0.8, valB * 0.8);
                                                const spanMax = Math.max(max * 1.2, valA * 1.2, valB * 1.2);
                                                const range = spanMax - spanMin || 1;

                                                const bandLeft = Math.max(0, Math.min(100, ((min - spanMin) / range) * 100));
                                                const bandRight = Math.max(0, Math.min(100, ((max - spanMin) / range) * 100));
                                                const bandWidth = Math.max(3, bandRight - bandLeft);

                                                const posA = Math.max(3, Math.min(97, ((valA - spanMin) / range) * 100));
                                                const posB = Math.max(3, Math.min(97, ((valB - spanMin) / range) * 100));

                                                return (
                                                    <div
                                                        key={d.testId}
                                                        className={`rounded-xl p-4 transition-all border ${
                                                            isImproved
                                                                ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                                                                : isVariance
                                                                ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                                                                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                                                        } flex flex-col justify-between space-y-3`}
                                                    >
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="font-bold text-sm text-slate-900 tracking-tight">
                                                                    {getLocalizedTestName(d.testId, currentLang)}
                                                                </span>
                                                                <span
                                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                                        isImproved
                                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                                            : isVariance
                                                                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                                                                            : 'bg-slate-100 text-slate-700 border-slate-200'
                                                                    }`}
                                                                >
                                                                    {isImproved ? '🟢 Improved' : isVariance ? '🔴 New Variance' : '⚪ Stable'}
                                                                </span>
                                                            </div>

                                                            {/* Directional Pill with Values */}
                                                            <div
                                                                className={`font-mono text-xs font-bold px-2.5 py-2 rounded-lg border flex items-center justify-between gap-2 ${
                                                                    isImproved
                                                                        ? 'bg-emerald-100/60 text-emerald-900 border-emerald-200'
                                                                        : isVariance
                                                                        ? 'bg-rose-100/60 text-rose-900 border-rose-200'
                                                                        : 'bg-white text-slate-800 border-slate-200 shadow-2xs'
                                                                }`}
                                                            >
                                                                <span className="truncate">
                                                                    <span className="text-slate-600 font-semibold mr-1">
                                                                        {getLocalizedTestName(d.testId, currentLang)}:
                                                                    </span>
                                                                    <span>{d.formattedTransition}</span>
                                                                </span>
                                                                {d.arrow === '↑' ? (
                                                                    <TrendingUp className={`w-3.5 h-3.5 flex-shrink-0 ${isVariance ? 'text-rose-600' : 'text-amber-600'}`} />
                                                                ) : d.arrow === '↓' ? (
                                                                    <TrendingDown className={`w-3.5 h-3.5 flex-shrink-0 ${isImproved ? 'text-emerald-600' : 'text-teal-600'}`} />
                                                                ) : (
                                                                    <Minus className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                                                                )}
                                                            </div>

                                                            {/* Visual Reference Band Indicator */}
                                                            <div className="space-y-1 pt-1">
                                                                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                                                                    <span>Target Range:</span>
                                                                    <span className="font-bold text-slate-700">{min} – {max} {d.unit}</span>
                                                                </div>
                                                                <div className="relative h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden border border-slate-200/80">
                                                                    {/* Normal Reference Band */}
                                                                    <div
                                                                        className="absolute top-0 bottom-0 bg-emerald-300/80 border-x border-emerald-400"
                                                                        style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
                                                                    />
                                                                    {/* Visit A Marker */}
                                                                    <div
                                                                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-600 border border-white z-10"
                                                                        style={{ left: `${posA}%` }}
                                                                        title={`Visit A: ${valA}`}
                                                                    />
                                                                    {/* Visit B Marker */}
                                                                    <div
                                                                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white z-20 ${
                                                                            isImproved ? 'bg-emerald-600' : isVariance ? 'bg-rose-600' : 'bg-teal-600'
                                                                        }`}
                                                                        style={{ left: `${posB}%` }}
                                                                        title={`Visit B: ${valB}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                                                            <span className="text-slate-700 font-medium truncate w-full" title={d.explanation}>
                                                                {d.explanation}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                                            <p className="text-xs text-slate-600 font-medium">
                                                {deltaAnalysis && deltaAnalysis.totalCompared === 0
                                                    ? 'No overlapping biomarkers found between the selected visits to calculate deltas.'
                                                    : `No biomarkers matching the "${deltaFilter}" filter.`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Sub-View Mode 2: Clinical Table (5-column ledger) */
                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left rtl:text-right border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                                                    <th className="py-3 px-4">Biomarker & Category</th>
                                                    <th className="py-3 px-4">Visit A <span className="text-[10px] text-slate-400 font-normal">({reportA?.date || 'Unknown Date'})</span></th>
                                                    <th className="py-3 px-4">Visit B <span className="text-[10px] text-slate-400 font-normal">({reportB?.date || 'Unknown Date'})</span></th>
                                                    <th className="py-3 px-4">Net Delta & % Change</th>
                                                    <th className="py-3 px-4">Trajectory Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                                                {uniqueBiomarkerIds.map((testId) => {
                                                    const catalogItem = CATALOG_INDEX.get(testId);
                                                    const resultA = reportA?.results.find(r => r.testId === testId);
                                                    const resultB = reportB?.results.find(r => r.testId === testId);

                                                    const testName = getLocalizedTestName(testId, currentLang);
                                                    const categoryName = resultB?.category || resultA?.category || catalogItem?.category || 'General';

                                                    // Visit A Value Safety Check
                                                    const hasA = !!resultA && typeof resultA.measuredValue === 'number' && !isNaN(resultA.measuredValue);
                                                    const valA = resultA?.measuredValue ?? 0;
                                                    const unitA = resultA?.unit ?? catalogItem?.unit ?? '';
                                                    const classA = resultA?.classification ?? 'Normal';

                                                    // Visit B Value Safety Check
                                                    const hasB = !!resultB && typeof resultB.measuredValue === 'number' && !isNaN(resultB.measuredValue);
                                                    const valB = resultB?.measuredValue ?? 0;
                                                    const unitB = resultB?.unit ?? catalogItem?.unit ?? '';
                                                    const classB = resultB?.classification ?? 'Normal';

                                                    // Trajectory computation & safety checks
                                                    let trajectory: 'Improved' | 'Elevated' | 'Stable' | 'Single Visit' = 'Single Visit';
                                                    let deltaText = '—';
                                                    let deltaPillColor = 'bg-slate-50 text-slate-400 border-slate-150';

                                                    if (hasA && hasB) {
                                                        const min = typeof resultB!.referenceMin === 'number' ? resultB!.referenceMin : (catalogItem?.min ?? 0);
                                                        const max = typeof resultB!.referenceMax === 'number' ? resultB!.referenceMax : (catalogItem?.max ?? 100);

                                                        const prevDist = getDistance(valA, min, max);
                                                        const currDist = getDistance(valB, min, max);

                                                        const crossedOver = (valA < min && valB > max) || (valA > max && valB < min);

                                                        let status: 'Improved' | 'Elevated' | 'Stable' = 'Stable';

                                                        if (crossedOver) {
                                                            status = 'Elevated';
                                                        } else if (prevDist === 0 && currDist === 0) {
                                                            status = 'Stable';
                                                        } else if (prevDist > 0 && currDist === 0) {
                                                            status = 'Improved';
                                                        } else if (prevDist > 0 && currDist > 0 && currDist < prevDist - 0.0001) {
                                                            status = 'Improved';
                                                        } else if (prevDist === 0 && currDist > 0) {
                                                            status = 'Elevated';
                                                        } else if (prevDist > 0 && currDist > 0 && currDist > prevDist + 0.0001) {
                                                            status = 'Elevated';
                                                        } else {
                                                            status = 'Stable';
                                                        }

                                                        trajectory = status;

                                                        const diff = valB - valA;
                                                        const percent = valA !== 0 ? (diff / valA) * 100 : 0;
                                                        const formattedDelta = Number(Math.abs(diff).toFixed(2));
                                                        const formattedPercent = Number(Math.abs(percent).toFixed(1));

                                                        if (diff > 0.0001) {
                                                            deltaText = `↑ +${formattedDelta} ${unitB} (+${formattedPercent}%)`;
                                                        } else if (diff < -0.0001) {
                                                            deltaText = `↓ -${formattedDelta} ${unitB} (-${formattedPercent}%)`;
                                                        } else {
                                                            deltaText = `No Change (0%)`;
                                                        }

                                                        if (trajectory === 'Improved') {
                                                            deltaPillColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                                        } else if (trajectory === 'Elevated') {
                                                            deltaPillColor = 'bg-rose-50 text-rose-700 border-rose-200';
                                                        } else {
                                                            deltaPillColor = 'bg-slate-100 text-slate-700 border-slate-300';
                                                        }
                                                    }

                                                    return (
                                                        <tr key={testId} className="hover:bg-slate-50/80 transition-colors">
                                                            {/* 1. Biomarker & Category */}
                                                            <td className="py-3 px-4 font-bold text-slate-800">
                                                                <div>{testName}</div>
                                                                <div className="text-[10px] text-slate-400 font-normal">{categoryName}</div>
                                                            </td>

                                                            {/* 2. Visit A Value ("Not Tested" Guard) */}
                                                            <td className="py-3 px-4 font-medium">
                                                                {hasA ? (
                                                                    <div className="space-y-0.5">
                                                                        <div className="font-semibold text-slate-900">{valA} {unitA}</div>
                                                                        <div className={`text-[10px] font-bold ${
                                                                            classA === 'High' ? 'text-rose-600' : classA === 'Low' ? 'text-amber-600' : 'text-emerald-600'
                                                                        }`}>
                                                                            {classA}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-slate-400 font-medium italic">— Not Tested</span>
                                                                )}
                                                            </td>

                                                            {/* 3. Visit B Value ("Not Tested" Guard) */}
                                                            <td className="py-3 px-4 font-medium">
                                                                {hasB ? (
                                                                    <div className="space-y-0.5">
                                                                        <div className="font-semibold text-slate-900">{valB} {unitB}</div>
                                                                        <div className={`text-[10px] font-bold ${
                                                                            classB === 'High' ? 'text-rose-600' : classB === 'Low' ? 'text-amber-600' : 'text-emerald-600'
                                                                        }`}>
                                                                            {classB}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-slate-400 font-medium italic">— Not Tested</span>
                                                                )}
                                                            </td>

                                                            {/* 4. Net Delta & % Change */}
                                                            <td className="py-3 px-4 font-medium">
                                                                {hasA && hasB ? (
                                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${deltaPillColor}`}>
                                                                        {deltaText}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-slate-400 font-medium italic">—</span>
                                                                )}
                                                            </td>

                                                            {/* 5. Trajectory Status */}
                                                            <td className="py-3 px-4 font-bold">
                                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                                    trajectory === 'Improved'
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                        : trajectory === 'Elevated'
                                                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                                        : trajectory === 'Stable'
                                                                        ? 'bg-slate-50 text-slate-700 border-slate-200'
                                                                        : 'bg-slate-50/50 text-slate-400 border-slate-150'
                                                                }`}>
                                                                    {trajectory === 'Single Visit' ? 'Not Tested Both' : trajectory}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Saved Reports Timeline List */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 rtl:space-x-reverse">
                                <Calendar className="w-5 h-5 text-teal-600" />
                                <span>{getTranslation('historyListHeader', currentLang)}</span>
                            </h2>

                            <button
                                type="button"
                                onClick={handleClearClick}
                                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{getTranslation('clearHistoryButton', currentLang)}</span>
                            </button>
                        </div>

                        {/* List of Saved Reports */}
                        <div className="space-y-4">
                            {savedReports.map((report) => {
                                const isExpanded = !!expandedReportIds[report.id];
                                const abnormalCount = report.results.filter(
                                    (r) => r.classification !== 'Normal'
                                ).length;

                                return (
                                    <div
                                        key={report.id}
                                        className="border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-all shadow-xs"
                                    >
                                        {/* Header / Summary Bar */}
                                        <div
                                            onClick={() => toggleReportExpansion(report.id)}
                                            className="w-full bg-slate-50 hover:bg-slate-100/80 p-4 text-left rtl:text-right flex items-center justify-between transition-colors cursor-pointer"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {report.label}
                                                    </span>
                                                    <span className="text-[11px] font-medium text-slate-500">
                                                        {report.date}
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.2 rounded font-black tracking-wider bg-slate-200/80 text-slate-700 border border-slate-300/80">
                                                        {report.sampleCondition?.toLowerCase() === 'non-fasting' ? 'Non-Fasting' : report.sampleCondition?.toLowerCase() === 'post-exercise' ? 'Post-Workout' : 'Fasting'}
                                                    </span>
                                                </div>

                                                <div className="text-xs">
                                                    {abnormalCount > 0 ? (
                                                        <span className="font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center space-x-1 rtl:space-x-reverse">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            <span>
                                                                {getTranslation('historyItemsCount', currentLang, {
                                                                    count: String(abnormalCount)
                                                                })}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center space-x-1 rtl:space-x-reverse">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            <span>{getTranslation('historyAllNormal', currentLang)}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                {/* Delete Single Report Button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteReport(e, report.id)}
                                                    title="Delete this report"
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <div className="p-1 text-slate-400">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Results Breakdown */}
                                        {isExpanded && (
                                            <div className="p-5 bg-white border-t border-slate-200 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {report.results.map((res) => {
                                                        const isAbnormal = res.classification !== 'Normal';
                                                        const translatedName = getLocalizedTestName(
                                                            res.testId,
                                                            currentLang
                                                        );
                                                        const translatedExp = getLocalizedExplanation(
                                                            res.testId,
                                                            res.classification,
                                                            currentLang
                                                        );

                                                        return (
                                                            <div
                                                                key={res.testId}
                                                                className={`p-3.5 rounded-xl border text-xs space-y-2 relative group ${
                                                                    isAbnormal
                                                                        ? 'bg-amber-50/40 border-amber-200'
                                                                        : 'bg-slate-50/50 border-slate-200'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between font-bold text-slate-800">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span>{translatedName}</span>
                                                                        {/* Delete Single Test Result Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteTest(
                                                                                    report.id,
                                                                                    res.testId,
                                                                                    translatedName
                                                                                )
                                                                            }
                                                                            title={`Remove ${translatedName}`}
                                                                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-0.5"
                                                                        >
                                                                            <X className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                    <span
                                                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                                            res.classification === 'High'
                                                                                ? 'bg-rose-100 text-rose-800'
                                                                                : res.classification === 'Low'
                                                                                ? 'bg-amber-100 text-amber-800'
                                                                                : 'bg-emerald-100 text-emerald-800'
                                                                        }`}
                                                                    >
                                                                        {res.measuredValue} {res.unit} ({res.classification})
                                                                    </span>
                                                                </div>

                                                                {isAbnormal && translatedExp && (
                                                                    <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                                                                        {translatedExp}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            <ConfirmDialog
                open={showClearConfirmModal}
                title="Permanently Clear History?"
                message="Are you sure you want to delete all saved lab visits, biomarker tracking history, and trend graphs from this account?"
                confirmLabel="Yes, Clear All History"
                onClose={() => setShowClearConfirmModal(false)}
                onConfirm={() => {
                    setShowClearConfirmModal(false);
                    onClearHistory();
                }}
            />

            <ConfirmDialog
                open={deleteReportTarget !== null}
                title="Delete This Report?"
                message="This saved visit will be permanently removed from your history, trends, and comparisons."
                confirmLabel="Yes, Delete Report"
                onClose={() => setDeleteReportTarget(null)}
                onConfirm={() => {
                    if (deleteReportTarget !== null) {
                        onDeleteSingleReport(deleteReportTarget);
                    }
                    setDeleteReportTarget(null);
                }}
            />

            <ConfirmDialog
                open={deleteTestTarget !== null}
                title={`Remove ${deleteTestTarget?.testName ?? 'this biomarker'}?`}
                message="This biomarker will be permanently removed from this saved visit."
                confirmLabel="Yes, Remove"
                onClose={() => setDeleteTestTarget(null)}
                onConfirm={() => {
                    if (deleteTestTarget) {
                        onDeleteSingleTest(deleteTestTarget.reportId, deleteTestTarget.testId);
                    }
                    setDeleteTestTarget(null);
                }}
            />
        </div>
    );
};
