import * as vscode from "vscode";
import { Timer } from "./Timer";

export function activate({ subscriptions }: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration("BreakTime"); //user configuration

	if (config.enable === true) {
		const timerStatusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 299);
		const timerStatusBarTxt: string = `Next Break`;

		//Timer
		const timer = new Timer(timerStatusBarItem, timerStatusBarTxt);
		const timerCommandId: string = "BreakTime.start";

		subscriptions.push(
			vscode.commands.registerCommand(timerCommandId, () => {
				//Initialize quickpick
				const quickPick = vscode.window.createQuickPick();

				const quickPickItems: vscode.QuickPickItem[] = [
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
			}),
		);

		timerStatusBarItem.command = timerCommandId;
		timerStatusBarItem.text = timerStatusBarTxt;
		timerStatusBarItem.show();
		subscriptions.push(timerStatusBarItem);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
