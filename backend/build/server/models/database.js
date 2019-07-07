"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const connFns = require("./connection");
var fs = require('fs');
var path = require('path');
function connectFn() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connFns.connect();
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 2000);
        });
        let result = yield promise;
        readFuelFiles();
    });
}
exports.connectFn = connectFn;
;
var aasTags = [[]];
function readFuelFiles() {
    console.log("Reading fuel files");
    console.log("dir name: ", __dirname);
    console.log("cwd: ", process.cwd());
    let fdTags = fs.openSync(process.cwd() + '/tagstable.txt', 'a+');
    console.log("fdTags: ", fdTags);
    let sTagInfo = fs.readFileSync(fdTags, "utf8");
    console.log("sTagInfo: ", sTagInfo);
    let asTags = sTagInfo.split('\r\n');
    console.log("asTags:", asTags, asTags.length);
    for (let i = 0; i < asTags.length; i++) {
        if (asTags[i].length > 0) {
            let aSplit = asTags[i].split(' ');
            if (aSplit.length === 3) {
                aSplit[1] = aSplit[2];
            }
            console.log("aSplit:", aSplit);
            aasTags.push(aSplit);
            console.log("aasTags[i]:", aasTags[i]);
        }
    }
    aasTags.shift();
    let moveFrom = "/home/rgbyford/fuelDC";
    let moveTo = "/home/rgbyford/fuelDC/old";
    console.log("readdir next");
    fs.readdir(moveFrom, function (err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }
        files.forEach(function (file, index) {
            let fromPath = path.join(moveFrom, file);
            let toPath = path.join(moveTo, file);
            fs.stat(fromPath, function (error, stat) {
                if (error) {
                    console.error("Error stating file.", error);
                    return;
                }
                if (stat.isFile()) {
                    console.log("'%s' is a file.", fromPath);
                    let fdFuel = fs.openSync(fromPath, "a+");
                    let iTruckNum;
                    let tag = file.split('.');
                    tag = tag[0].split('_');
                    iTruckNum = -1;
                    for (let i = 0; i < aasTags.length; i++) {
                        if (tag[0] === aasTags[i][0]) {
                            iTruckNum = parseInt(aasTags[i][1]);
                            console.log("truck num: ", iTruckNum);
                            break;
                        }
                    }
                    if (iTruckNum >= 0) {
                        const sFuelInfo = fs.readFileSync(fdFuel, "utf8");
                        if (sFuelInfo.length > 30) {
                            console.log("sFuelInfo: ", sFuelInfo);
                            let year = parseInt(sFuelInfo.substring(0, 4));
                            let month = parseInt(sFuelInfo.substring(4, 6));
                            let day = parseInt(sFuelInfo.substring(6, 8));
                            let hour = parseInt(sFuelInfo.substring(8, 10));
                            let minute = parseInt(sFuelInfo.substring(10, 12));
                            let second = parseInt(sFuelInfo.substring(12, 14));
                            let iClicks = parseInt(sFuelInfo.substring(39));
                            let dRcdDate = new Date(year, month, day, hour, minute, second, 0);
                            connFns.insertFuelRcd(iTruckNum, dRcdDate, iClicks);
                        }
                    }
                    fs.closeSync(fdFuel);
                    fs.rename(fromPath, toPath, function (error) {
                        if (error) {
                            console.error("File moving error:", error);
                        }
                        else {
                            console.log("Moved file '%s' to '%s'.", fromPath, toPath);
                        }
                    });
                }
                else if (stat.isDirectory()) {
                    console.log("'%s' is a directory.", fromPath);
                }
            });
        });
    });
}
//# sourceMappingURL=database.js.map