export type Category = 'explorateur' | 'confirme';

export interface Team {
    id: string;
    name: string; // e.g., "Guillaume / Maxence"
    members: string[];
    category: Category;
}

export interface Match {
    id: string;
    category: Category;
    terrain: number;
    startTime: string; // ISO string
    endTime: string; // ISO string
    team1Id: string;
    team2Id: string;
    durationMinutes: number;
    scoreTeam1: number | null;
    scoreTeam2: number | null;
    isFinished: boolean;
}

export interface User {
    id: string;
    email: string;
    teamId?: string;
    role: 'player' | 'admin';
    name?: string;
}
