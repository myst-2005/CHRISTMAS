import { useState, useEffect } from 'react';

const INITIAL_TEAMS = [
  { id: '1', name: 'Team One', points: 0, color: '#D42426' }, // Christmas Red
  { id: '2', name: 'Team Two', points: 0, color: '#165B33' }, // Christmas Green
  { id: '3', name: 'Team Three', points: 0, color: '#F8B229' }, // Gold
  { id: '4', name: 'Team Four', points: 0, color: '#146B3A' }, // Forest Green
  { id: '5', name: 'Team Five', points: 0, color: '#BE5BF2' }, // Festive Purple
];

export function useTeams() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('haca-christmas-teams');
    if (saved) {
      try {
        setTeams(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse teams", e);
      }
    }
  }, []);

  // Sync across tabs (Real-time update)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'haca-christmas-teams') {
        const newVal = e.newValue;
        if (newVal) {
          setTeams(JSON.parse(newVal));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to localStorage whenever teams change
  useEffect(() => {
    localStorage.setItem('haca-christmas-teams', JSON.stringify(teams));

    // Manually trigger storage event for current tab (optional, mostly for other tabs)
    // We don't need to do anything here as React state handles the current tab
  }, [teams]);

  const updatePoints = (id, points) => {
    setTeams(prev => {
      const newTeams = prev.map(team =>
        team.id === id ? { ...team, points: parseInt(points) || 0 } : team
      );
      // We manually dispatch a storage event for OTHER tabs on the same domain to pick up immediately 
      // (Standard storage event only fires on other tabs, so this is correct behavior)
      return newTeams;
    });
  };

  const resetTeams = () => {
    setTeams(INITIAL_TEAMS);
  };

  return { teams, updatePoints, resetTeams };
}
