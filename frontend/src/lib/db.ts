import Dexie, { Table } from "dexie";

export interface ReflectionEntry {
    id?: number
    date: string // ISO date string
    response: string
    quote: string
}

class SoloCoach extends Dexie {
    reflections!: Table<ReflectionEntry, number>;

    constructor() {
        super("SoloCoach");
        this.version(1).stores({
            reflections: "++id, date"
        })
    }
}

export const db = new SoloCoach();