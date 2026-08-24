import React from 'react';
import { Microscope, Globe, LogOut, User } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/translations';
import { getTranslation } from '../utils/language';

interface HeaderProps {
    userEmail: string;
    currentLang: SupportedLanguage;
    onLanguageChange: (lang: SupportedLanguage) => void;
    onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    userEmail,
    currentLang,
    onLanguageChange,
    onSignOut
}) => {
    const userName = userEmail ? userEmail.split('@')[0] : 'User';

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="bg-gradient-to-tr from-teal-600 to-emerald-500 p-2.5 rounded-xl text-white shadow-sm">
                        <Microscope className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            {getTranslation('appName', currentLang)}
                        </h1>
                        <p className="text-xs font-medium text-slate-500 hidden sm:block">
                            {getTranslation('appSubtitle', currentLang)}
                        </p>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
                    {/* Language Selector */}
                    <div className="relative flex items-center">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
                        <select
                            value={currentLang}
                            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                            aria-label="Select interface language"
                            className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg pl-9 rtl:pl-3 pr-8 rtl:pr-9 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        >
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.nativeName} ({lang.name})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* User Profile & Sign Out */}
                    {userEmail && (
                        <div className="flex items-center space-x-2 sm:space-x-3 border-l border-slate-200 pl-3 sm:pl-4 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-3 sm:rtl:pr-4">
                            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                <User className="w-3.5 h-3.5 text-slate-500" />
                                <span className="max-w-[120px] truncate" title={userEmail}>
                                    {userName}
                                </span>
                            </div>

                            <button
                                onClick={onSignOut}
                                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                                title={getTranslation('signOut', currentLang)}
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">{getTranslation('signOut', currentLang)}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
