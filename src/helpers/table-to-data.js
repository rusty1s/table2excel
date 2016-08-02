/**
 * Calculates the cells and its rowspans and colspans of a table.
 *
 * `cells` is a 2-d array containing the HTMLTableCellElement cells.
 * Rowspans and Colspans are indicated as `null` values.
 *
 * Rowspans and Colspans are also saved in `ranges`.
 * An element contains the start and end position of a rowspan or
 * colspan like { s: { r: 1, c: 1 }, e: { r:1, c: 4} }.
 *
 * @param {HTMLTableElment} table - The table.
 * @returns { { cells: Array, ranges: Array } } - The table object.
 */
export default function tableToData(table) {
  const cells = [];
  const ranges = [];

  // iterate over all rows
  Array.from(table.querySelectorAll('tr')).forEach((row, rowIndex) => {
    cells.push([]);

    // iterate over all cells in the row
    Array.from(row.querySelectorAll('td, th')).forEach(cell => {
      ranges.forEach(range => {
        if (  // we are in a rowspan (already saved in ranges)
        rowIndex >= range.s.r &&
        rowIndex <= range.e.r &&
        cells[rowIndex].length >= range.s.c &&
        cells[rowIndex].length <= range.e.c
        ) {
          // ... fill the cells with empty values
          Array(range.e.c - range.s.c + 1).forEach(() => {
            cells[rowIndex].push(null);
          });
        }
      });

      // detect new rowspan or colspan
      const colspan = cell.colSpan || 1;
      const rowspan = cell.rowSpan || 1;
      if (rowspan !== 1 || colspan !== 1) {
        ranges.push({
          s: {
            r: rowIndex,
            c: cells[rowIndex].length,
          },
          e: {
            r: rowIndex + rowspan - 1,
            c: cells[rowIndex].length + colspan - 1,
          },
        });
      }

      cells[rowIndex].push(cell);

      // if we are in a following colspan ...
      if (colspan) {
        Array(colspan - 1).forEach(() => {
          cells[rowIndex].push(null);
        });
      }
    });
  });

  return { cells, ranges };
}
