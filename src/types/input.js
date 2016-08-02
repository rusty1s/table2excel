/**
 * Generates a cell object for an input field cell.
 *
 * @param {HTMLTableCellElement} cell - The cell.
 *
 * @returns {object} - A cell object of the cell or `null` if the cell doesn't
 * fulfill the criteria of an input field cell.
 */
export default cell => {
  const input = cell.querySelector('input[type="text"], select, textarea');
  if (input) return { t: 's', v: input.value };

  return null;
};
