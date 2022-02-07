const vscode = require("vscode");
const fs = require("fs");

/**
 * funcion para encontrar el numero de tracking code mas grande.
 * @param {String} _currentLine linea actual del archivo
 * @param {String} _file_code codigo que se quiere analizar
 * @param {Number} _biggest_code codigo mas grande hasta el momento
 * @returns el numero de tracking code mas grande del archivo.
 */
let findBiggestCode = (_currentLine, _file_code, _biggest_code) => {
  let code_index = _currentLine.indexOf(_file_code);
  let code_number = parseInt(
    _currentLine.slice(code_index + _file_code.length, code_index + _file_code.length + 3)
  );

  if (_biggest_code <= code_number) {
    _biggest_code = code_number;
  } else {
    _biggest_code = _biggest_code;
  }
  return _biggest_code;
};

/**
 * Funcion para buscar en el archivo el ultimo tracking-code
 * @param {String} _file_path - tipo de logica
 * @returns devuelve el tracking code mas grande
 */

let analyzeCode = async (_file_path) => {
  let err_code = false;
  let res_code = false;
  let biggest_code = 1;
  let final_number = "";

  const FILE_CODE = await vscode.window.showInputBox({
    title: "Tracking code analyzer",
    prompt: "introduzca el código que desea analizar en el documento, sin los números.",
    placeHolder: "ejm. COPEE",
  });
  if (FILE_CODE == undefined || FILE_CODE == "") {
    return null;
  }
  const ARR_CODE = FILE_CODE.split("");
  ARR_CODE[ARR_CODE.length - 1] == "S" ? (res_code = true) : (err_code = true);

  fs.readFileSync(_file_path, "utf-8")
    .split(/\n/)
    .forEach((currentLine) => {
      const CODE_EXIST = currentLine.includes(FILE_CODE);
      const RES_EXIST = currentLine.includes("CC_RESPONSE.core().send(");
      const ERR_EXIST = currentLine.includes("new ErrorUtilClass");
      if (ERR_EXIST && CODE_EXIST && err_code) {
        const BIGGEST_CODE_FOUND = findBiggestCode(currentLine, FILE_CODE, biggest_code);
        biggest_code = BIGGEST_CODE_FOUND;
      } else if (RES_EXIST && CODE_EXIST && res_code) {
        const BIGGEST_CODE_FOUND = findBiggestCode(currentLine, FILE_CODE, biggest_code);
        biggest_code = BIGGEST_CODE_FOUND;
      }
    });

  if (biggest_code > 99) {
    final_number = biggest_code.toString();
  } else if (biggest_code > 9) {
    final_number = `0${biggest_code}`;
  } else {
    final_number = `00${biggest_code}`;
  }
  return `${FILE_CODE} ${final_number}`;
};
module.exports = analyzeCode;
