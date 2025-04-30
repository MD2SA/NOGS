import React from 'react';
import { TableVirtuoso } from 'react-virtuoso';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' }
];

const data = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`
}));

export default function Table() {
  return (
    <div style={{ height: '500px' }}>
      <TableVirtuoso
        data={data}
        fixedHeaderContent={() => (
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        )}
        itemContent={(index, item) => (
          <>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
          </>
        )}
      />
    </div>
  );
}
