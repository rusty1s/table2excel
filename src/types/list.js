/**
 * Generates a cell object for a list cell.
 *
 * @param {HTMLTableCellElement} cell - The cell.
 *
 * @returns {object} - A cell object of the cell or `null` if the cell doesn't
 * fulfill the criteria of an input field cell.
 */
export default cell => {
  const list = cell.querySelector('ul, ol');

  if (list) {
    let string = '';
    const items = Array.from(list.querySelectorAll('li'));

    items.forEach((item, index) => {
      string += item.textContent;
      string += index < items.length - 1 ? ', ' : '';
    });

    return { t: 's', v: string };
  }

  return null;
};
