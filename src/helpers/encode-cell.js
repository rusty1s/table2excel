function encodeCol(col) {
  let result = '';
  let i = col + 1;

  while (i > 0) {
    result = String.fromCharCode(((i - 1) % 26) + 65) + result;
    i = Math.floor((i - 1) / 26);
  }

  return result;
}

function encodeRow(row) {
  return (row + 1).toString();
}

export default function encodeCell(cell) {
  return encodeCol(cell.c) + encodeRow(cell.r);
}
