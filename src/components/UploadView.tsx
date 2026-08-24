import React, { useState } from 'react';
import {
    Upload,
    FileText,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    Eye,
    Layers,
    ChevronDown,
    ChevronUp,
    Edit3
} from 'lucide-react';
import { TestResult, SupportedLanguage, UserProfile } from '../types';
import { parseLabReportText } from '../utils/parser';
import { getTranslation } from '../utils/language';
import { ageFromDob } from '../utils/population';
import { CVQualityData, MLInsightsData } from './MLInsightsCard';
import { apiFetch, ApiError } from '../api/client';

export interface ExtractedReportItem {
    results: TestResult[];
    sourceLabel: string;
    rawText: string;
    cvQuality: CVQualityData | null;
    mlInsights: MLInsightsData | null;
    date?: string;
}

interface UploadViewProps {
    userProfile?: UserProfile | null;
    currentLang: SupportedLanguage;
    onReportExtracted: (
        results: TestResult[],
        sourceLabel: string,
        rawText: string,
        cvQuality: CVQualityData | null,
        mlInsights: MLInsightsData | null
    ) => void;
    onBatchReportsExtracted?: (reports: ExtractedReportItem[]) => void;
    currentRawText: string;
    onUpdateRawText: (text: string) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
    userProfile,
    currentLang,
    onReportExtracted,
    onBatchReportsExtracted,
    currentRawText,
    onUpdateRawText
}) => {
    const buildPatientContext = () => {
        if (!userProfile) return null;
        const ctx: { date_of_birth?: string; gender?: string; patient_age?: number; patient_gender?: string } = {};
        if (userProfile.dateOfBirth) ctx.date_of_birth = userProfile.dateOfBirth;
        if (userProfile.gender && userProfile.gender !== 'Prefer not to say') ctx.gender = userProfile.gender;
        const age = ageFromDob(userProfile.dateOfBirth);
        if (age !== null) ctx.patient_age = age;
        if (ctx.gender) ctx.patient_gender = ctx.gender;
        return Object.keys(ctx).length > 0 ? ctx : null;
    };
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [cvQuality, setCvQuality] = useState<CVQualityData | null>(null);
    const [extractedNote, setExtractedNote] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState<number>(1);
    const [lastUploadedName, setLastUploadedName] = useState<string>('');
    const [extractedCount, setExtractedCount] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isRawTextExpanded, setIsRawTextExpanded] = useState<boolean>(false);

    // Batch status state
    const [batchTotal, setBatchTotal] = useState<number>(0);
    const [batchCurrentIndex, setBatchCurrentIndex] = useState<number>(0);
    const [batchCurrentName, setBatchCurrentName] = useState<string>('');
    const [batchStatusMessage, setBatchStatusMessage] = useState<string>('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        if (isAnalyzing) return;

        let filesList: File[] = [];
        if ('dataTransfer' in e && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            e.preventDefault();
            filesList = Array.from(e.dataTransfer.files);
        } else if ('target' in e) {
            const target = e.target as HTMLInputElement;
            if (target && target.files && target.files.length > 0) {
                filesList = Array.from(target.files);
            }
        }

        if (filesList.length === 0) return;

        if (filesList.length > 10) {
            setAnalysisError(getTranslation('up.errTooManyFiles', currentLang));
            return;
        }

        for (const f of filesList) {
            if (f.size > 15 * 1024 * 1024) {
                setAnalysisError(getTranslation('up.errFileTooLarge', currentLang, { name: f.name }));
                return;
            }
        }

        setIsAnalyzing(true);
        setAnalysisError(null);
        setSuccessMessage(null);
        setCvQuality(null);
        setExtractedNote(null);
        setBatchTotal(filesList.length);

        const extractedReportItems: ExtractedReportItem[] = [];

        for (let idx = 0; idx < filesList.length; idx++) {
            const file = filesList[idx];
            const fileName = file.name;
            setBatchCurrentIndex(idx + 1);
            setBatchCurrentName(fileName);
            setLastUploadedName(fileName);

            // Honest processing stage indicator
            setBatchStatusMessage(
                idx === 0
                    ? getTranslation('up.stageUpload', currentLang)
                    : getTranslation('up.stageOcr', currentLang)
            );

            let fileProcessed = false;

            try {
                const formData = new FormData();
                formData.append('file', file);

                const data = await apiFetch<any>('/api/upload-file', {
                    method: 'POST',
                    body: formData
                });
                fileProcessed = true;

                const reportsArray = data.reports && data.reports.length > 0 ? data.reports : [data];

                for (const rep of reportsArray) {
                    if (rep.is_valid_report && rep.results && rep.results.length > 0) {
                        const reportDate = rep.date || new Date().toISOString().split('T')[0];
                        const reportItem: ExtractedReportItem = {
                            results: rep.results,
                            sourceLabel: rep.label || getTranslation('up.uploadedPrefix', currentLang, { name: fileName }),
                            rawText: rep.extractedText || '',
                            cvQuality: rep.cv_quality || null,
                            mlInsights: rep.ml_insights || null,
                            date: reportDate
                        };
                        extractedReportItems.push(reportItem);
                    }
                }

                if (data.cv_quality) setCvQuality(data.cv_quality);
                if (data.extractedText) onUpdateRawText(data.extractedText);
                if (data.note) setExtractedNote(data.note);
                if (data.page_count) setPageCount(data.page_count);

                if (Array.isArray(data.skipped_files) && data.skipped_files.length > 0) {
                    const reasons = data.skipped_files
                        .map((s: { filename: string; reason: string }) => `"${s.filename}" (${s.reason.replace(/_/g, ' ')})`)
                        .join(', ');
                    setAnalysisError(getTranslation('up.errSkippedFiles', currentLang, { reasons }));
                }
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    setAnalysisError(getTranslation('up.errSessionReupload', currentLang));
                    setIsAnalyzing(false);
                    return;
                }
                if (!/\.txt$/i.test(fileName) && !file.type.startsWith('text/')) {
                    setAnalysisError(
                        err instanceof ApiError
                            ? err.message
                            : getTranslation('up.errServerOffline', currentLang, { name: fileName })
                    );
                }
            }

            if (!fileProcessed) {
                if (/\.txt$/i.test(fileName) || file.type.startsWith('text/')) {
                    try {
                        const text = await file.text();
                        onUpdateRawText(text);
                        const clientResults = parseLabReportText(text, buildPatientContext());
                        if (clientResults.length > 0) {
                            extractedReportItems.push({
                                results: clientResults,
                                sourceLabel: getTranslation('up.uploadedPrefix', currentLang, { name: fileName }),
                                rawText: text,
                                cvQuality: null,
                                mlInsights: null
                            });
                        }
                    } catch {
                        // Ignore unreadable text file
                    }
                }
            }
        }

        setIsAnalyzing(false);

        if (extractedReportItems.length === 0) {
            setAnalysisError(getTranslation('up.errNoParamsFile', currentLang));
            setExtractedCount(0);
            return;
        }

        const totalTests = extractedReportItems.reduce((acc, r) => acc + r.results.length, 0);
        setExtractedCount(totalTests);

        if (extractedReportItems.length > 1) {
            setSuccessMessage(getTranslation('up.successBatch', currentLang, {
                reports: String(extractedReportItems.length),
                tests: String(totalTests)
            }));
        } else {
            setSuccessMessage(getTranslation('up.successSingle', currentLang, { count: String(totalTests) }));
        }

        if (onBatchReportsExtracted) {
            onBatchReportsExtracted(extractedReportItems);
        } else {
            const primary = extractedReportItems[0];
            onReportExtracted(
                primary.results,
                primary.sourceLabel,
                primary.rawText,
                primary.cvQuality,
                primary.mlInsights
            );
        }
    };

    const handleReRunRawText = async () => {
        if (isAnalyzing) return;
        if (!currentRawText.trim()) {
            setAnalysisError(getTranslation('up.errPasteEmpty', currentLang));
            return;
        }

        setIsAnalyzing(true);
        setAnalysisError(null);
        setSuccessMessage(null);

        try {
            const ctx = buildPatientContext();
            const data = await apiFetch<any>('/api/analyze-text', {
                method: 'POST',
                json: {
                    text: currentRawText,
                    label: lastUploadedName || getTranslation('up.pastedReportLabel', currentLang),
                    patient_age: ctx?.patient_age ?? null,
                    patient_gender: ctx?.patient_gender ?? null
                }
            });
            setIsAnalyzing(false);

            if (!data.is_valid_report || !data.results || data.results.length === 0) {
                setAnalysisError(getTranslation('up.errNoParamsText', currentLang));
                setExtractedCount(0);
                return;
            }

            setExtractedCount(data.results.length);
            setSuccessMessage(getTranslation('up.successSingle', currentLang, { count: String(data.results.length) }));
            onReportExtracted(
                data.results,
                lastUploadedName || getTranslation('up.pastedReportLabel', currentLang),
                currentRawText,
                cvQuality,
                data.ml_insights || null
            );
            return;
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                setIsAnalyzing(false);
                setAnalysisError(getTranslation('up.errSessionExpired', currentLang));
                return;
            }
        }

        setTimeout(() => {
            setIsAnalyzing(false);
            const clientResults = parseLabReportText(currentRawText, buildPatientContext());
            if (clientResults.length === 0) {
                setAnalysisError(getTranslation('up.errNoParamsText', currentLang));
                setExtractedCount(0);
                return;
            }

            setExtractedCount(clientResults.length);
            setSuccessMessage(getTranslation('up.successSingle', currentLang, { count: String(clientResults.length) }));
            onReportExtracted(
                clientResults,
                lastUploadedName || getTranslation('up.pastedReportLabel', currentLang),
                currentRawText,
                cvQuality,
                null
            );
        }, 300);
    };

    const textLineCount = currentRawText.trim()
        ? currentRawText.split('\n').filter((l) => l.trim().length > 0).length
        : 0;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* 1. Unified Dropzone Container (ReUI form-7 / card-21) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                {/* Header with Integrated Batch Stacker Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                    <div className="space-y-1">
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2.5 rtl:space-x-reverse">
                            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl border border-teal-100/80">
                                <Upload className="w-5 h-5" />
                            </div>
                            <span>{getTranslation('up.title', currentLang)}</span>
                        </h2>
                        <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                            {getTranslation('up.subtitle', currentLang)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                        <span className="text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200/80 px-3 py-1 rounded-full whitespace-nowrap">
                            {getTranslation('up.limitsBadge', currentLang)}
                        </span>
                    </div>
                </div>

                {/* Modern Dashed Dropzone */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        setIsDragging(false);
                        handleFileUpload(e);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer relative group ${
                        isDragging
                            ? 'border-teal-500 bg-teal-50/60 scale-[0.99]'
                            : 'border-teal-200 hover:border-teal-400 bg-teal-50/20 hover:bg-teal-50/50'
                    }`}
                >
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg,.txt"
                        onChange={handleFileUpload}
                        disabled={isAnalyzing}
                        aria-label={getTranslation('up.dropzoneAria', currentLang)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 disabled:cursor-not-allowed"
                    />

                    <div className="space-y-3.5 pointer-events-none">
                        <div className="p-3.5 bg-white text-teal-600 rounded-2xl w-14 h-14 mx-auto shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center border border-teal-100">
                            <Layers className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">
                                {getTranslation('dragDropTitle', currentLang)}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                {getTranslation('dragDropOr', currentLang)}{' '}
                                <span className="text-teal-600 font-bold underline">
                                    {getTranslation('browseFiles', currentLang)}
                                </span>
                            </div>
                        </div>

                        {/* Format badges */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                            <span className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">
                                {getTranslation('up.formatPdf', currentLang)}
                            </span>
                            <span className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">
                                {getTranslation('up.formatImage', currentLang)}
                            </span>
                            <span className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">
                                {getTranslation('up.formatTxt', currentLang)}
                            </span>
                            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md">
                                {getTranslation('up.batchBadge', currentLang)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Real-Time Batch Progress Queue Indicator */}
            {isAnalyzing && (
                <div className="bg-white rounded-2xl border border-teal-200/90 p-6 sm:p-8 text-center space-y-4 shadow-sm relative overflow-hidden">
                    <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                        <RefreshCw className="w-10 h-10 text-teal-600 animate-spin" />
                        {batchTotal > 1 && (
                            <span className="absolute text-[11px] font-black text-teal-900">
                                {batchCurrentIndex}/{batchTotal}
                            </span>
                        )}
                    </div>
                    <div className="space-y-1.5 max-w-md mx-auto">
                        <div className="text-sm font-bold text-slate-900">
                            {batchTotal > 1
                                ? getTranslation('up.processingNofM', currentLang, { current: String(batchCurrentIndex), total: String(batchTotal) })
                                : getTranslation('processingText', currentLang)}
                        </div>
                        {batchCurrentName && (
                            <div className="text-xs text-teal-700 font-semibold inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60 max-w-xs truncate">
                                <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{batchCurrentName}</span>
                            </div>
                        )}
                        <p className="text-xs text-slate-500 italic">
                            {batchStatusMessage || getTranslation('up.stageDefault', currentLang)}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden max-w-md mx-auto border border-slate-200/60">
                        <div
                            className="bg-gradient-to-r from-teal-500 to-teal-600 h-2.5 rounded-full transition-all duration-300"
                            style={{
                                width: batchTotal > 1
                                    ? `${Math.max(8, Math.round((batchCurrentIndex / batchTotal) * 100))}%`
                                    : '85%'
                            }}
                        />
                    </div>
                    {batchTotal > 1 && (
                        <div className="text-[11px] font-bold text-slate-400">
                            {getTranslation('up.percentComplete', currentLang, { percent: String(Math.round((batchCurrentIndex / batchTotal) * 100)) })}
                        </div>
                    )}
                </div>
            )}

            {/* Validation Error Banner */}
            {analysisError && !isAnalyzing && (
                <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 sm:p-5 text-rose-900 space-y-1.5 shadow-xs">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse font-bold text-sm text-rose-950">
                        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        <span>{getTranslation('up.validationTitle', currentLang)}</span>                    </div>
                    <p className="text-xs text-rose-800 leading-relaxed font-medium">
                        {analysisError}
                    </p>
                </div>
            )}

            {/* Success Banner */}
            {successMessage && !isAnalyzing && (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 text-emerald-900 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                            <div className="text-xs font-bold text-emerald-950">{successMessage}</div>
                            {extractedNote && <div className="text-[11px] text-emerald-700">{extractedNote}</div>}
                            {pageCount > 1 && (
                                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                                    {getTranslation('up.multiPageInfo', currentLang, { count: String(pageCount) })}
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="text-xs font-extrabold bg-emerald-600 text-white px-3 py-1 rounded-full">
                        {getTranslation('up.testsFound', currentLang, { count: String(extractedCount) })}
                    </span>
                </div>
            )}

            {/* 3. Computer Vision Quality Diagnostics Strip (if photo uploaded) */}
            {cvQuality && cvQuality.is_valid && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                {getTranslation('up.cvTitle', currentLang)}
                            </h3>
                        </div>
                        <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                cvQuality.quality_passed
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                        >
                            {cvQuality.quality_passed ? getTranslation('up.cvPassed', currentLang) : getTranslation('up.cvNotice', currentLang)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{getTranslation('up.cvSharpness', currentLang)}</div>
                            <div className="font-black text-slate-800 mt-0.5">{cvQuality.sharpness_rating}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{getTranslation('up.cvScore', currentLang, { value: String(cvQuality.sharpness_score) })}</div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{getTranslation('up.cvContrast', currentLang)}</div>
                            <div className="font-black text-slate-800 mt-0.5">{cvQuality.contrast_rating}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{getTranslation('up.cvRatio', currentLang, { value: String(cvQuality.contrast_ratio) })}</div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{getTranslation('up.cvDpi', currentLang)}</div>
                            <div className="font-black text-slate-800 mt-0.5">{cvQuality.dpi_status}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{getTranslation('up.cvEstDpi', currentLang)}</div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{getTranslation('up.cvDimensions', currentLang)}</div>
                            <div className="font-black text-slate-800 mt-0.5">{cvQuality.dimensions}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{getTranslation('up.cvPixels', currentLang)}</div>
                        </div>
                    </div>

                    {cvQuality.guidance && (
                        <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                            {cvQuality.guidance}
                        </p>
                    )}
                </div>
            )}

            {/* 4. Collapsible Extracted Raw Text Inspector Accordion */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
                <button
                    type="button"
                    onClick={() => setIsRawTextExpanded(!isRawTextExpanded)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors text-left"
                >
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                        <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                            <Edit3 className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                {getTranslation('up.rawTextToggle', currentLang)}
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                                {textLineCount > 0
                                    ? getTranslation('up.rawTextLoaded', currentLang, { count: String(textLineCount) })
                                    : getTranslation('up.rawTextEmpty', currentLang)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {textLineCount > 0 && (
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                                {getTranslation('up.linesCount', currentLang, { count: String(textLineCount) })}
                            </span>
                        )}
                        <div className="p-1 text-slate-400">
                            {isRawTextExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </div>
                    </div>
                </button>

                {isRawTextExpanded && (
                    <div className="p-4 sm:p-5 border-t border-slate-100 space-y-3 bg-slate-50/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-[11px] text-slate-500">
                                {getTranslation('up.rawTextEditHint', currentLang)}
                            </p>
                            <button
                                onClick={handleReRunRawText}
                                disabled={isAnalyzing}
                                className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold py-1.5 px-3.5 rounded-xl flex items-center space-x-1.5 rtl:space-x-reverse transition-all self-start sm:self-auto flex-shrink-0"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                                <span>{getTranslation('up.reExtractButton', currentLang)}</span>
                            </button>
                        </div>

                        <textarea
                            value={currentRawText}
                            onChange={(e) => onUpdateRawText(e.target.value)}
                            rows={8}
                            placeholder={getTranslation('up.rawTextPlaceholder', currentLang)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed shadow-inner"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

