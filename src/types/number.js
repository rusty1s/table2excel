/**
 * Generates a cell object for a number cell.
 *
 * @param {HTMLTableCellElement} cell - The cell.
 * @param {string} text - The text of the cell.
 *
 * @returns {object} - A cell object of the cell or `null` if the cell doesn't
 * fulfill the criteria of a number cell.
 */
export default (cell, text) => {
  if (text.length > 0 && !isNaN(text)) return { t: 'n', v: text };

  return null;
};
