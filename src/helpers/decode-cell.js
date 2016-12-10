function decodeCol(col) {
  let parseCol = col.match(/[a-zA-Z]+/)[0],
    pow = 1,
    res = 0;

  for (let i = 0, len = parseCol.length; i < len; i++) {
    res += (parseCol[i].charCodeAt(0) - 64) * pow;
    pow *= 25;
  }
  return res - 1;
}

function decodeRow(row) {
  return row.match(/[0-9]+/)[0];
}

export function decodeCell(cell) {
  return {
    'c': decodeCol(cell),
    'r': decodeRow(cell) - 1
  }
}

export function decodeRange(range) {
  let arRange = range.split(new RegExp('\:'));

  return {
    s: {
      'c': decodeCol(arRange[0]),
      'r': decodeRow(arRange[0]) - 1
    },
    e: {
      'c': decodeCol(arRange[1]),
      'r': decodeRow(arRange[1]) - 1
    },
  }
}