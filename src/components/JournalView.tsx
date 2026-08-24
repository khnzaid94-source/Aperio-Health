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

interface JournalViewProps {
    userEmail: string;
    journalEntries: JournalEntry[];
    onAddEntry: (entry: Omit<JournalEntry, 'id'>) => void;
    onDeleteEntry: (id: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
    userEmail,
    journalEntries,
    onAddEntry,
    onDeleteEntry
}) => {
    const [entryType, setEntryType] = useState<'medication' | 'supplement' | 'lifestyle'>('medication');
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
                                    Medication &amp; Clinical Context Ledger
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Log active prescriptions, daily supplements, and lab collection conditions (fasting, workout) for complete longitudinal analysis.
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
                                <span>Close Drawer</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                <span>+ Log New Item</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Context Tooltip / Info Sub-Text */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-600 flex items-start space-x-2.5 rtl:space-x-reverse">
                    <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">
                        <strong className="text-slate-800 font-bold">Why Context Matters: </strong>
                        Biomarkers fluctuate based on active medications (e.g., cholesterol statins, thyroid hormone replacement), fasting duration before blood draws, and strenuous exercise. Logging these events provides context during doctor consultations.
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
                                Log New Health &amp; Context Item
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
                                Select Entry Category
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
                                    <span>Prescription Med</span>
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
                                    <span>Daily Supplement</span>
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
                                    <span>Test Context / Event</span>
                                </button>
                            </div>
                        </div>

                        {/* Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Item Name / Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={
                                        entryType === 'medication'
                                            ? 'e.g. Atorvastatin, Levothyroxine'
                                            : entryType === 'supplement'
                                            ? 'e.g. Vitamin D3, Omega-3 Fish Oil'
                                            : 'e.g. 12-Hour Fasting, Marathon Training'
                                    }
                                    className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Dosage / Frequency (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={dosage}
                                    onChange={(e) => setDosage(e.target.value)}
                                    placeholder="e.g. 20mg daily, 2000 IU morning"
                                    className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Start / Event Date
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
                                Clinical Notes &amp; Context (Optional)
                            </label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Prescribed for lipid management, taken after morning meal"
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
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl shadow-xs transition-colors"
                            >
                                Save to Ledger
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
                                    Prescription Meds
                                </h3>
                            </div>
                            <span className="text-xs font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                                {medications.length}
                            </span>
                        </div>

                        {medications.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-1">
                                <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                                <p className="text-xs text-slate-400 font-medium">No active prescription meds logged</p>
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
                                                    Prescription
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
                                                        Started: {item.start_date}
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
                                            onClick={() => onDeleteEntry(item.id)}
                                            title="Delete medication entry"
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
                                    Daily Supplements
                                </h3>
                            </div>
                            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                {supplements.length}
                            </span>
                        </div>

                        {supplements.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-1">
                                <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                                <p className="text-xs text-slate-400 font-medium">No daily supplements logged</p>
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
                                                    Supplement
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
                                                        Started: {item.start_date}
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
                                            onClick={() => onDeleteEntry(item.id)}
                                            title="Delete supplement entry"
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
                                    Test Context / Lifestyle
                                </h3>
                            </div>
                            <span className="text-xs font-extrabold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                                {lifestyleLogs.length}
                            </span>
                        </div>

                        {lifestyleLogs.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-1">
                                <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                                <p className="text-xs text-slate-400 font-medium">No lifestyle context entries logged</p>
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
                                                    Context
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
                                                        Event Date: {item.start_date}
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
                                            onClick={() => onDeleteEntry(item.id)}
                                            title="Delete context entry"
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
        </div>
    );
};
