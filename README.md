# table2excel

`table2excel` is a ecma5 compiled vanilla javascript plugin to convert and download
html tables to a xlsx-file that can be opened in Microsoft Excel.

It uses the awesome [js-xlsx](https://github.com/SheetJS/js-xlsx) plugin from
[Sheet JS](https://github.com/SheetJS) as a dependency. Thanks!

[Demo](https://rusty1s.github.io/table2excel/demo/)

## Quick Start

```html
<script src="table2excel.js"></script>

<script>
  var table2excel = new Table2Excel();
  table2excel.export(document.querySelectorAll("table"));
</script>
```

## Node

```js
// npm install table2excel --save
import 'table2excel';
const Table2Excel = window.Table2Excel;

const table2excel = new Table2Excel(options);
```

See my `webpack` configuration to see how to get `js-xlsx` running with `webpack` in the browser.

## Additional options

You can pass in options as a parameter like `new Table2Excel(options)`.
The currently supported options are:

* `defaultFileName`: The general file name of a downloaded document. Default: `'file'`.
Can also be adjusted individually for `export` as a second parameter, e.g. `table2excel.export(table, "cool table");`.
* `tableNameDataAttribute`: Data attribute name to identify the worksheet name of a table. Default: `'excel-name'`.
Usage: `<table data-excel-name="Check this out">...</table>`. If not set, worksheets are numbered incrementally
from 1.

## Cell type handlers

`table2excel` detects a few special cells by default to display them correctly in Excel:

* **Numbers**
* **Inputs**: for `input[type="text"]`, `select` or `textarea` elements
* **Dates**: tries to parse the date or set the exact timestamp via `data-timestamp` on the cell (recommended!)
* **Booleans**: parses `'true'`, `'false'` or checkboxes/radios without text to booleans
* **Lists**: parses `<ul>...</ul>` or `<ol>...</ol>` list elements to `'..., ...'`

Everything else will just get displayed as simple text. You can easily though add custom type handlers for your own needs:

```js
Table2Excel.extend((cell, cellText) => {
  // {HTMLTableCellElement} cell - The current cell.
  // {string} cellText - The inner text of the current cell.

  // cell should be described by this type handler
  if (selector) return {
    t: ...,
    v: ...,
  };

  // skip and run next handler
  return null;
});
```

The return value must be a [js-xlsx cell object](https://github.com/SheetJS/js-xlsx#cell-object).

## Contributing

If you would like to [submit a pull request](https://github.com/rusty1s/table2excel/pulls)
with any changes you make, please feel free!
Simply run `npm test` to test and `npm start` to compile before submitting pull requests.

## Issues

Please use the [GitHub issue tracker](https://github.com/rusty1s/table2excel/issues)
to raise any problems or feature requests.
