import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function Leaderboard() {
    const { teams } = useGame();

    // Sort teams by points descending
    const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

    // Memoize snowflakes to avoid re-rendering them unnecessarily
    const snowflakes = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => (
            <div
                key={i}
                className="snowflake"
                style={{
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    width: `${Math.random() * 5 + 2}px`,
                    height: `${Math.random() * 5 + 2}px`,
                }}
            />
        ));
    }, []);

    return (
        <div className="page-container">
            {/* Snowfall Background */}
            <div className="snow-container">
                {snowflakes}
            </div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="title text-gradient floating"
            >
                🎄 HACA Holiday Leaderboard 🎄
            </motion.h1>

            <div className="leaderboard-list">
                <AnimatePresence>
                    {sortedTeams.map((team, index) => (
                        <motion.div
                            key={team.id}
                            layout
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="team-card glass"
                            style={{
                                borderColor: team.color,
                                background: `linear-gradient(90deg, ${team.color}22, rgba(255,255,255,0.05))`
                            }}
                        >
                            <div className="team-info">
                                <div className="rank" style={{ color: team.color }}>
                                    #{index + 1}
                                </div>
                                <div className="team-details">
                                    <h2 className="team-name" style={{ color: team.id === '1' || team.id === '2' ? '#fff' : team.color }}>
                                        {team.name}
                                    </h2>
                                    <p className="team-subtitle">
                                        {index === 0 ? '🎅 Current Leader' : '🦌 Chasing the Sleigh'}
                                    </p>
                                </div>
                            </div>

                            <div className="team-score-container">
                                <motion.span
                                    className="team-score"
                                    key={team.points}
                                    initial={{ scale: 1.5, color: '#fff' }}
                                    animate={{ scale: 1, color: team.color }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {team.points}
                                </motion.span>
                                <span className="score-label">Holiday Points</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
