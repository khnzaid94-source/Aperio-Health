import React, { useState } from 'react';
import {
    Cpu,
    Activity,
    Layers,
    CheckCircle2,
    Copy,
    ChevronDown,
    ChevronUp,
    Sparkles
} from 'lucide-react';

export interface MLRiskCluster {
    name: string;
    severity: string;
    markers: string[];
    insight: string;
}

export interface MLInsightsData {
    anomaly_score: number;
    balance_index: number;
    balance_status: string;
    balance_badge: string;
    analyzed_markers_count: number;
    risk_clusters: MLRiskCluster[];
    z_scores?: Record<string, number>;
    population_source?: string;
    patient_stratum?: string;
    markers_with_population_data?: number;
}

export interface CVQualityData {
    is_valid: boolean;
    quality_passed: boolean;
    dimensions: string;
    sharpness_score: number;
    sharpness_rating: string;
    contrast_ratio: number;
    contrast_rating: string;
    estimated_dpi: number;
    dpi_status: string;
    guidance: string;
}

export interface MLInsightsCardProps {
    mlInsights?: MLInsightsData | null;
    doctorQuestions?: string[];
    onCopyQuestions?: (e: React.MouseEvent) => void;
    defaultExpanded?: boolean;
}

export const MLInsightsCard: React.FC<MLInsightsCardProps> = ({
    mlInsights,
    doctorQuestions = [],
    onCopyQuestions,
    defaultExpanded = false
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

    if (!mlInsights && (!doctorQuestions || doctorQuestions.length === 0)) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl text-white shadow-lg overflow-hidden transition-all">
            {/* Header / Accordion Trigger */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }
                }}
            >
                <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                    <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 flex-shrink-0">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm sm:text-base font-extrabold text-white">
                                Clinical Intelligence &amp; Consultation Deck
                            </h3>
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                                Scikit-Learn ML
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            Multi-panel metabolic balance, synergistic risk clusters, and prepared doctor agenda
                        </p>
                    </div>
                </div>

                {/* Right Badges & Toggle */}
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse self-end sm:self-center flex-shrink-0">
                    {mlInsights && (
                        <div className="bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-xl text-right rtl:text-left flex items-center space-x-1.5 rtl:space-x-reverse">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold hidden md:inline">
                                Balance:
                            </span>
                            <span className="text-xs font-black text-teal-400">
                                {mlInsights.balance_index}% ({mlInsights.balance_badge})
                            </span>
                        </div>
                    )}

                    {doctorQuestions.length > 0 && onCopyQuestions && (
                        <button
                            onClick={onCopyQuestions}
                            className="bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center space-x-1.5 rtl:space-x-reverse shadow-xs"
                            title="Copy all prepared questions to clipboard"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Copy Questions</span>
                        </button>
                    )}

                    <div className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </div>
            </div>

            {/* Collapsible Body */}
            {isExpanded && (
                <div className="border-t border-slate-800/90 p-5 sm:p-6 space-y-6 bg-slate-950/60">
                    {/* Section 1: ML Metabolic Balance Score Gauge */}
                    {mlInsights && (
                        <div className="space-y-2.5 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Sparkles className="w-4 h-4 text-teal-400" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                        Metabolic Balance Index (Population Distribution)
                                    </span>
                                </div>
                                <span className="text-xs font-extrabold text-teal-400">
                                    {mlInsights.balance_index ?? '—'}% — {mlInsights.balance_badge ?? 'Unknown'}
                                </span>
                            </div>

                            {/* Linear Color Gauge */}
                            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden relative border border-slate-700/60">
                                <div
                                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-rose-500 via-amber-400 to-teal-400"
                                    style={{ width: `${Math.min(100, Math.max(5, mlInsights.balance_index || 0))}%` }}
                                />
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Compares your values against real-world population percentiles (CDC NHANES 2017-2018, matched to your sex and age band) with an Isolation Forest anomaly check. Educational estimate only — not a diagnostic measure.
                                {mlInsights?.patient_stratum ? ` Stratum: ${mlInsights.patient_stratum}.` : ''}
                            </p>
                        </div>
                    )}

                    {/* Section 2: Multi-Marker Connected Health Patterns / Risk Clusters */}
                    {mlInsights && (
                        <div className="space-y-3">
                            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-slate-300">
                                <Layers className="w-4 h-4 text-indigo-400" />
                                <span>Multi-Biomarker Synergistic Interaction Clusters:</span>
                            </div>

                            {(mlInsights.risk_clusters ?? []).length === 0 ? (
                                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 flex items-center space-x-2.5 rtl:space-x-reverse">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span>
                                        No multi-marker pathological synergy detected across evaluated biomarkers. Multi-system balance is within acceptable bounds.
                                    </span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {(mlInsights.risk_clusters ?? []).map((cluster, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-slate-900/90 border border-indigo-900/60 p-4 rounded-xl space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 rtl:space-x-reverse">
                                                    <Activity className="w-3.5 h-3.5 text-rose-400" />
                                                    <span>{cluster.name}</span>
                                                </h4>
                                                <span className="text-[10px] font-extrabold bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded-full border border-rose-700/60">
                                                    {cluster.severity}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                                {cluster.insight}
                                            </p>
                                            <div className="flex items-center space-x-1 rtl:space-x-reverse flex-wrap pt-1">
                                                <span className="text-[10px] text-slate-400 font-semibold mr-1">
                                                    Interacting Markers:
                                                </span>
                                                {cluster.markers.map((m) => (
                                                    <span
                                                        key={m}
                                                        className="text-[10px] font-mono bg-slate-950 text-teal-300 px-1.5 py-0.5 rounded border border-slate-700 uppercase"
                                                    >
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Section 3: Doctor Consultation Agenda */}
                    {doctorQuestions.length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span className="text-base">📋</span>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                        Doctor Consultation Agenda ({doctorQuestions.length} Tailored Questions)
                                    </h4>
                                </div>
                                {onCopyQuestions && (
                                    <button
                                        onClick={onCopyQuestions}
                                        className="text-xs text-teal-400 hover:text-teal-300 font-bold inline-flex items-center space-x-1 rtl:space-x-reverse"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Questions</span>
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2">
                                {doctorQuestions.map((q, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3.5 flex items-start space-x-3 rtl:space-x-reverse hover:border-indigo-700/60 transition-colors"
                                    >
                                        <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <p className="text-xs font-medium text-slate-100 leading-relaxed flex-1">
                                            {q}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

