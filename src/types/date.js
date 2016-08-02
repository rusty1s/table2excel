/**
 * Generates a cell object for a date cell.
 *
 * @param {HTMLTableCellElement} cell - The cell.
 * @param {string} text - The text of the cell.
 *
 * @returns {object} - A cell object of the cell or `null` if the cell doesn't
 * fulfill the criteria of a date cell.
 */
export default (cell, text) => {
  function getValue(date) {
    const offset = new Date().getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString();
  }

  const timestamp = cell.getAttribute('data-timestamp');
  if (timestamp) {
    return { t: 'd', v: getValue(new Date(parseInt(timestamp, 10))) };
  }

  const date = new Date(text);
  if (!isNaN(date)) return { t: 'd', v: getValue(date) };

  return null;
};
