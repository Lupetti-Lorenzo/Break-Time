import * as vscode from "vscode";

export class Timer {
	private config = vscode.workspace.getConfiguration("BreakTime");
	private redText: number = 0;
	private endMessages: string[] = ["get up and do some stretching!!", "break time!"];

	private intervalID: any = undefined;
	private currentTime: number = 0; //seconds
	private running: boolean = false;

	private statusBarItem: vscode.StatusBarItem;
	private statusBarTxt: string;

	constructor(statusBarItem: vscode.StatusBarItem, statusBarTxt: string) {
		this.statusBarItem = statusBarItem;
		this.statusBarTxt = statusBarTxt;
		if (this.config.redText !== "inactive") {
			this.setRedText();
		}
		this.setEndMessages();
	}

	public start(time: number) {
		if (time === 0) {
			//the user stopped the timer
			this.resetTimer();
			return;
		}

		this.currentTime = time;
		this.running = true;

		if (this.intervalID) {
			clearInterval(this.intervalID);
		}

		//set interval that handle the count down
		this.intervalID = setInterval(() => {
			if (this.currentTime <= 0) {
				//break time!
				this.resetTimer();
				const randomMessage = this.endMessages[Math.floor(Math.random() * this.endMessages.length)];
				vscode.window.showInformationMessage(`${Math.round(time / 60)} mins passed, ${randomMessage}`, "Another 5 minutes").then(() => {
					this.start(5 * 60);
				});
			} else {
				//decrease time and update the text in UI
				this.currentTime--;
				//check settings about last minute to display or not
				if (this.currentTime <= 60 && this.config.showLastMinute === false) {
					this.statusBarItem.text = `Break in: <1 min`;
				} else {
					this.statusBarItem.text = `Break in: ${this.secToTime(this.currentTime)}`;
				}

				//last tot sec display red text
				const color: string = "firebrick";
				if (this.currentTime < this.redText && this.statusBarItem.color !== color) {
					this.statusBarItem.color = color;
				}
			}
		}, 1000);
	}

	public isRunning() {
		return this.running;
	}

	private resetTimer() {
		this.statusBarItem.text = this.statusBarTxt;
		clearInterval(this.intervalID);
		this.statusBarItem.color = undefined;
		this.currentTime = 0;
		this.intervalID = undefined;
		this.running = false;
		this.statusBarItem.color = undefined;
	}

	private secToTime(totalSecs: number) {
		const hours = Math.floor(totalSecs / 3600);
		const minutes = Math.floor((totalSecs % 3600) / 60);
		const seconds = Math.floor(totalSecs % 60);
		return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}min ` : ""}${totalSecs <= 60 ? `${seconds}sec` : ""}`;
	}

	private setRedText() {
		const red = this.config.redText;
		let num: number = 0;
		if (red.slice(0, 1) !== "3") {
			num = Number(red.slice(0, 1)) * 60;
		} else {
			num = 30;
		}
		this.redText = num;
	}

	private setEndMessages() {
		const msg = this.config.endMessages;
		if (msg[0] !== undefined && Array.isArray(msg)) {
			//see if every element of the array is a string
			let valid = true;
			msg.forEach(m => {
				if (typeof m !== "string") {
					valid = false;
				}
			});
			if (valid === true) {
				this.endMessages = msg;
			}
		}
	}
}
