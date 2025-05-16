import React, { useMemo, useEffect, useState } from 'react';
import "../../css/Table.css";

export default function Table({ data }) {
    const headers = useMemo(() => {
        return Array.from(new Set(data.flatMap(row => Object.keys(row))));
    }, [data]);

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const estimatedWidth = headers.reduce((acc, header) => acc + (header.length + 3) * (width / 100), 0);

    const renderHeader = () => {
        return (
            <div className="table-header">
                {headers.map((header) => (
                    <span key={header} className="table-header-element">
                        {header.toUpperCase()}
                    </span>
                ))}
            </div>
        );
    };

    const renderRow = (row, rowIndex) => {
        return (
            <div className="table-row" key={rowIndex}>
                {headers.map((header, columnIndex) => (
                    <span key={`${rowIndex}-${columnIndex}`} className="table-row-element">
                        {row[header] || "-"}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="table-container" style={{ width: `${estimatedWidth}px` }}>
            {renderHeader()}
            <div className="table-body" style={{ height: 250 }}>
                {data.map((row, index) => renderRow(row, index))}
            </div>
        </div>
    );
}

