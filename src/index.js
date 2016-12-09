import 'xlsx-style/dist/xlsx.core.min';

import { saveAs } from 'filesaver.js';

import tableToData from './helpers/table-to-data';
import dataToWorksheet from './helpers/data-to-worksheet';

import {decodeCell, decodeRange } from './helpers/decode-cell.js';
import {encodeCell, encodeRange} from './helpers/encode-cell.js';

import listHandler from './types/list';
import numberHandler from './types/number';
import dateHandler from './types/date';
import inputHandler from './types/input';
import booleanHandler from './types/boolean';

/**
 * @param {string} defaultFileName - The file name if download
 * doesn't provide a name. Default: 'file'.
 * @ param {string} tableNameDataAttribute - The identifier of
 * the name of the table as a data-attribute. Default: 'excel-name'
 * results to `<table data-excel-name="Another table">...</table>`.
 */
const defaultOptions = {
  defaultFileName: 'file',
  tableNameDataAttribute: 'excel-name',

  /**
   * The event will be fired before add worksheet
   * into workbook
   *
   * @param {object} worksheet
   * @param {string} name - worksheet name
   * @returns {object} worksheet
   */
  beforeWorksheetAdded: function(worksheet, name){
    return worksheet;
  },
};

/**
 * The default type handlers: lists, numbers, dates, input fields and booleans.
 */
const typeHandlers = [
  listHandler,
  inputHandler,
  numberHandler,
  dateHandler,
  booleanHandler,
];

/**
 * Creates a `Table2Excel` object to export HTMLTableElements
 * to a xlsx-file via its function `export`.
 */
export default class Table2Excel {
  /**
   * @param {object} options - Overrides the default options.
   */
  constructor(options = {}) {
    Object.assign(this, defaultOptions, options);
  }

  /**
   * Exports HTMLTableElements to a xlsx-file.
   *
   * @param {NodeList} tables - The tables to export.
   * @param {string} fileName - The file name.
   */
  export(tables, fileName = this.defaultFileName) {
    this.download(this.getWorkbook(tables), fileName);
  }

  /**
   * Get the XLSX-Workbook object of an array of tables.
   *
   * @param {NodeList} tables - The tables.
   * @returns {object} - The XLSX-Workbook object of the tables.
   */
  getWorkbook(tables) {
    return Array.from(tables.length ? tables : [tables])
      .reduce((workbook, table, index) => {
        let dataName = '';

        if (table.querySelector('caption')){
          dataName = table.querySelector('caption').innerText;
        } else {
          dataName = table.getAttribute(`data-${this.tableNameDataAttribute}`);
        }

        const name = dataName || (index + 1).toString();

        let worksheet = this.getWorksheet(table);

        if (typeof this.beforeWorksheetAdded === 'function'){
          worksheet = this.beforeWorksheetAdded(worksheet, name);
        }

        workbook.SheetNames.push(name);
        workbook.Sheets[name] = worksheet;

        return workbook;
      }, { SheetNames: [], Sheets: {} });
  }

  /**
   * Get the XLSX-Worksheet object of a table.
   *
   * @param {HTMLTableElement} table - The table.
   * @returns {object} - The XLSX-Worksheet object of the table.
   */
  getWorksheet(table) {
    if (!table || table.tagName !== 'TABLE') {
      throw new Error('Element must be a table');
    }

    return dataToWorksheet(tableToData(table), typeHandlers);
  }


  /**
   * Change top-left table corner.
   * At the same time there is a shift of all internal objects
   *
   * @param {object} WS - worksheet object
   * @param {object} newPos - new top-left coordinate
   * @returns {object}
   */
  depositionWorksheetTable(WS = {}, newPos = {c: 0, r: 0}){
    let decodeCellItem = {},
      decodeRangeItem = {},
      newWS = {
        '!merges': [],
        '!ref': '',
      };

    for (let key in WS) {
      switch(key){
        case '!merges':
          for (let mergeKey in WS[key]) {
            newWS['!merges'].push({
              e: {
                c: WS[key][mergeKey].e.c + newPos.c,
                r: WS[key][mergeKey].e.r + newPos.r,
              },
              s: {
                c: WS[key][mergeKey].s.c + newPos.c,
                r: WS[key][mergeKey].s.r + newPos.r,
              },
            });
          }
          break;
        case '!ref':
          decodeRangeItem = decodeRange(WS[key]);

          /**
           * We don't move start range position (A1)
           */
          decodeRangeItem.e.c += newPos.c;
          decodeRangeItem.e.r += newPos.r;

          newWS['!ref'] = encodeRange(decodeRangeItem);
          break;
        case '!cols':
          newWS['!cols'] = WS[key];

          for (let i = 0; i < newPos.c; i++){
            newWS['!cols'].unshift(null);
          }

          break;
        default:
          decodeCellItem = decodeCell(key);
          decodeCellItem.c += newPos.c;
          decodeCellItem.r += newPos.r;

          newWS[encodeCell(decodeCellItem)] = WS[key];
          break;
      }
    }
    return newWS;
  }

  /**
   * Exports a XLSX-Workbook object to a xlsx-file.
   *
   * @param {object} workbook - The XLSX-Workbook.
   * @param {string} fileName - The file name.
   */
  download(workbook, fileName = this.defaultFileName) {
    function convert(data) {
      const buffer = new ArrayBuffer(data.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i <= data.length; i++) {
        view[i] = data.charCodeAt(i) & 0xFF;
      }
      return buffer;
    }

    const data = window.XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'binary',
    });

    const blob = new Blob([convert(data)], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  }
}


// add global reference to `window` if defined
if (window) window.Table2Excel = Table2Excel;

/**
 * Adds the type handler to the beginning of the list of type handlers.
 * This way it can override general solutions provided by the default handlers
 * with more specific ones.
 *
 * @param {function} typeHandler - Type handler that generates a cell
 * object for a specific cell that fulfills specific criteria.
 * *
 * * @param {HTMLTableCellElement} cell - The cell that should be parsed to a cell object.
 * * @param {string} text - The text of the cell.
 * *
 * * @returns {object} - Cell object (see: https://github.com/SheetJS/js-xlsx#cell-object)
 * * or `null` iff the cell doesn't fulfill the criteria of the type handler.
 */
Table2Excel.extend = function extendCellTypes(typeHandler) {
  typeHandlers.unshift(typeHandler);
};
