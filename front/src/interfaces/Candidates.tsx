export interface Candidate {
    id: number;
    name: string;
    surname: string;
    party: string;
    image: { [key: number]: number } | null;
    electionId: number;
}
