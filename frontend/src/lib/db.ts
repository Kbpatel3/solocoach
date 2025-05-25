import Dexie, { Table } from "dexie";

export interface ReflectionEntry {
    id?: number
    date: string // ISO date string
    response: string
    quote: string
}

export interface WeeklyQuestions {
    id?: number
    weekStart: string // ISO date string
    questions: string[]
}

class SoloCoach extends Dexie {
    reflections!: Table<ReflectionEntry, number>;
    weeklyQuestions!: Table<WeeklyQuestions, number>;

    constructor() {
        super("SoloCoach");
        this.version(2).stores({
            reflections: "++id, date",
            weeklyQuestions: "++id, &weekStart"
        })
    }
}

export const db = new SoloCoach();