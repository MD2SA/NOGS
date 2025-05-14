import React from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import "../../css/Table.css";

export default function Table({ data, width = 400, height = 250 }) {

    const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row))));
    /*
     pega nos nomes dos fields dos fields e guarda num array:
         [
            { id: 1, name: 'Alice' },
            { email: 'bob@example.com', name: 'Bob' }
        ]
        e transforma no set [id,name,email] (sem duplicados) e depois em array para + funcionalidades
    */

    return (
        <div className="table-container" style={{ height: height, width: width }}>
            <TableVirtuoso
                data={data}
                style={{
                    width: '100%',
                    tableLayout: 'fixed'
                }}
                fixedHeaderContent={() => (
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header.toUpperCase()}</th>
                        ))}
                    </tr>
                )}
                itemContent={(_, item) => (
                    <>
                        {headers.map((header) => (
                            <td key={header}>{item[header] ?? '-'}</td>
                        ))}
                    </>
                )}
            />
        </div>
    );
}
