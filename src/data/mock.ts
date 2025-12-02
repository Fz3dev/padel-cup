import { Team, Match } from './index';

export const TEAMS: (Team & { color: string })[] = [
    // Explorateurs
    { id: 'A', name: 'Guillaume / Maxence', members: ['Guillaume', 'Maxence'], category: 'explorateur', color: '#000000' }, // Black
    { id: 'B', name: 'Cyril / Sandra', members: ['Cyril', 'Sandra'], category: 'explorateur', color: '#EF4444' }, // Red
    { id: 'C', name: 'Emile / Aminata', members: ['Emile', 'Aminata'], category: 'explorateur', color: '#0EA5E9' }, // Blue
    { id: 'D', name: 'Alim / Manon', members: ['Alim', 'Manon'], category: 'explorateur', color: '#F472B6' }, // Pink

    // Confirmés
    { id: 'E', name: 'Fawsy / François N.', members: ['Fawsy', 'François N.'], category: 'confirme', color: '#FFFF00' }, // Yellow
    { id: 'F', name: 'Nicolas / Pierre', members: ['Nicolas', 'Pierre'], category: 'confirme', color: '#22C55E' }, // Green
    { id: 'G', name: 'Philippe / Marine', members: ['Philippe', 'Marine'], category: 'confirme', color: '#F97316' }, // Orange
    { id: 'H', name: 'Meyer / Clément', members: ['Meyer', 'Clément'], category: 'confirme', color: '#FFFFFF' }, // White
    { id: 'I', name: 'Laurent / François V.', members: ['Laurent', 'François V.'], category: 'confirme', color: '#A855F7' }, // Purple
    { id: 'J', name: 'Corentin / Johanne', members: ['Corentin', 'Johanne'], category: 'confirme', color: '#6B7280' }, // Grey
];

const createDate = (hour: number, minute: number) => {
    const date = new Date('2025-12-03T00:00:00');
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
};

export const MATCHES: Match[] = [
    // --- Explorateurs (33 min) ---
    // Match 1: 09:10 - 09:43
    { id: 'm1', category: 'explorateur', terrain: 1, durationMinutes: 33, startTime: createDate(9, 10), endTime: createDate(9, 43), team1Id: 'A', team2Id: 'B', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm2', category: 'explorateur', terrain: 2, durationMinutes: 33, startTime: createDate(9, 10), endTime: createDate(9, 43), team1Id: 'C', team2Id: 'D', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    // Match 2: 09:48 - 10:21
    { id: 'm3', category: 'explorateur', terrain: 1, durationMinutes: 33, startTime: createDate(9, 48), endTime: createDate(10, 21), team1Id: 'A', team2Id: 'C', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm4', category: 'explorateur', terrain: 2, durationMinutes: 33, startTime: createDate(9, 48), endTime: createDate(10, 21), team1Id: 'B', team2Id: 'D', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    // Match 3: 10:26 - 10:59
    { id: 'm5', category: 'explorateur', terrain: 1, durationMinutes: 33, startTime: createDate(10, 26), endTime: createDate(10, 59), team1Id: 'A', team2Id: 'D', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm6', category: 'explorateur', terrain: 2, durationMinutes: 33, startTime: createDate(10, 26), endTime: createDate(10, 59), team1Id: 'B', team2Id: 'C', scoreTeam1: null, scoreTeam2: null, isFinished: false },

    // --- Confirmés (18 min) ---
    // Match 1: 09:10 - 09:28
    { id: 'm7', category: 'confirme', terrain: 3, durationMinutes: 18, startTime: createDate(9, 10), endTime: createDate(9, 28), team1Id: 'E', team2Id: 'F', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm8', category: 'confirme', terrain: 4, durationMinutes: 18, startTime: createDate(9, 10), endTime: createDate(9, 28), team1Id: 'G', team2Id: 'H', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm9', category: 'confirme', terrain: 5, durationMinutes: 18, startTime: createDate(9, 10), endTime: createDate(9, 28), team1Id: 'I', team2Id: 'J', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    // Match 2: 09:33 - 09:51
    { id: 'm10', category: 'confirme', terrain: 3, durationMinutes: 18, startTime: createDate(9, 33), endTime: createDate(9, 51), team1Id: 'E', team2Id: 'G', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm11', category: 'confirme', terrain: 4, durationMinutes: 18, startTime: createDate(9, 33), endTime: createDate(9, 51), team1Id: 'F', team2Id: 'I', scoreTeam1: null, scoreTeam2: null, isFinished: false }, // F vs I (Image 4 T4) -> Wait, Image 4 T4 is F vs I? Yes.
    { id: 'm12', category: 'confirme', terrain: 5, durationMinutes: 18, startTime: createDate(9, 33), endTime: createDate(9, 51), team1Id: 'H', team2Id: 'J', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    // Match 3: 09:56 - 10:14
    { id: 'm13', category: 'confirme', terrain: 3, durationMinutes: 18, startTime: createDate(9, 56), endTime: createDate(10, 14), team1Id: 'E', team2Id: 'H', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm14', category: 'confirme', terrain: 4, durationMinutes: 18, startTime: createDate(9, 56), endTime: createDate(10, 14), team1Id: 'F', team2Id: 'J', scoreTeam1: null, scoreTeam2: null, isFinished: false }, // F vs J (Image 4 T4)
    { id: 'm15', category: 'confirme', terrain: 5, durationMinutes: 18, startTime: createDate(9, 56), endTime: createDate(10, 14), team1Id: 'G', team2Id: 'I', scoreTeam1: null, scoreTeam2: null, isFinished: false }, // G vs I (Image 4 T5)
    // Match 4: 10:19 - 10:37
    { id: 'm16', category: 'confirme', terrain: 3, durationMinutes: 18, startTime: createDate(10, 19), endTime: createDate(10, 37), team1Id: 'E', team2Id: 'I', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm17', category: 'confirme', terrain: 4, durationMinutes: 18, startTime: createDate(10, 19), endTime: createDate(10, 37), team1Id: 'F', team2Id: 'H', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm18', category: 'confirme', terrain: 5, durationMinutes: 18, startTime: createDate(10, 19), endTime: createDate(10, 37), team1Id: 'G', team2Id: 'J', scoreTeam1: null, scoreTeam2: null, isFinished: false }, // G vs J (Image 4 T5)
    // Match 5: 10:42 - 11:00
    { id: 'm19', category: 'confirme', terrain: 3, durationMinutes: 18, startTime: createDate(10, 42), endTime: createDate(11, 0), team1Id: 'E', team2Id: 'J', scoreTeam1: null, scoreTeam2: null, isFinished: false },
    { id: 'm20', category: 'confirme', terrain: 4, durationMinutes: 18, startTime: createDate(10, 42), endTime: createDate(11, 0), team1Id: 'F', team2Id: 'G', scoreTeam1: null, scoreTeam2: null, isFinished: false }, // F vs G (Image 4 T4)
    { id: 'm21', category: 'confirme', terrain: 5, durationMinutes: 18, startTime: createDate(10, 42), endTime: createDate(11, 0), team1Id: 'H', team2Id: 'I', scoreTeam1: null, scoreTeam2: null, isFinished: false }, // H vs I (Image 4 T5)
];
