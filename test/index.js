import 'jsdom-global/register';
import { expect } from 'chai';

import '../dist/table2excel';
const Table2Excel = window.Table2Excel;

describe('Tests', () => {
  before(() => {
    document.body.innerHTML =
      '<table id="table1" data-excel-name="A table">' +
        '<thead>' +
          '<tr>' +
            '<th>1</th>' +
            '<th>2</th>' +
            '<th>3</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr>' +
            '<td colspan="2">colspan</td>' +
            '<td rowspan="2">rowspan</td>' +
          '</tr><tr>' +
            '<td data-timestamp="1468834644032">18.07.2016 11:37:24</td>' +
            '<td>07 19, 2016 13:37:00</td>' +
          '</tr><tr>' +
            '<td><input type="text" value="input" /></td>' +
            '<td style="display: none">this should not appear</td>' +
            '<td><select>' +
              '<option value="1">option 1</option>' +
              '<option value="2">option 2</option>' +
            '</select></td>' +
            '<td><textarea>textarea</textarea></td>' +
          '</tr><tr>' +
            '<td><input type="checkbox" checked /></td>' +
            '<td><input type="radio" /></td>' +
            '<td><ul><li>1</li><li>2</li><li>3</li></ul></td>' +
          '</tr>' +
        '</tbody>' +
      '</table>' +
      '<table id="table2"></table>';
  });

  it('should init', () => {
    const defaultFileName = 'table';
    const tableNameDataAttribute = 'table-excel-name';

    const table2excel = new Table2Excel({ defaultFileName, tableNameDataAttribute });

    expect(table2excel.defaultFileName).equal(defaultFileName);
    expect(table2excel.tableNameDataAttribute).equal(tableNameDataAttribute);
  });

  it('should create workbook', () => {
    const table2excel = new Table2Excel();
    const workbook = table2excel.getWorkbook(document.querySelectorAll('table'));

    expect(workbook).to.contain.all.keys(['SheetNames', 'Sheets']);
    expect(workbook.SheetNames.length).equal(2);
    expect(workbook.SheetNames).to.have.deep.property('[0]', 'A table');
    expect(workbook.SheetNames).to.have.deep.property('[1]', '2');
    expect(workbook.Sheets).to.contain.all.keys(['A table', '2']);
  });

  it('should create worksheet for empty table', () => {
    const table2excel = new Table2Excel();
    const worksheet = table2excel.getWorksheet(document.getElementById('table2'));

    expect(worksheet).to.have.property('!ref', 'A1:A0');
    expect(worksheet).to.have.property('!merges');
    expect(worksheet['!merges'].length).equal(0);
    expect(worksheet).to.not.have.property('A1');
  });

  it('should create worksheet for table with all default type handlers', () => {
    const table2excel = new Table2Excel();
    const worksheet = table2excel.getWorksheet(document.getElementById('table1'));

    // 3 columns, 5 rows
    expect(worksheet).to.have.property('!ref', 'A1:C5');

    // 1 colspan, 1 rowspan
    expect(worksheet).to.have.property('!merges');
    expect(worksheet['!merges'].length).equal(2);

    // colspan
    expect(worksheet['!merges'][0]).to.have.property('s');
    expect(worksheet['!merges'][0]).to.have.property('e');
    expect(worksheet['!merges'][0].s).to.have.property('r', 1);
    expect(worksheet['!merges'][0].s).to.have.property('c', 0);
    expect(worksheet['!merges'][0].e).to.have.property('r', 1);
    expect(worksheet['!merges'][0].e).to.have.property('c', 1);

    // rowspan
    expect(worksheet['!merges'][1]).to.have.property('s');
    expect(worksheet['!merges'][1]).to.have.property('e');
    expect(worksheet['!merges'][1].s).to.have.property('r', 1);
    expect(worksheet['!merges'][1].s).to.have.property('c', 2);
    expect(worksheet['!merges'][1].e).to.have.property('r', 2);
    expect(worksheet['!merges'][1].e).to.have.property('c', 2);

    // A1
    expect(worksheet.A1).to.have.property('t', 'n');
    expect(worksheet.A1).to.have.property('v', '1');

    // B1
    expect(worksheet.B1).to.have.property('t', 'n');
    expect(worksheet.B1).to.have.property('v', '2');

    // C1
    expect(worksheet.C1).to.have.property('t', 'n');
    expect(worksheet.C1).to.have.property('v', '3');

    // A2
    expect(worksheet.A2).to.have.property('t', 's');
    expect(worksheet.A2).to.have.property('v', 'colspan');

    // B2
    expect(worksheet).to.not.have.property('B2');

    // C2
    expect(worksheet.C2).to.have.property('t', 's');
    expect(worksheet.C2).to.have.property('v', 'rowspan');

    // A3
    expect(worksheet.A3).to.have.property('t', 'd');
    expect(worksheet.A3).to.have.property('v', '2016-07-18T11:37:24.032Z');

    // B3
    expect(worksheet.B3).to.have.property('t', 'd');
    expect(worksheet.B3).to.have.property('v', '2016-07-19T13:37:00.000Z');

    // C3
    expect(worksheet).to.not.have.property('C3');

    // A4
    expect(worksheet.A4).to.have.property('t', 's');
    expect(worksheet.A4).to.have.property('v', 'input');

    // B4
    expect(worksheet.B4).to.have.property('t', 's');
    expect(worksheet.B4).to.have.property('v', 'option 1');

    // C4
    expect(worksheet.C4).to.have.property('t', 's');
    expect(worksheet.C4).to.have.property('v', 'textarea');

    // A5
    expect(worksheet.A5).to.have.property('t', 'b');
    expect(worksheet.A5).to.have.property('v', true);

    // B5
    expect(worksheet.B5).to.have.property('t', 'b');
    expect(worksheet.B5).to.have.property('v', false);

    // C5
    expect(worksheet.C5).to.have.property('t', 's');
    expect(worksheet.C5).to.have.property('v', '1, 2, 3');
  });

  it('should extend its default cell type handlers', () => {
    Table2Excel.extend(() => {
      const object = {
        v: 'foo',
        t: 's',
      };
      return object;
    });

    const table2excel = new Table2Excel();
    const worksheet = table2excel.getWorksheet(document.getElementById('table1'));

    expect(worksheet.A1).to.have.property('t', 's');
    expect(worksheet.A1).to.have.property('v', 'foo');
  });
});
