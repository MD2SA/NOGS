import { useMemo, useEffect, useState } from 'react';

/**
 * @param extra: { title:string, value:string, onClick:()=>{} || undefined}
 * */
export default function Table({ data, extra }) {
    const [factor, setFactor] = useState({ mult: 10, offset: 8 });

    useEffect(() => {
        const resize = () => {
            const w = window.innerWidth;
            setFactor(
                w < 600 ? { mult: 6, offset: 6 } :
                    w < 1024 ? { mult: 8, offset: 10 } :
                        { mult: 10, offset: 12 }
            );
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const headers = useMemo(() => {
        return Array.from(new Set(data.flatMap(row => Object.keys(row))));
    }, [data]);

    const columnWidths = useMemo(() => {
        const widths = {};
        headers.forEach(header => {
            widths[header] = Math.max(
                header.length * factor.mult + factor.offset,
                ...data.map(row =>
                    String(row[header] || "-").length * factor.mult + factor.offset
                )
            );
        });
        return widths;
    }, [headers, data, factor]);

    const extraWidth = useMemo(() => {
        if (!extra) return 0;
        return Math.max(
            extra.title?.length || 0,
            String(extra.value).length || 0
        ) * factor.mult + factor.offset;
    }, [extra, factor]);

    const renderHeader = () => (
        <div className="table-header">
            {headers.map((header) => (
                <span
                    key={header}
                    className="table-header-element"
                    style={{ width: `${columnWidths[header]}px` }}
                >
                    {header.toUpperCase()}
                </span>
            ))}
            {extra &&
                <span
                    key="extra-header"
                    className="table-header-element"
                    style={{ width: `${extraWidth}px` }}
                >
                    {extra?.title?.toUpperCase()}
                </span>
            }
        </div>
    );

    const renderRow = (row, rowIndex) => (
        <div className="table-row" key={rowIndex}>
            {headers.map((header) => (
                <span
                    key={`${rowIndex}-${header}`}
                    className="table-row-element"
                    style={{ width: `${columnWidths[header]}px` }}
                >
                    {row[header] || "-"}
                </span>
            ))}
            {extra &&
                <span
                    key={`extra-${rowIndex}`}
                    className="table-row-element extra-row-element"
                    onClick={() => {
                        extra?.onClick?.(rowIndex);
                    }}
                    style={{ width: `${extraWidth}px` }}
                >
                    {extra?.value}
                </span>
            }
        </div>
    );

    return (
        <div className="table-container" style={{
            width: `max(100%, ${Object.values(columnWidths).reduce((a, b) => a + b, 0) + extraWidth}px)`
        }}>
            {renderHeader()}
            <div className="table-body" style={{ height: 250 }}>
                {data.map(renderRow)}
            </div>
        </div>
    );
}

