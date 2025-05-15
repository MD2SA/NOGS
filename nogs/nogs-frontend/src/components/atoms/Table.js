import React from 'react';
import "../../css/Table.css";

export default function Table({ data, width = 400, height = 250 }) {
    const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row))));

    const renderHeader = () => {
        return (
            <div className="table-header">
                {headers.map((header) => (
                    <span key={header} className="table-header-element">{header.toUpperCase()}</span>
                ))}
            </div>
        );
    }

    const renderRow = (row, rowIndex) => {
        return (
            <div className="table-row" key={rowIndex}>
                {headers.map((header, columnIndex) => (
                    <span key={rowIndex + "-" + columnIndex} className="table-row-element">{row[header] || "-"}</span>
                ))}
            </div>
        );
    }

    return (
        <div className="table-container" style={{ width: width }}>
            {renderHeader()}
            <div className="table-body" style={{ height: height }}>
                {data.map((row, index) => renderRow(row, index))}
            </div>
        </div>
    );
}
