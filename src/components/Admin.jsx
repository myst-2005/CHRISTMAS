import React, { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const { teams, updatePoints, resetTeams } = useGame();
    const navigate = useNavigate();

    // Memoize snowflakes for consistent background
    const snowflakes = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => (
            <div
                key={i}
                className="snowflake"
                style={{
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 5 + 5}s`, // Slower fall for admin
                    animationDelay: `${Math.random() * 5}s`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                }}
            />
        ));
    }, []);

    return (
        <div className="page-container">
            <div className="snow-container">
                {snowflakes}
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass admin-panel"
            >
                <div className="admin-header">
                    <h1 className="text-gradient" style={{ fontFamily: 'Mountains of Christmas', fontSize: '2.5rem', margin: 0 }}>🎅 Santa's Control Panel</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="link-button"
                    >
                        view leaderboard ➔
                    </button>
                </div>

                <div className="admin-teams-list">
                    {teams.map(team => (
                        <div key={team.id} className="admin-team-row">
                            <div
                                className="team-color-indicator"
                                style={{ backgroundColor: team.color }}
                            />
                            <div className="team-name-col">
                                <h3 className="team-name-small">{team.name}</h3>
                            </div>
                            <div className="points-controls">
                                <button
                                    onClick={() => updatePoints(team.id, team.points - 10)}
                                    className="control-btn minus big"
                                    title="Naughty List (-10)"
                                >
                                    -10
                                </button>
                                <button
                                    onClick={() => updatePoints(team.id, team.points - 1)}
                                    className="control-btn minus"
                                    title="Coal (-1)"
                                >
                                    -1
                                </button>
                                <input
                                    type="number"
                                    value={team.points}
                                    onChange={(e) => updatePoints(team.id, e.target.value)}
                                    className="points-input"
                                />
                                <button
                                    onClick={() => updatePoints(team.id, team.points + 1)}
                                    className="control-btn plus"
                                    title="Cookie (+1)"
                                >
                                    +1
                                </button>
                                <button
                                    onClick={() => updatePoints(team.id, team.points + 10)}
                                    className="control-btn plus big"
                                    title="Present (+10)"
                                >
                                    +10
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="admin-footer">
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to reset the holidays? 🎄')) resetTeams();
                            }}
                            className="reset-btn"
                        >
                            Reset Tournament
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
