const vscode = require("vscode");

/**
 * Funcion para generar un tracking code dependiendo del archivo y tipo.
 * @returns tracking code generado
 */

let generateCode = async () => {
  let codeType = "";
  let typeSelected = "";
  let fileTypeSelected = "";
  let code = "";

  // Pickers to select the type of code to generate
  const MODE = await vscode.window.showQuickPick(["default", "custom"]);

  if (MODE === "default") {
    typeSelected = await vscode.window.showQuickPick(["validate", "controller", "service"]);
    fileTypeSelected = await vscode.window.showQuickPick(["auth", "operation", "profile", "list"]);

    if (typeSelected === "controller") {
      codeType = await vscode.window.showQuickPick(["err", "res"]);
    }

    if (typeSelected == undefined || fileTypeSelected == undefined || codeType == undefined) {
      return null;
    }

    switch (typeSelected) {
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

    switch (fileTypeSelected) {
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

    if (typeSelected === "controller") {
      switch (codeType) {
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
  } else if (MODE === "custom") {
    const MODE = await vscode.window.showInputBox({
      title: "Tracking Code Generator",
      prompt: "introduzca el código en mayúscula usando sólo letras.",
      placeHolder: "ejm. MVOPEE",
    });

    if (MODE == undefined || "") {
      return null;
    }
    code = MODE;
  } else {
    return null;
  }

  return code;
};

module.exports = generateCode;
