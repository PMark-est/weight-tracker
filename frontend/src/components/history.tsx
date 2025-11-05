import { useMutation } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useWeightEntries } from "../context/WeightEntriesContext";
import { type WeightEntry } from "../interfaces/weight-entry";
import { queryClient } from "../pages/home";
import EntryRow from "./entry-row";


const History: React.FC = () => {
    const { entries, isLoading } = useWeightEntries();

    const editEntryMutation = useMutation({
        mutationFn: async ({ id, weight }: { id: string; weight: number }) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/weights/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weight }),
            });
            if (!response.ok) throw new Error("Failed to edit entry");
            return response.json() as Promise<WeightEntry>;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData<WeightEntry[]>(["weightEntries"], (old = []) =>
                old.map((e) => (e.id === updated.id ? updated : e))
            );
        },
    });

    const deleteEntryMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/weights/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete entry");
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.setQueryData<WeightEntry[]>(["weightEntries"], (old = []) => old.filter((e) => e.id !== deletedId));
        },
    });

    return (
        <div className="w-full max-w-2xl space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-300" /> History
            </h2>
            <div className="bg-white/10 max-h-[20rem] overflow-scroll backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl space-y-3">
                {isLoading ? (
                    <p className="text-white/50">Loading...</p>
                ) : entries.length === 0 ? (
                    <p className="text-white/50 text-center py-6">No entries yet</p>
                ) : (
                    entries.map((entry) => (
                        <EntryRow
                            key={entry.id}
                            entry={entry}
                            onDelete={(id) => deleteEntryMutation.mutate(id)}
                            onEdit={(id, weight) => editEntryMutation.mutate({ id, weight })}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default History;
