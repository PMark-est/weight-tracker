import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import EntryRow from "../../src/components/entry-row";
import { type WeightEntry } from "../../src/interfaces/weight-entry";

const mockEntry: WeightEntry = {
    id: "123",
    weight: 70.5,
    timestamp: new Date().toISOString(),
};

describe("EntryRow Component", () => {
    test("renders weight and date correctly", () => {
        render(<EntryRow entry={mockEntry} onDelete={vi.fn()} onEdit={vi.fn()} />);

        expect(screen.getByText("70.5")).toBeInTheDocument();
        expect(screen.getByText(/kg/i)).toBeInTheDocument();
    });
});
