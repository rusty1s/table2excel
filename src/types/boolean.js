/**
 * Generates a cell object for a boolean cell.
 *
 * @param {HTMLTableCellElement} cell - The cell.
 *
 * @returns {object} - A cell object of the cell or `null` if the cell doesn't
 * fulfill the criteria of an input field cell.
 */
export default (cell, text) => {
  if (text === 'true' || text === 'false') {
    return { t: 'b', v: !!text };
  }

  const option = cell.querySelector('input[type="checkbox"], input[type="radio"]');
  if (option && text === '') {
    return { t: 'b', v: option.checked };
  }

  return null;
};
