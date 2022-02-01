/**
 * Funcion para generar un tracking code dependiendo del archivo y tipo.
 * @param {String} _type_selected - tipo de logica
 * @param {String} _file_type_selected Tipo de archivo
 * @param {String} _code_type Tipo de codigo, error o respuesta
 * @returns tracking code generado
 */

let generateCode = (_type_selected, _file_type_selected, _code_type) => {
  let code = "";
  switch (_type_selected) {
    case "validate":
      code += "MV";
      break;
    case "controller":
      code += "C";
      break;
    case "service":
      code += "S";
      break;
  }
  switch (_file_type_selected) {
    case "auth":
      code += "AUT";
      break;
    case "operation":
      code += "OPE";
      break;
    case "profile":
      code += "PRO";
      break;
    case "list":
      code += "LIS";
      break;
  }

  if (_type_selected === "controller") {
    switch (_code_type) {
      case "err":
        code += "E";
        break;
      case "res":
        code += "S";
        break;
    }
  } else {
    code += "E";
  }
  return code;
};

module.exports = generateCode;
