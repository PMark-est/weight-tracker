import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { type WeightEntry } from "../interfaces/weight-entry";

interface WeightEntryRowProps {
    entry: WeightEntry;
    onDelete: (id: string) => void;
    onEdit: (id: string, weight: number) => void;
}


const EntryRow: React.FC<WeightEntryRowProps> = ({ entry, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editWeight, setEditWeight] = useState(entry.weight.toFixed(1));
    const [isInvalid, setIsInvalid] = useState(false);

    const saveEdit = () => {
        const w = parseFloat(editWeight);
        if (!isNaN(w) && w > 25 && w < 250) {
            onEdit(entry.id, w);
            setIsEditing(false);
        } else {
            setIsInvalid(true);
        }
    };

    return (
        <div className="bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center justify-between transition-all duration-200 border border-white/10 group">
            <div className="flex items-center gap-4">
                {isEditing ? (
                    <input
                        type="number"
                        step="0.1"
                        value={editWeight}
                        onChange={(e) => setEditWeight(e.target.value)}
                        className={`w-28 text-center bg-white/10 border rounded-lg px-3 py-2 text-white text-xl font-mono font-bold focus:outline-none ${isInvalid ? "border-red-500 ring-2 ring-red-500/50" : "border-slate-400 focus:ring-2 focus:ring-slate-400/50"
                            }`}
                        autoFocus
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                    />
                ) : (
                    <div className="bg-slate-500/20 rounded-lg w-28 text-center py-2 flex flex-col items-center justify-center">
                        <p className="text-2xl font-bold font-mono text-white">{entry.weight.toFixed(1)}</p>
                        <p className="text-xs text-slate-200/60">kg</p>
                    </div>
                )}
                <div>
                    <p className="text-white font-medium">{new Date(entry.timestamp).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <button onClick={saveEdit} className="bg-green-500/20 hover:bg-green-500/30 text-green-300 p-2 rounded-lg">
                            <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setIsEditing(false)} className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg">
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 p-2 rounded-lg">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(entry.id)} className="opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg">
                            <X className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EntryRow;
