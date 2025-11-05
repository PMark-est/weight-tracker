// src/context/WeightEntriesContext.tsx
import { useQuery } from '@tanstack/react-query';
import React, { createContext, type ReactNode, useContext } from 'react';
import { type WeightEntry } from '../interfaces/weight-entry';


interface WeightEntriesContextValue {
    entries: WeightEntry[];
    isLoading: boolean;
}

const WeightEntriesContext = createContext<WeightEntriesContextValue>({
    entries: [],
    isLoading: false,
});

export const WeightEntriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data: entries = [], isLoading } = useQuery({
        queryKey: ['weightEntries'],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/weights`);
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json() as Promise<WeightEntry[]>;
        },
    });

    return (
        <WeightEntriesContext.Provider value={{ entries, isLoading }}>
            {children}
        </WeightEntriesContext.Provider>
    );
};

// Custom hook to use context
export const useWeightEntries = () => useContext(WeightEntriesContext);
