/**
 * Funcion para sobreescribir el archivo linea por linea
 * @param {String} _currentLine Linea actual del archivo
 * @param {String} _code Tracking-code
 * @param {Number} _counter Contador para incremetar los tracking-code
 * @returns una nueva linea del archivo
 */

let rewriteLine = (_currentLine, _code, _counter) => {
  let newLine = "";
  if (_currentLine.includes("TCG_DYT")) {
    let finalTrackingCode = "";
    _counter++;

    if (_counter > 99) {
      finalTrackingCode = `${_code}${_counter}`;
    } else if (_counter > 9) {
      finalTrackingCode = `${_code}0${_counter}`;
    } else {
      finalTrackingCode = `${_code}00${_counter}`;
    }
    newLine += _currentLine.replace("TCG_DYT", finalTrackingCode);
    return { line: newLine + "\n", counter: _counter };
  }
  return { line: _currentLine + "\n", counter: _counter };
};

module.exports = rewriteLine;
