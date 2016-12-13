import {encodeCell} from './encode-cell.js';
import cellToObject from './cell-to-object';

/**
 * Returns the XLSX-Worksheet object given the data of a
 * table calculated by `tableToData`.
 *
 * @param {object} data - The data calculated by `tableToData`.
 * @param {array} typeHandlers - The registered cell type handlers.
 *
 * @returns {object} - XLSX-Worksheet object.
 */
export default function dataToWorksheet(data, typeHandlers) {
  const { cells, ranges } = data;

  let lastColumn = 0;
  // convert cells array to an object by iterating over all rows
  const worksheet = cells.reduce((sheet, row, rowIndex) => {
    // iterate over all row cells
    row.forEach((cell, columnIndex) => {
      lastColumn = Math.max(lastColumn, columnIndex);

      // convert the row and column indices to a XLSX index
      const ref = encodeCell({
        c: columnIndex,
        r: rowIndex,
      });

      // only save actual cells and convert them to XLSX-Cell objects
      if (cell) {
        sheet[ref] = cellToObject(cell, typeHandlers);
      } else {
          sheet[ref] =  { t: 's', v: '' };
      }
    });

    return sheet;
  }, {});

  // calculate last table index (bottom right)
  const lastRef = encodeCell({
    c: lastColumn,
    r: cells.length - 1,
  });

  // add last table index and ranges to the worksheet
  worksheet['!ref'] = `A1:${lastRef}`;
  worksheet['!merges'] = ranges;
  worksheet['!cols'] = [];

  let cols = {};
  for(let i = 0; i <= cells[0].length; i++){
    cols['cell' + i] = false;
  }

  cells.reduce((sheet, row, rowIndex) => {
    // iterate over all row cells
    row.forEach((cell, columnIndex) => {

      if (cell){
        const colspan = parseInt(cell.colSpan, 10) || 1;
        if ((colspan == 1) && (!cols['cell' + columnIndex])){
          cols['cell' + columnIndex] = {
            wpx: cell.offsetWidth
          };
        }
      }
    });
  }, {});

  for(let key in cols){
    if (cols[key]){
      worksheet['!cols'].push(cols[key]);
    } else {
      worksheet['!cols'].push(null);
    }
  }
  return worksheet;
}
