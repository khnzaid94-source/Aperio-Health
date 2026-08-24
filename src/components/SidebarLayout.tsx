import React, { useState } from 'react';
import {
    LayoutDashboard,
    UploadCloud,
    FileSearch,
    LineChart,
    BookOpen,
    Info,
    LogOut,
    Menu,
    X,
    Microscope,
    Globe,
    User,
    ShieldCheck
} from 'lucide-react';
import { SidebarTab, SupportedLanguage, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/translations';
import { getTranslation } from '../utils/language';

interface SidebarLayoutProps {
    currentTab: SidebarTab;
    onSelectTab: (tab: SidebarTab) => void;
    userEmail: string;
    userProfile?: UserProfile | null;
    currentLang: SupportedLanguage;
    onLanguageChange: (lang: SupportedLanguage) => void;
    onSignOut: () => void;
    savedReportsCount: number;
    journalCount: number;
    children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
    currentTab,
    onSelectTab,
    userEmail,
    userProfile,
    currentLang,
    onLanguageChange,
    onSignOut,
    savedReportsCount,
    journalCount,
    children
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const displayName = userProfile?.fullName || (userEmail ? userEmail.split('@')[0] : 'User');

    const NAV_ITEMS = [
        {
            id: 'dashboard' as SidebarTab,
            labelKey: 'nav.dashboard',
            icon: LayoutDashboard,
            badge: null
        },
        {
            id: 'upload' as SidebarTab,
            labelKey: 'nav.uploadReport',
            icon: UploadCloud,
            badge: null
        },
        {
            id: 'analyze' as SidebarTab,
            labelKey: 'nav.analyzeReport',
            icon: FileSearch,
            badge: 'AI'
        },
        {
            id: 'history' as SidebarTab,
            labelKey: 'nav.historyTrends',
            icon: LineChart,
            badge: savedReportsCount > 0 ? String(savedReportsCount) : null
        },
        {
            id: 'journal' as SidebarTab,
            labelKey: 'nav.healthJournal',
            icon: BookOpen,
            badge: journalCount > 0 ? String(journalCount) : null
        }
    ];

    const getTabTitle = (tab: SidebarTab) => {
        switch (tab) {
            case 'dashboard':
                return getTranslation('title.dashboard', currentLang);
            case 'upload':
                return getTranslation('title.upload', currentLang);
            case 'analyze':
                return getTranslation('title.analyze', currentLang);
            case 'history':
                return getTranslation('title.history', currentLang);
            case 'journal':
                return getTranslation('title.journal', currentLang);
            case 'about':
                return getTranslation('title.about', currentLang);
            case 'profile':
                return getTranslation('title.profile', currentLang);
            default:
                return getTranslation('title.dashboard', currentLang);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar with Dark Slate/Teal Theme matching the Welcome Banner */}
            <aside
                className={`fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-50 w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950 border-r rtl:border-r-0 rtl:border-l border-slate-800 text-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Brand / Logo */}
                <div>
                    <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                            <div className="bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 p-2 rounded-xl shadow-xs font-bold">
                                <Microscope className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-extrabold text-base tracking-tight text-white">
                                    Aperio Health
                                </span>
                                <span className="text-[10px] block font-bold text-teal-400 uppercase tracking-wider">
                                    Health Intelligence
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="px-3 py-4 space-y-1">
                        <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {getTranslation('sidebar.mainMenu', currentLang)}
                        </div>
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onSelectTab(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                        isActive
                                            ? 'bg-teal-500/20 text-teal-300 shadow-xs border border-teal-500/40 backdrop-blur-xs'
                                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                                        <span>{getTranslation(item.labelKey, currentLang)}</span>
                                    </div>
                                    {item.badge && (
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                                                isActive
                                                    ? 'bg-teal-400 text-slate-950 font-black'
                                                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Section: Profile, About & Sign Out */}
                <div className="p-3 border-t border-slate-800/80 space-y-1">
                    <button
                        onClick={() => {
                            onSelectTab('profile');
                            setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            currentTab === 'profile'
                                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                    >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{getTranslation('sidebar.profileSettings', currentLang)}</span>
                    </button>

                    <button
                        onClick={() => {
                            onSelectTab('about');
                            setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            currentTab === 'about'
                                ? 'bg-teal-500/20 text-teal-300 shadow-xs border border-teal-500/40'
                                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                    >
                        <Info className="w-4 h-4 text-slate-400" />
                        <span>{getTranslation('sidebar.aboutDisclaimers', currentLang)}</span>
                    </button>

                    <button
                        onClick={onSignOut}
                        className="w-full flex items-center space-x-3 rtl:space-x-reverse px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                    >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>{getTranslation('signOut', currentLang)}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 rtl:lg:pl-0 rtl:lg:pr-64 flex flex-col min-h-screen">
                {/* Top Bar Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                                {getTabTitle(currentTab)}
                            </h2>
                        </div>
                    </div>

                    {/* Right Controls: Language Selector & User Badge */}
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        {/* Language Selector */}
                        <div className="relative flex items-center">
                            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 rtl:left-auto rtl:right-2.5 pointer-events-none" />
                            <select
                                value={currentLang}
                                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                                aria-label="Select display language"
                                className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg pl-8 rtl:pl-2.5 pr-7 rtl:pr-8 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.nativeName} ({lang.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* User Identity Pill */}
                        <div
                            onClick={() => onSelectTab('profile')}
                            className="hidden sm:flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full border border-slate-200 transition-colors cursor-pointer"
                            title={userProfile?.fullName ? `${userProfile.fullName} (${userEmail})` : userEmail}
                        >
                            <User className="w-3.5 h-3.5 text-teal-600" />
                            <span className="max-w-[130px] truncate">
                                {displayName}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Sub-Header Notice Bar */}
                <div className="bg-teal-900 text-teal-100 px-4 sm:px-8 py-2 text-[11px] font-medium flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
                        <span className="truncate">
                            {getTranslation('notice.educational', currentLang)}
                        </span>
                    </div>
                    <span className="hidden md:inline text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                        {getTranslation('notice.secure', currentLang)}
                    </span>
                </div>

                {/* View Body */}
                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-8 text-xs text-slate-500 mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div>© {new Date().getFullYear()} Aperio Health. {getTranslation('footer.rights', currentLang)}</div>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                            <span>{getTranslation('footer.demo', currentLang)}</span>
                            <span>•</span>
                            <span>{getTranslation('footer.private', currentLang)}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
