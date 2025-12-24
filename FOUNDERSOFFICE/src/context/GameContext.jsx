import React, { createContext, useContext } from 'react';
import { useTeams } from '../hooks/useTeams';

const GameContext = createContext();

export function GameProvider({ children }) {
    const { teams, updatePoints, resetTeams } = useTeams();

    return (
        <GameContext.Provider value={{ teams, updatePoints, resetTeams }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
