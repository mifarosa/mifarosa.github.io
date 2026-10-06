// Markdown plugin for the Sätteri processor: turns a block of `| a | b |` lines that has no
// `| --- |` delimiter row into a table. GFM needs that row, and it is easy to leave out
// when writing in the CMS, which otherwise shows the lines as plain text with pipes.

const isRow = (line) => /^\|.*\|$/.test(line);
// Cells between the outer pipes; `\|` is an escaped pipe inside a cell
const cellCount = (line) => line.slice(1, -1).split(/(?<!\\)\|/).length;

export const looseTables = {
  name: 'loose-tables',
  options: { position: true },
  paragraph(node, ctx) {
    const start = node.position?.start?.offset;
    const end = node.position?.end?.offset;
    if (start == null || end == null) return;

    const lines = ctx.source.slice(start, end).split('\n').map((l) => l.trim());
    if (lines.length < 2 || !lines.every(isRow)) return;
    const columns = cellCount(lines[0]);
    if (columns < 2 || !lines.every((l) => cellCount(l) === columns)) return;

    // First line becomes the header; re-parse so inline formatting in cells survives
    const delimiter = `|${' --- |'.repeat(columns)}`;
    ctx.replaceNode(node, { raw: [lines[0], delimiter, ...lines.slice(1)].join('\n') });
  },
};
