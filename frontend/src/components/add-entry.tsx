import { useMutation } from "@tanstack/react-query";
import { Loader2, Plus, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { type WeightEntry } from "../interfaces/weight-entry";
import { queryClient } from "../pages/home";

const AddEntry: React.FC = () => {
    const [weight, setWeight] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);

    const addEntryMutation = useMutation({
        mutationFn: async (weight: number) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/weights`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weight }),
            });
            if (!response.ok) throw new Error("Failed to add entry");
            return response.json() as Promise<WeightEntry>;
        },
        onSuccess: (newItem) => {
            console.log("New item:", newItem);

            // Prepend new entry
            queryClient.setQueryData<WeightEntry[]>(["weightEntries"], (old = []) => [newItem, ...old]);

            // Scroll history container to top
            const container = document.getElementById("history-scroll-container");
            if (container) {
                container.scrollTop = 0;
            }
        },
    });

    const handleAdd = () => {
        const w = parseFloat(weight);
        if (!isNaN(w) && w >= 25 && w <= 250) {
            addEntryMutation.mutate(w);
            setWeight("");
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex gap-2 items-center">
                <input
                    type="number"
                    step="0.1"
                    placeholder="Enter weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    disabled={addEntryMutation.isPending}
                    className={`flex-1 bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isInvalid
                        ? "border-red-500 ring-2 ring-red-500/50 shake"
                        : "border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        }`}
                    onKeyPress={(e) => e.key === "Enter" && !addEntryMutation.isPending && handleAdd()}
                />
                <button
                    onClick={handleAdd}
                    disabled={addEntryMutation.isPending}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {addEntryMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Plus className="w-5 h-5" />
                    )}
                </button>
            </div>

            {isInvalid && (
                <p className="text-red-400 text-sm mt-2 font-medium flex gap-2">
                    <TriangleAlertIcon /> Please enter a valid weight between 25 and 250 kg
                </p>
            )}
        </div>
    );
};

export default AddEntry;
