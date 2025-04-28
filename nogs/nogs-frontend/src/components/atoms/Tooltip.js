import React from 'react';

export default function Tooltip({ text, children }) {
    return (
        <div className="tooltip-wrapper">
            {children}
            <div className="tooltip">{text}</div>
        </div>
    )
};
