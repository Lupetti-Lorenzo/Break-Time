"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const vscode = require("vscode");
class Timer {
    constructor(statusBarItem, statusBarTxt) {
        this.config = vscode.workspace.getConfiguration("BreakTime");
        this.redText = 0;
        this.endMessages = ["get up and do some stretching!!", "break time!"];
        this.intervalID = undefined;
        this.currentTime = 0; //seconds
        this.running = false;
        this.statusBarItem = statusBarItem;
        this.statusBarTxt = statusBarTxt;
        if (this.config.redText !== "inactive") {
            this.setRedText();
        }
        this.setEndMessages();
    }
    start(time) {
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
            }
            else {
                //decrease time and update the text in UI
                this.currentTime--;
                this.statusBarItem.text = `Break in: ${this.secToTime(this.currentTime)}`;
                //last tot sec display red text
                const color = "firebrick";
                if (this.currentTime < this.redText && this.statusBarItem.color !== color) {
                    this.statusBarItem.color = color;
                }
            }
        }, 1000);
    }
    isRunning() {
        return this.running;
    }
    resetTimer() {
        this.statusBarItem.text = this.statusBarTxt;
        clearInterval(this.intervalID);
        this.statusBarItem.color = undefined;
        this.currentTime = 0;
        this.intervalID = undefined;
        this.running = false;
        this.statusBarItem.color = undefined;
    }
    secToTime(totalSecs) {
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = Math.floor(totalSecs % 60);
        return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}min ` : ""}${totalSecs <= 60 ? `${seconds}sec` : ""}`;
    }
    setRedText() {
        const red = this.config.redText;
        let num = 0;
        if (red.slice(0, 1) !== "3") {
            num = Number(red.slice(0, 1)) * 60;
        }
        else {
            num = 30;
        }
        this.redText = num;
    }
    setEndMessages() {
        const msg = this.config.endMessages;
        console.log(msg);
        if (msg && Array.isArray(msg)) {
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
exports.Timer = Timer;
//# sourceMappingURL=Timer.js.map