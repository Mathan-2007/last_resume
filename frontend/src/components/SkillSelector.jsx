import React, { useState } from 'react';

const skills = [
    "React", "Angular", "Vue", "JavaScript", "TypeScript",
    "Python", "Java", "Node.js", "C#", ".NET",
    "MongoDB", "MySQL", "PostgreSQL", "SQL",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"
];

const skillSelectorStyles = {
    container: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: 'bold',
    },
    skillList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        listStyle: 'none',
        padding: 0,
    },
    skillItem: {
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
};

export default function SkillSelector({ selectedSkills, onChange }) {

    const handleSkillClick = (skill) => {
        const newSelectedSkills = selectedSkills.includes(skill)
            ? selectedSkills.filter(s => s !== skill)
            : [...selectedSkills, skill];
        onChange(newSelectedSkills);
    };

    return (
        <div style={skillSelectorStyles.container}>
            <label style={skillSelectorStyles.label}>Select skills to focus on:</label>
            <ul style={skillSelectorStyles.skillList}>
                {skills.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    const style = {
                        ...skillSelectorStyles.skillItem,
                        backgroundColor: isSelected ? 'var(--primary-accent)' : '#e2e8f0',
                        color: isSelected ? 'white' : 'var(--primary-text)',
                    };
                    return (
                        <li
                            key={skill}
                            style={style}
                            onClick={() => handleSkillClick(skill)}
                        >
                            {skill}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
