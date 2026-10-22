import type { ReactNode } from 'react';
import type { IFeatureTable } from '@/db/classes/class.d';

/**
 * Convenção de escrita das descrições.
 *
 * Linhas iniciadas por "-" viram uma lista; linhas seguidas formam a mesma
 * lista. É a notação que as pessoas já usam ao escrever, e que antes saía como
 * texto corrido com traços soltos no meio.
 *
 * As tabelas entram por um marcador `[[tabela:N]]` deixado pelo parser na
 * posição original — há descrições com texto antes e depois da tabela, e
 * empurrá-la para o fim mudaria o sentido.
 */

// "-" abre um item; cada traço a mais desce um nível ("--" é sub-item de "-").
// "*" e "•" valem como um traço, porque é o que as pessoas já digitam.
const LIST_ITEM = /^(-{1,4}|[*•])\s+(.*)$/;

interface IListNode {
  text: string;
  children: IListNode[];
}

/**
 * Monta a árvore da lista a partir da profundidade de cada linha.
 *
 * Um item mais fundo que o anterior vira filho dele; um item mais raso fecha
 * os níveis abertos até encontrar o pai certo. Uma linha "--" sem nenhum "-"
 * antes não é erro: ela simplesmente nasce na raiz.
 */
function buildList(items: { depth: number; text: string }[]): IListNode[] {
  const roots: IListNode[] = [];
  const open: { depth: number; node: IListNode }[] = [];

  for (const item of items) {
    const node: IListNode = { text: item.text, children: [] };
    while (open.length > 0 && open[open.length - 1].depth >= item.depth) {
      open.pop();
    }
    if (open.length === 0) roots.push(node);
    else open[open.length - 1].node.children.push(node);
    open.push({ depth: item.depth, node });
  }

  return roots;
}

function renderList(
  nodes: IListNode[],
  handles: Record<string, string>,
  key: string
): ReactNode {
  return (
    <ul key={key} className={handles.codexBullets}>
      {nodes.map((node, i) => (
        <li key={i}>
          {node.text}
          {node.children.length > 0 &&
            renderList(node.children, handles, `${key}-${i}`)}
        </li>
      ))}
    </ul>
  );
}

function renderParagraphs(text: string, handles: Record<string, string>) {
  const out: ReactNode[] = [];
  let items: { depth: number; text: string }[] = [];

  const flushList = () => {
    if (items.length === 0) return;
    out.push(renderList(buildList(items), handles, `l${out.length}`));
    items = [];
  };

  for (const line of text.split('\n')) {
    const item = LIST_ITEM.exec(line.trim());
    if (item) {
      const marker = item[1];
      items.push({
        depth: marker.startsWith('-') ? marker.length : 1,
        text: item[2].trim(),
      });
      continue;
    }
    flushList();
    if (line.trim()) {
      out.push(
        <p key={`p${out.length}`} className={handles.codexFeatureText}>
          {line.trim()}
        </p>
      );
    }
  }
  flushList();
  return out;
}

export function renderDescription(
  text: string | undefined,
  tables: IFeatureTable[] | undefined,
  handles: Record<string, string>
) {
  if (!text) return null;
  const parts = text.split(/\[\[tabela:(\d+)\]\]/g);

  return parts.map((part, i) => {
    // Os índices ímpares são os números capturados pelo grupo da regex.
    if (i % 2 === 1) {
      const table = tables?.[Number(part)];
      if (!table) return null;
      return (
        <table key={`t${i}`} className={handles.codexInnerTable}>
          {table.headers && (
            <thead>
              <tr>
                {table.headers.map((header, j) => (
                  <th key={j}>{header}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {table.rows.map((row, j) => (
              <tr key={j}>
                {row.map((cell, c) => (
                  <td key={c}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return <div key={i}>{renderParagraphs(part, handles)}</div>;
  });
}
