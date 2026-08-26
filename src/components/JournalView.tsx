import React, { useState } from 'react';
import {
    Pill,
    Plus,
    Trash2,
    Calendar,
    Activity,
    Info,
    HeartPulse,
    Sparkles,
    X,
    FileText
} from 'lucide-react';
import { JournalEntry } from '../types';
import { SupportedLanguage } from '../types';
import { getTranslation } from '../utils/language';
import { ConfirmDialog } from './ConfirmDialog';

interface JournalViewProps {
    userEmail: string;
    journalEntries: JournalEntry[];
    onAddEntry: (entry: Omit<JournalEntry, 'id'>) => void;
    onDeleteEntry: (id: string) => void;
    currentLang: SupportedLanguage;
}

export const JournalView: React.FC<JournalViewProps> = ({
    userEmail,
    journalEntries,
    onAddEntry,
    onDeleteEntry,
    currentLang
}) => {
    const t = (key: string, params?: Record<string, string>): string =>
        getTranslation(key, currentLang, params);
    const [entryType, setEntryType] = useState<'medication' | 'supplement' | 'lifestyle'>('medication');
    const [deleteEntryTarget, setDeleteEntryTarget] = useState<JournalEntry | null>(null);
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onAddEntry({
            user_email: userEmail,
            entry_type: entryType,
            name: name.trim(),
            dosage: dosage.trim() || undefined,
            start_date: startDate || undefined,
            notes: notes.trim() || undefined
        });

        setName('');
        setDosage('');
        setNotes('');
        setShowForm(false);
    };

    const medications = journalEntries.filter((e) => e.entry_type === 'medication');
    const supplements = journalEntries.filter((e) => e.entry_type === 'supplement');
    const lifestyleLogs = journalEntries.filter((e) => e.entry_type === 'lifestyle');

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header & Context */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                                <HeartPulse className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                                    {t('jrn.headerTitle')}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    {t('jrn.headerSub')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm(!showForm)}
                        className={`inline-flex items-center space-x-2 rtl:space-x-reverse font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs self-start sm:self-auto ${
                            showForm
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                        }`}
                    >
                        {showForm ? (
                            <>
                                <X className="w-4 h-4" />
                                <span>{t('jrn.closeDrawer')}</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                <span>{t('jrn.logNewItem')}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Context Tooltip / Info Sub-Text */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-600 flex items-start space-x-2.5 rtl:space-x-reverse">
                    <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">
                        <strong className="text-slate-800 font-bold">{t('jrn.whyContextLead')}</strong>
                        {t('jrn.whyContextBody')}
                    </div>
                </div>
            </div>

            {/* Slide-Down Entry Form (ReUI Drawer / Modal) */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-5 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Sparkles className="w-4 h-4 text-teal-600" />
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                {t('jrn.formHeader')}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Category Pill Switcher Selector */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">
                                {t('jrn.selectCategory')}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setEntryType('medication')}
                                    className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                                        entryType === 'medication'
                                            ? 'bg-teal-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Pill className="w-3.5 h-3.5" />
                                    <span>{t('jrn.catMedication')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEntryType('supplement')}
                                    className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                                        entryType === 'supplement'
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>{t('jrn.catSupplement')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEntryType('lifestyle')}
                                    className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                                        entryType === 'lifestyle'
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{t('jrn.catLifestyle')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {t('jrn.nameLabel')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={
                                        entryType === 'medication'
                                            ? t('jrn.phNameMedication')
                                            : entryType === 'supplement'
                                            ? t('jrn.phNameSupplement')
                                            : t('jrn.phNameLifestyle')
                                    }
                                    className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {t('jrn.dosageLabel')}
                                </label>
                                <input
                                    type="text"
                                    value={dosage}
                                    onChange={(e) => setDosage(e.target.value)}
                                    placeholder={t('jrn.phDosage')}
                                    className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {t('jrn.dateLabel')}
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                {t('jrn.notesLabel')}
                            </label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={t('jrn.phNotes')}
                                className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Form Buttons */}
                        <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl transition-colors"
                            >
                                {t('ui.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl shadow-xs transition-colors"
                            >
                                {t('jrn.saveEntry')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 3 Uniform Ledger Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ledger Card 1: Prescription Meds */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Pill className="w-4 h-4 text-teal-600" />
                                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                    {t('jrn.cardMeds')}
                                </h3>
                            </div>
                            <span className="text-xs font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                                {medications.length}
                            </span>
                        </div>

                        {medications.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-1">
                                <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                                <p className="text-xs text-slate-400 font-medium">{t('jrn.emptyMeds')}</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {medications.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 flex items-start justify-between group transition-all"
                                    >
                                        <div className="space-y-1.5 w-full pr-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-slate-900 tracking-tight">
                                                    {item.name}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200/80">
                                                    {t('jrn.tagPrescription')}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                                {item.dosage && (
                                                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-teal-700">
                                                        {item.dosage}
                                                    </span>
                                                )}
                                                {item.start_date && (
                                                    <span className="text-[10px] text-slate-500 font-medium">
                                                        {t('jrn.startedPrefix', { date: item.start_date })}
                                                    </span>
                                                )}
                                            </div>

                                            {item.notes && (
                                                <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200/60">
                                                    {item.notes}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setDeleteEntryTarget(item)}
                                            title={t('jrn.delMedTitle')}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Ledger Card 2: Daily Supplements */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Activity className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                    {t('jrn.cardSupplements')}
                                </h3>
                            </div>
                            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                {supplements.length}
                            </span>
                        </div>

                        {supplements.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-1">
                                <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                                <p className="text-xs text-slate-400 font-medium">{t('jrn.emptySupplements')}</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {supplements.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 flex items-start justify-between group transition-all"
                                    >
                                        <div className="space-y-1.5 w-full pr-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-slate-900 tracking-tight">
                                                    {item.name}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                                                    {t('jrn.tagSupplement')}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                                {item.dosage && (
                                                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-emerald-700">
                                                        {item.dosage}
                                                    </span>
                                                )}
                                                {item.start_date && (
                                                    <span className="text-[10px] text-slate-500 font-medium">
                                                        {t('jrn.startedPrefix', { date: item.start_date })}
                                                    </span>
                                                )}
                                            </div>

                                            {item.notes && (
                                                <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200/60">
                                                    {item.notes}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setDeleteEntryTarget(item)}
                                            title={t('jrn.delSuppTitle')}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Ledger Card 3: Test Context & Lifestyle */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Calendar className="w-4 h-4 text-indigo-600" />
                                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                    {t('jrn.cardLifestyle')}
                                </h3>
                            </div>
                            <span className="text-xs font-extrabold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                                {lifestyleLogs.length}
                            </span>
                        </div>

                        {lifestyleLogs.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-1">
                                <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                                <p className="text-xs text-slate-400 font-medium">{t('jrn.emptyLifestyle')}</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {lifestyleLogs.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 flex items-start justify-between group transition-all"
                                    >
                                        <div className="space-y-1.5 w-full pr-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-slate-900 tracking-tight">
                                                    {item.name}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200/80">
                                                    {t('jrn.tagContext')}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                                {item.dosage && (
                                                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-indigo-700">
                                                        {item.dosage}
                                                    </span>
                                                )}
                                                {item.start_date && (
                                                    <span className="text-[10px] text-slate-500 font-medium">
                                                        {t('jrn.eventDatePrefix', { date: item.start_date })}
                                                    </span>
                                                )}
                                            </div>

                                            {item.notes && (
                                                <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200/60">
                                                    {item.notes}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setDeleteEntryTarget(item)}
                                            title={t('jrn.delCtxTitle')}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={deleteEntryTarget !== null}
                title={t('jrn.deleteConfirmTitle')}
                message={t('jrn.deleteConfirmMessage')}
                confirmLabel={t('jrn.deleteConfirmYes')}
                subtitle={t('ui.cannotUndo')}
                cancelLabel={t('ui.cancel')}
                onClose={() => setDeleteEntryTarget(null)}
                onConfirm={() => {
                    if (deleteEntryTarget) onDeleteEntry(deleteEntryTarget.id);
                    setDeleteEntryTarget(null);
                }}
            />
        </div>
    );
};
