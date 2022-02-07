// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
const fs = require("fs");
const generateCode = require("./generate_code");
const analyzeCode = require("./analyze_code");
const rewriteLine = require("./rewrite_line");

let processAborted = () => {
  vscode.window.showErrorMessage("Proceso de generacion de tracking-code cancelado.");
  return false;
};

function activate(context) {
  try {
    let disposable = vscode.commands.registerCommand("tcg.generateCode", async function () {
      const CURRENT_FILE_PATH = vscode.window.activeTextEditor.document.fileName;
      let newFile = "";
      let code = "";

      const ACTION = await vscode.window.showQuickPick(["analyze", "rewrite"]);

      switch (ACTION) {
        case "analyze":
          const ANALYZER_CODE = await analyzeCode(CURRENT_FILE_PATH);
          if (!ANALYZER_CODE) return processAborted();

          //Code analized
          code = ANALYZER_CODE;
          break;
        case "rewrite":
          //Code generated
          code = await generateCode();
          if (!code) return processAborted();
          break;

        case undefined:
          return processAborted();
      }

      //counter will start differently depending on if we want to analize the file or rewrite the current codes.
      let counter = ACTION == "analyze" ? parseInt(code.split(" ")[1]) : 0;

      //going through the file line by line
      fs.readFileSync(CURRENT_FILE_PATH, "utf-8")
        .split(/\n/)
        .forEach((currentLine) => {
          if (ACTION == "analyze") {
            const CODE = code.split(" ")[0];
            const RES_LINE = rewriteLine(currentLine, CODE, counter);
            counter = RES_LINE.counter;
            newFile += RES_LINE.line;
          } else {
            const RES_LINE = rewriteLine(currentLine, code, counter);
            counter = RES_LINE.counter;
            newFile += RES_LINE.line;
          }
        });

      //we save the new file with new tracking-codes
      fs.writeFile(CURRENT_FILE_PATH, newFile, "utf8", function (_err) {
        if (_err) return console.log(_err);
        vscode.window.showInformationMessage(
          "Los tracking-code del archivo han sido actualizados exitosamente."
        );
      });
    });

    context.subscriptions.push(disposable);
  } catch (_error) {
    console.log(_error);
    vscode.window.showErrorMessage(_error.message);
  }
}
// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
