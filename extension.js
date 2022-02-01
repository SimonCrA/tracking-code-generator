// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const generateCode = require("./generate_code");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function activate(context) {
  try {
    let disposable = vscode.commands.registerCommand("tcg.generateCode", async function () {
      const CURRENT_FILE_PATH = vscode.window.activeTextEditor.document.fileName;
      let codeType = "";
      let newFile = "";
      let counter = 0;
      let finalTrackingCode = "";

      // Pickers to select the type of code to generate
      const TYPE_SELECTED = await vscode.window.showQuickPick([
        "validate",
        "controller",
        "service",
      ]);
      const FILE_TYPE_SELECTED = await vscode.window.showQuickPick([
        "auth",
        "operation",
        "profile",
        "list",
      ]);
      if (TYPE_SELECTED === "controller") {
        codeType = await vscode.window.showQuickPick(["err", "res"]);
      }
      //Code generated
      const CODE = generateCode(TYPE_SELECTED, FILE_TYPE_SELECTED, codeType);

      // console.log(CODE);
      let lineSplitted = [];
      fs.readFileSync(CURRENT_FILE_PATH, "utf-8")
        .split(/\n/)
        .forEach((currentLine) => {
          const EXIST_TRACKING_CODE_LINE = currentLine.includes("new ErrorUtilClass");

          if (EXIST_TRACKING_CODE_LINE) {
            counter++;
            if (counter > 999) {
              finalTrackingCode = `${CODE}${counter}`;
            } else if (counter > 99) {
              finalTrackingCode = `${CODE}${counter}`;
            } else if (counter > 9) {
              finalTrackingCode = `${CODE}0${counter}`;
            } else {
              finalTrackingCode = `${CODE}00${counter}`;
            }
            // console.log("Tracking-code ", finalTrackingCode);
            lineSplitted = currentLine.split("'");
            lineSplitted.forEach((phrase, index) =>
              index === 1
                ? (lineSplitted[index] = `${finalTrackingCode}`)
                : (lineSplitted[index] = phrase)
            );

            newFile += lineSplitted.join("'") + "\n";
          } else {
            newFile += currentLine + "\n";
          }
        });

      //we save the new file with new tracking-codes
      fs.writeFile(CURRENT_FILE_PATH, newFile, "utf8", function (_err) {
        if (_err) return console.log(_err);
        vscode.window.setStatusBarMessage(
          "Los tracking-code del archivo han sido actualizados exitosamente."
        );
      });
    });

    context.subscriptions.push(disposable);
  } catch (_error) {
    console.log(_error);
  }
}
// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
