import { Person } from "./person";

export interface Family {
    id: number;
    name: string;
    max_persons: string;
    persons: Person[];
}