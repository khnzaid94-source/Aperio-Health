import React, { useState, useMemo } from 'react';
import {
    ShieldCheck,
    AlertTriangle,
    Microscope,
    Search,
    Database,
    Eye,
    Brain,
    Sparkles
} from 'lucide-react';
import { CATALOG } from '../constants/catalog';
import { SupportedLanguage } from '../types';
import { getLocalizedTestName, getLocalizedCategory, getTranslation } from '../utils/language';

interface AboutViewProps {
    currentLang: SupportedLanguage;
}

export const AboutView: React.FC<AboutViewProps> = ({ currentLang }) => {
    const t = (key: string, params?: Record<string, string>): string =>
        getTranslation(key, currentLang, params);
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const categories = useMemo(() => {
        return Array.from(new Set(CATALOG.map((c) => c.category)));
    }, []);

    const filteredCatalog = useMemo(() => {
        return CATALOG.filter((item) => {
            const matchesCategory =
                selectedCategory === 'ALL' || item.category === selectedCategory;

            const localizedName = getLocalizedTestName(item.id, currentLang).toLowerCase();
            const localizedCat = getLocalizedCategory(item.category, currentLang).toLowerCase();
            const query = searchTerm.toLowerCase().trim();

            const matchesSearch =
                !query ||
                item.name.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                localizedName.includes(query) ||
                localizedCat.includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchTerm, currentLang]);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
                <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-teal-50 text-teal-800 border border-teal-200/80 px-3 py-1 rounded-full text-xs font-semibold">
                    <Microscope className="w-4 h-4 text-teal-600" />
                    <span>{t('ab.badge')}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t('ab.title')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {t('ab.intro')}
                </p>
            </div>

            {/* Trust & Architecture Grid (2x2) */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                        {t('ab.archTitle')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1: Pre-Vetted Clinical Database */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 hover:border-teal-300 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl group-hover:bg-teal-100/80 transition-colors">
                                <Database className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100/80 text-teal-900 border border-teal-200">
                                {t('ab.c1Badge')}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">
                                {t('ab.c1Title')}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {t('ab.c1Body')}
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Computer Vision Diagnostics */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 hover:border-indigo-300 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl group-hover:bg-indigo-100/80 transition-colors">
                                <Eye className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100/80 text-indigo-900 border border-indigo-200">
                                {t('ab.c2Badge')}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">
                                {t('ab.c2Title')}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {t('ab.c2Body')}
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Isolation Forest ML Modeling */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 hover:border-emerald-300 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-100/80 transition-colors">
                                <Brain className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                                {t('ab.c3Badge')}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">
                                {t('ab.c3Title')}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {t('ab.c3Body')}
                            </p>
                        </div>
                    </div>

                    {/* Card 4: Zero Data Training & Privacy */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 hover:border-purple-300 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl group-hover:bg-purple-100/80 transition-colors">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100/80 text-purple-900 border border-purple-200">
                                {t('ab.c4Badge')}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">
                                {t('ab.c4Title')}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {t('ab.c4Body')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Disclaimer Card */}
            <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-6 text-amber-950 space-y-3 shadow-xs">
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-amber-200/80 pb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-950">
                        {t('ab.discTitle')}
                    </h2>
                </div>
                <ul className="text-xs text-amber-900 leading-relaxed space-y-2 font-medium list-disc list-inside">
                    <li>
                        <strong className="text-amber-950">{t('ab.discEduLead')}</strong>
                        {t('ab.discEduBody')}
                    </li>
                    <li>
                        <strong className="text-amber-950">{t('ab.discPhysLead')}</strong>
                        {t('ab.discPhysBody')}
                    </li>
                    <li>
                        <strong className="text-amber-950">{t('ab.discBoundsLead')}</strong>
                        {t('ab.discBoundsBody')}
                    </li>
                </ul>
            </div>

            {/* Interactive 64-Biomarker Reference Catalog Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Database className="w-5 h-5 text-teal-600" />
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                                {t('ab.catalogTitle', { count: String(CATALOG.length) })}
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {t('ab.catalogSub')}
                        </p>
                    </div>

                    {/* Controls: Search Bar & Panel Filter Dropdown */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('ab.searchPh')}
                                className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            aria-label={t('ab.filterAria')}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="ALL">{t('ab.allPanels', { count: String(CATALOG.length) })}</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                    <table className="w-full text-xs text-left rtl:text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                                <th className="p-3.5">{t('ab.colName')}</th>
                                <th className="p-3.5">{t('ab.colPanel')}</th>
                                <th className="p-3.5">{t('ab.colBounds')}</th>
                                <th className="p-3.5">{t('ab.colUnit')}</th>
                                <th className="p-3.5">{t('ab.colPurpose')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 text-slate-700">
                            {filteredCatalog.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-xs text-slate-400 font-medium">
                                        {t('ab.noMatch', { query: searchTerm })}
                                    </td>
                                </tr>
                            ) : (
                                filteredCatalog.map((item) => {
                                    const localizedName = getLocalizedTestName(item.id, currentLang);
                                    const localizedCategory = getLocalizedCategory(item.category, currentLang);

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-3.5 font-bold text-slate-900">
                                                <div>{localizedName}</div>
                                                <div className="text-[10px] text-slate-400 font-mono font-normal">
                                                    ID: {item.id}
                                                </div>
                                            </td>
                                            <td className="p-3.5 text-[11px] font-semibold text-teal-800">
                                                <span className="bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-md inline-block">
                                                    {localizedCategory}
                                                </span>
                                            </td>
                                            <td className="p-3.5 font-mono font-bold text-slate-800" dir="ltr">
                                                {item.min} – {item.max}
                                            </td>
                                            <td className="p-3.5 text-slate-500 font-mono text-[11px]">{item.unit}</td>
                                            <td className="p-3.5 text-[11px] text-slate-600 leading-relaxed max-w-xs">
                                                {item.explanations?.low ? (
                                                    <span className="line-clamp-2" title={item.explanations.low}>
                                                        {item.explanations.low}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 italic">{t('ab.fallbackPurpose')}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
