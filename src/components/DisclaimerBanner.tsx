import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getTranslation } from '../utils/language';

interface DisclaimerBannerProps {
    currentLang: SupportedLanguage;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ currentLang }) => {
    return (
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 shadow-inner">
            <div className="max-w-7xl mx-auto flex items-start sm:items-center space-x-2.5 rtl:space-x-reverse">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="leading-relaxed font-medium">
                    <span className="font-bold text-amber-950 mr-1.5 rtl:ml-1.5 rtl:mr-0">
                        [{getTranslation('disclaimerTitle', currentLang)}]
                    </span>
                    {getTranslation('disclaimerText', currentLang)}
                </div>
            </div>
        </div>
    );
};
