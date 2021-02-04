"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const Timer_1 = require("./Timer");
function activate({ subscriptions }) {
    const config = vscode.workspace.getConfiguration("BreakTime"); //user configuration
    if (config.enabled === true) {
        const timerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 299);
        const timerStatusBarTxt = `Next Break`;
        //Timer
        const timer = new Timer_1.Timer(timerStatusBarItem, timerStatusBarTxt);
        const timerCommandId = "BreackTime.start";
        subscriptions.push(vscode.commands.registerCommand(timerCommandId, () => {
            //Initialize quickpick
            const quickPick = vscode.window.createQuickPick();
            const quickPickItems = [
                { label: "1 min" },
                { label: "5 min" },
                { label: "10 min" },
                { label: "20 min" },
                { label: "25 min" },
                { label: "30 min" },
                { label: "40 min" },
                { label: "60 min" },
                { label: "90 min" },
                { label: "120 min" },
            ];
            //if the timer is running add an item to stop it
            const stopLabel = "STOP";
            if (timer.isRunning()) {
                quickPickItems.unshift({ label: stopLabel, description: "Stop the timer" });
            }
            quickPick.items = quickPickItems;
            //user picked
            quickPick.onDidChangeSelection(([item]) => {
                if (item) {
                    //set the time picked and start the timer
                    let time = Number(item.label.split(" ")[0]) * 60;
                    if (item.label === stopLabel) {
                        time = 0;
                    }
                    timer.start(time);
                }
                quickPick.hide();
            });
            quickPick.show();
        }));
        timerStatusBarItem.command = timerCommandId;
        timerStatusBarItem.text = timerStatusBarTxt;
        timerStatusBarItem.show();
        subscriptions.push(timerStatusBarItem);
    }
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map