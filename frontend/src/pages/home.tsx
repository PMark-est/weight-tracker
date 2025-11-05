// src/pages/WeightTracker.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import AddEntry from '../components/add-entry';
import CurrentWeight from '../components/current-weight';
import History from '../components/history';
import { WeightEntriesProvider } from '../context/WeightEntriesContext';

export const queryClient = new QueryClient();

const WeightTracker: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <WeightEntriesProvider>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl space-y-6">
                        <CurrentWeight />
                        <AddEntry />
                        <History />
                    </div>
                </div>
            </WeightEntriesProvider>
        </QueryClientProvider>
    );
};

export default WeightTracker;
