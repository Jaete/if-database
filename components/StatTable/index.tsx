'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import StatTableHandles from './handles';
import '@/styles/components/statTable.scss';

export interface IStatTableRow {
  key: string;
  cells: [React.ReactNode, React.ReactNode];
}

interface IProps {
  columns?: [React.ReactNode, React.ReactNode];
  rows: IStatTableRow[];
  bodyId?: string;
}

const StatTable = ({ columns, rows, bodyId }: IProps) => {
  const handles = useCssHandles(StatTableHandles);

  return (
    <table className={handles.statTable}>
      {columns && (
        <thead>
          <tr>
            <td>
              <strong>{columns[0]}</strong>
            </td>
            <td>
              <strong>{columns[1]}</strong>
            </td>
          </tr>
        </thead>
      )}
      <tbody id={bodyId}>
        {rows.map((row) => (
          <tr key={row.key}>
            <td className={handles.statTableKey}>{row.cells[0]}</td>
            <td className={handles.statTableValue}>{row.cells[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StatTable;
