"use client";
import { useState, useMemo, useRef, useEffect } from 'react';
import { useTournament } from '@/hooks/useTournament';
import { MatchCard } from '@/components/match/MatchCard';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button, Badge, Card } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function MatchesPage() {
    const { matches, teams, loading } = useTournament();

    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [teamFilter, setTeamFilter] = useState<string[]>([]);
    const [terrainFilter, setTerrainFilter] = useState<number[]>([]);
    const [statusFilter, setStatusFilter] = useState<string | null>(null); // 'finished' | 'pending' | null
    const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(true);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsTeamDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTeam = (teamId: string) => {
        setTeamFilter(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        );
    };

    const toggleTerrain = (terrain: number) => {
        setTerrainFilter(prev =>
            prev.includes(terrain)
                ? prev.filter(t => t !== terrain)
                : [...prev, terrain]
        );
    };

    const filteredMatches = useMemo(() => {
        let filtered = [...matches];

        if (categoryFilter) {
            filtered = filtered.filter(m => m.category === categoryFilter);
        }

        if (teamFilter.length > 0) {
            filtered = filtered.filter(m =>
                teamFilter.includes(m.team1Id) || teamFilter.includes(m.team2Id)
            );
        }

        if (terrainFilter.length > 0) {
            filtered = filtered.filter(m => terrainFilter.includes(m.terrain));
        }

        if (statusFilter === 'finished') {
            filtered = filtered.filter(m => m.isFinished);
        } else if (statusFilter === 'pending') {
            filtered = filtered.filter(m => !m.isFinished && !m.timerStartedAt);
        } else if (statusFilter === 'ongoing') {
            filtered = filtered.filter(m => !m.isFinished && m.timerStartedAt);
        }

        return filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }, [matches, categoryFilter, teamFilter, terrainFilter, statusFilter]);

    const resetFilters = () => {
        setCategoryFilter(null);
        setTeamFilter([]);
        setTerrainFilter([]);
        setStatusFilter(null);
    };

    const hasActiveFilters = categoryFilter || teamFilter.length > 0 || terrainFilter.length > 0 || statusFilter;

    if (loading) {
        return <div className="min-h-screen bg-stoneo-900 flex items-center justify-center text-white">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-stoneo-900 pb-24">
            <Header title="Tous les matchs" subtitle={`${filteredMatches.length} match${filteredMatches.length > 1 ? 's' : ''}`} />

            <main className="p-4 space-y-4">
                {/* Filters Section - Collapsible */}
                <Card className="p-4 sticky top-16 z-30 bg-stoneo-800/95 backdrop-blur-md">
                    <button
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className="w-full flex items-center justify-between mb-3"
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-padel-yellow" />
                            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Filtres</h2>
                            {hasActiveFilters && (
                                <Badge className="bg-padel-yellow text-stoneo-900 text-[10px] px-2 py-0.5">
                                    {[categoryFilter, statusFilter].filter(Boolean).length + teamFilter.length + terrainFilter.length}
                                </Badge>
                            )}
                        </div>
                        {isFiltersOpen ? <ChevronUp size={20} className="text-white/50" /> : <ChevronDown size={20} className="text-white/50" />}
                    </button>

                    <AnimatePresence>
                        {isFiltersOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    {/* Category Filter */}
                                    <div>
                                        <label className="text-[10px] text-white/50 uppercase tracking-wider block mb-2">Catégorie</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => setCategoryFilter(null)}
                                                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${!categoryFilter
                                                    ? 'bg-padel-green text-stoneo-900'
                                                    : 'bg-stoneo-900/50 text-white/50 border border-white/10 hover:border-padel-green/50'
                                                    }`}
                                            >
                                                Toutes
                                            </button>
                                            <button
                                                onClick={() => setCategoryFilter('explorateur')}
                                                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${categoryFilter === 'explorateur'
                                                    ? 'bg-padel-green text-stoneo-900'
                                                    : 'bg-stoneo-900/50 text-white/50 border border-white/10 hover:border-padel-green/50'
                                                    }`}
                                            >
                                                Explorateur
                                            </button>
                                            <button
                                                onClick={() => setCategoryFilter('confirme')}
                                                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${categoryFilter === 'confirme'
                                                    ? 'bg-padel-green text-stoneo-900'
                                                    : 'bg-stoneo-900/50 text-white/50 border border-white/10 hover:border-padel-green/50'
                                                    }`}
                                            >
                                                Confirmé
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <label className="text-[10px] text-white/50 uppercase tracking-wider block mb-2">Statut</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => setStatusFilter(null)}
                                                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${!statusFilter
                                                    ? 'bg-padel-green text-stoneo-900'
                                                    : 'bg-stoneo-900/50 text-white/50 border border-white/10 hover:border-padel-green/50'
                                                    }`}
                                            >
                                                Tous
                                            </button>
                                            <button
                                                onClick={() => setStatusFilter('pending')}
                                                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${statusFilter === 'pending'
                                                    ? 'bg-padel-green text-stoneo-900'
                                                    : 'bg-stoneo-900/50 text-white/50 border border-white/10 hover:border-padel-green/50'
                                                    }`}
                                            >
                                                À jouer
                                            </button>
                                            <button
                                                onClick={() => setStatusFilter('finished')}
                                                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${statusFilter === 'finished'
                                                    ? 'bg-padel-green text-stoneo-900'
                                                    : 'bg-stoneo-900/50 text-white/50 border border-white/10 hover:border-padel-green/50'
                                                    }`}
                                            >
                                                Terminés
                                            </button>
                                        </div>
                                    </div>

                                    {/* Team Filter - Custom Multi-Select */}
                                    <div ref={dropdownRef} className="relative">
                                        <label className="text-[10px] text-white/50 uppercase tracking-wider block mb-2">
                                            Équipes {teamFilter.length > 0 && `(${teamFilter.length})`}
                                        </label>
                                        <button
                                            onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                                            className="w-full bg-stoneo-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-padel-green focus:outline-none cursor-pointer hover:border-padel-green/50 transition-all flex items-center justify-between"
                                        >
                                            <span className={teamFilter.length > 0 ? 'text-white' : 'text-white/50'}>
                                                {teamFilter.length > 0 ? `${teamFilter.length} équipe${teamFilter.length > 1 ? 's' : ''} sélectionnée${teamFilter.length > 1 ? 's' : ''}` : 'Toutes les équipes'}
                                            </span>
                                            <ChevronDown
                                                className={`text-white/30 transition-transform ${isTeamDropdownOpen ? 'rotate-180' : ''}`}
                                                size={16}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {isTeamDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full mt-2 left-0 right-0 bg-stoneo-800 border border-white/10 rounded-lg overflow-hidden shadow-2xl z-50 max-h-96 overflow-y-auto"
                                                >
                                                    {teamFilter.length > 0 && (
                                                        <button
                                                            onClick={() => setTeamFilter([])}
                                                            className="w-full px-4 py-2 text-left text-xs text-padel-yellow hover:bg-padel-green/10 transition-colors border-b border-white/5 font-bold"
                                                        >
                                                            ✕ Tout désélectionner
                                                        </button>
                                                    )}
                                                    {teams.filter(team => !categoryFilter || team.category === categoryFilter).map(team => (
                                                        <button
                                                            key={team.id}
                                                            onClick={() => toggleTeam(team.id)}
                                                            className={`w-full px-6 py-4 text-left text-base hover:bg-padel-green/10 transition-colors flex items-center gap-4 min-h-[60px] border-b border-white/5 last:border-0 ${teamFilter.includes(team.id) ? 'text-padel-green bg-padel-green/5' : 'text-white/70 hover:text-white'
                                                                }`}
                                                        >
                                                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${teamFilter.includes(team.id) ? 'bg-padel-green border-padel-green' : 'border-white/30'
                                                                }`}>
                                                                {teamFilter.includes(team.id) && (
                                                                    <svg className="w-3 h-3 text-stoneo-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <span className="font-medium">Team {team.id} - {team.name}</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Terrain Filter - Multi-Select */}
                                    <div>
                                        <label className="text-[10px] text-white/50 uppercase tracking-wider block mb-2">
                                            Terrains {terrainFilter.length > 0 && `(${terrainFilter.length})`}
                                        </label>
                                        <div className="grid grid-cols-6 gap-2">
                                            <button
                                                onClick={() => setTerrainFilter([])}
                                                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${terrainFilter.length === 0
                                                    ? 'bg-padel-green text-stoneo-900'
                                                    : 'bg-stoneo-900/50 text-white/50 border border-white/10 hover:border-padel-green/50'
                                                    }`}
                                            >
                                                Tous
                                            </button>
                                            {[1, 2, 3, 4, 5].map(terrain => (
                                                <button
                                                    key={terrain}
                                                    onClick={() => toggleTerrain(terrain)}
                                                    className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${terrainFilter.includes(terrain)
                                                        ? 'bg-padel-green text-stoneo-900'
                                                        : 'bg-stoneo-900/50 text-white/50 border border-white/10 hover:border-padel-green/50'
                                                        }`}
                                                >
                                                    T{terrain}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Active Filters & Reset */}
                                {hasActiveFilters && (
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                        <div className="flex gap-2 flex-wrap">
                                            {categoryFilter && (
                                                <Badge className="bg-padel-green/20 text-padel-green text-[10px] flex items-center gap-1">
                                                    {categoryFilter === 'explorateur' ? 'Explorateur' : 'Confirmé'}
                                                    <X size={12} className="cursor-pointer" onClick={() => setCategoryFilter(null)} />
                                                </Badge>
                                            )}
                                            {statusFilter && (
                                                <Badge className="bg-padel-green/20 text-padel-green text-[10px] flex items-center gap-1">
                                                    {statusFilter === 'finished' ? 'Terminés' : 'À jouer'}
                                                    <X size={12} className="cursor-pointer" onClick={() => setStatusFilter(null)} />
                                                </Badge>
                                            )}
                                            {teamFilter.map(teamId => {
                                                const team = teams.find(t => t.id === teamId);
                                                return team ? (
                                                    <Badge key={teamId} className="bg-padel-green/20 text-padel-green text-[10px] flex items-center gap-1">
                                                        Team {team.id}
                                                        <X size={12} className="cursor-pointer" onClick={() => toggleTeam(teamId)} />
                                                    </Badge>
                                                ) : null;
                                            })}
                                            {terrainFilter.map(terrain => (
                                                <Badge key={terrain} className="bg-padel-green/20 text-padel-green text-[10px] flex items-center gap-1">
                                                    Terrain {terrain}
                                                    <X size={12} className="cursor-pointer" onClick={() => toggleTerrain(terrain)} />
                                                </Badge>
                                            ))}
                                        </div>
                                        <Button variant="ghost" className="text-xs h-7 px-3" onClick={resetFilters}>
                                            Réinitialiser
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                {/* Matches List */}
                {filteredMatches.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Calendar className="mx-auto mb-3 text-white/30" size={48} />
                        <p className="text-white/50">Aucun match trouvé avec ces filtres</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredMatches.map((match, i) => {
                            const team1 = teams.find(t => t.id === match.team1Id);
                            const team2 = teams.find(t => t.id === match.team2Id);

                            if (!team1 || !team2) return null;

                            return (
                                <motion.div
                                    key={match.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <MatchCard match={match} team1={team1} team2={team2} />
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
