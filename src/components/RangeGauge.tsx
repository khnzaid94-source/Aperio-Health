import React from 'react';
import { ClassificationType } from '../types';

interface RangeGaugeProps {
    value: number;
    min: number;
    max: number;
    unit: string;
    classification: ClassificationType;
}

export const RangeGauge: React.FC<RangeGaugeProps> = ({
    value,
    min,
    max,
    unit,
    classification
}) => {
    const rangeSpan = max - min;
    if (rangeSpan <= 0) return null;

    // Calculate percentage position along a scale that covers [min - 0.5*span, max + 0.5*span]
    const scaleMin = Math.max(0, min - rangeSpan * 0.4);
    const scaleMax = max + rangeSpan * 0.4;
    const scaleSpan = scaleMax - scaleMin;

    const getPercent = (val: number) => {
        const p = ((val - scaleMin) / scaleSpan) * 100;
        return Math.min(Math.max(p, 2), 98); // Clamp within 2% to 98%
    };

    const valuePos = getPercent(value);
    const normalStart = getPercent(min);
    const normalEnd = getPercent(max);

    return (
        <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <span>Visual Range Gauge</span>
                <span dir="ltr">{value} {unit}</span>
            </div>

            {/* Gauge Track */}
            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                {/* Low Zone (Left) */}
                <div
                    className="absolute top-0 bottom-0 bg-amber-100/90 border-r border-amber-300/80 left-0"
                    style={{ width: `${normalStart}%` }}
                />

                {/* Normal Zone (Green) */}
                <div
                    className="absolute top-0 bottom-0 bg-emerald-200 border-x border-emerald-400"
                    style={{
                        left: `${normalStart}%`,
                        width: `${normalEnd - normalStart}%`
                    }}
                />

                {/* High Zone (Right) */}
                <div
                    className="absolute top-0 bottom-0 bg-rose-100 right-0"
                    style={{ left: `${normalEnd}%` }}
                />

                {/* Value Marker Pin */}
                <div
                    className={`absolute top-0 bottom-0 w-2.5 -ml-1 rounded-full border-2 border-white shadow-md transition-all ${
                        classification === 'High'
                            ? 'bg-rose-600'
                            : classification === 'Low'
                            ? 'bg-amber-600 shadow-amber-600/30'
                            : 'bg-emerald-600'
                    }`}
                    style={{ left: `${valuePos}%` }}
                    title={`Measured Value: ${value} ${unit}`}
                />
            </div>

            {/* Boundary Labels */}
            <div className="flex justify-between text-[10px] text-slate-500 font-medium px-0.5" dir="ltr">
                <span className="text-amber-800 font-bold">Low (&lt; {min})</span>
                <span className="text-emerald-700 font-bold">Normal ({min} – {max} {unit})</span>
                <span className="text-rose-700">High (&gt; {max})</span>
            </div>
        </div>
    );
};
