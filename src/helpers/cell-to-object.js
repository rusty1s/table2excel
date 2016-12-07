/**
 * Converts a HTMLTableCellElement to an XLSX-Cell object.
 * Output varies on detected content of the cell calculated by
 * the `typeHandlers`.
 *
 * @param {HTMLTableCellElement} cell - The cell.
 * @param {array} typeHandlers - The registered cell type handlers.
 *
 * @returns {object} - The cell object.
 */
export default function cellToObject(cell, typeHandlers) {
  let cellObject = null;
  const text = cell.textContent.trim() || '';

  // custom handlers
  typeHandlers.some(typeHandler => (cellObject = typeHandler(cell, text)));

  // default handler
  if (!cellObject) cellObject = { t: 's', v: text };

  // styling
  if (cell.tagName === 'TH' && !cellObject.s){
  	cellObject.s = { font: { bold: true } };
  }

  return cellObject;
}
