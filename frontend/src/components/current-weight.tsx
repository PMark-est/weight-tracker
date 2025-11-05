import { TrendingDown, TrendingUp, Weight } from 'lucide-react';
import React from 'react';
import { useWeightEntries } from '../context/WeightEntriesContext';

interface TrendInfo {
    icon: React.FC<any> | null;
    color: string;
    text: string;
}


const CurrentWeight = () => {
    const { entries, isLoading } = useWeightEntries();

    const getWeightDiff = (): number => {
        if (entries.length < 2) return 0;
        return entries[0].weight - entries[1].weight;
    };

    const getTrend = (): TrendInfo => {
        const diff = getWeightDiff();
        if (diff > 0) return { icon: TrendingUp, color: 'text-red-400', text: `+${diff.toFixed(1)} kg` };
        if (diff < 0) return { icon: TrendingDown, color: 'text-green-400', text: `${diff.toFixed(1)} kg` };
        return { icon: null, color: 'text-gray-400', text: 'No change' };
    };

    const trend = getTrend();
    const TrendIcon = trend.icon;

    const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
        <div className={`animate-pulse bg-white/10 rounded ${className}`}></div>
    );

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-purple-300 p-3 rounded-2xl">
                        <Weight className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Weight Tracker</h1>
                        <p className="text-sm">Monitor your progress</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="rounded-2xl p-6 border border-white/10">
                    <div className="flex items-end justify-between">
                        <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-12 w-40" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                    </div>
                </div>
            ) : entries.length > 0 ? (
                <div className="rounded-2xl shadow-xl p-6 border border-white/10">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm mb-1">Current Weight</p>
                            <p className="text-5xl font-bold text-white">
                                {entries[0].weight}{' '}
                                <span className="text-2xl">kg</span>
                            </p>
                        </div>
                        {TrendIcon && (
                            <div className={`flex items-center gap-2 ${trend.color}`}>
                                <TrendIcon className="w-6 h-6" />
                                <span className="text-xl font-semibold">{trend.text}</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CurrentWeight;
