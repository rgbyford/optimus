const connFns = require("./connection");
//const serverFns = require ('../server');

var fs = require('fs');
var path = require('path');

export async function connectFn() {
    await connFns.connect();

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 2000)
    });
    
    let result = await promise; // wait till the promise resolves (*)
//    await connFns.clearDB();
//    readFuelFiles();
};

var aasTags: string[][] = [[]];

function readFuelFiles() {
    console.log ("Reading fuel files");
    console.log ("dir name: ", __dirname);
    console.log ("cwd: ", process.cwd());    
    let fdTags: number = fs.openSync(process.cwd() + '/tagstable.txt', 'a+');
    console.log ("fdTags: ", fdTags);
    let sTagInfo: string = fs.readFileSync (fdTags, "utf8");
    console.log ("sTagInfo: ", sTagInfo);
    let asTags: string[] = sTagInfo.split ('\r\n');
    console.log ("asTags:", asTags, asTags.length);
    for (let i = 0; i < asTags.length; i++) {
        if (asTags[i].length > 0) {
            let aSplit: string[] = asTags[i].split (' ');
            if (aSplit.length === 3) {      // an "ADMIN X" truck
                aSplit[1] = aSplit[2];      // set trucknum to X
            }
            console.log ("aSplit:", aSplit);
            aasTags.push (aSplit);
            console.log ("aasTags[i]:", aasTags[i]);
            // will be tag in [0], truck num in [1]
        }
    }

    aasTags.shift();        // remove the [[]]

    let moveFrom: string = "/home/rgbyford/fuelDC";
    let moveTo: string = "/home/rgbyford/fuelDC/old";

    console.log ("readdir next");
    // Loop through all the files in the directory
    fs.readdir(moveFrom, function (err: any, files: any[]) {
//        console.log ("files: ", files);
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }
//        console.log ("file.foreach next");
        files.forEach(function (file, index) {
            let fromPath = path.join(moveFrom, file);
            let toPath = path.join(moveTo, file);
            fs.stat(fromPath, function (error: any, stat: any) {
                if (error) {
                    console.error("Error stating file.", error);
                    return;
                }
                //                console.log ("isFile next");
                if (stat.isFile()) {
                    console.log("'%s' is a file.", fromPath);
                    let fdFuel: number = fs.openSync(fromPath, "a+");
                    let iTruckNum: number;
                    let tag: string[] = file.split('.');  // [0] is the tag number, plus the file number
                    tag = tag[0].split('_');    // now tag[0] = just the tag number
                    iTruckNum = -1;
                    for (let i = 0; i < aasTags.length; i++) {
                        if (tag[0] === aasTags[i][0]) {     // tags match
                            iTruckNum = parseInt(aasTags[i][1]);
                            console.log("truck num: ", iTruckNum);
                            break;
                        }
                    }
                    //            console.log ("fs.stat next");
                    if (iTruckNum >= 0) {
                        const sFuelInfo = fs.readFileSync(fdFuel, "utf8");
                        if (sFuelInfo.length > 30) {    // short files are old and have no info
                            console.log("sFuelInfo: ", sFuelInfo);
                            let year: number = parseInt(sFuelInfo.substring(0, 4));
                            let month: number = parseInt(sFuelInfo.substring(4, 6));
                            let day: number = parseInt(sFuelInfo.substring(6, 8));
                            let hour: number = parseInt(sFuelInfo.substring(8, 10));
                            let minute: number = parseInt(sFuelInfo.substring(10, 12));
                            let second: number = parseInt(sFuelInfo.substring(12, 14));
                            // file has the tag number in it, but we can ignore
                            let iClicks: number = parseInt(sFuelInfo.substring(39));
                            let dRcdDate: Date = new Date(year, month, day, hour, minute, second, 0);
                            connFns.insertFuelRcd(iTruckNum, 'DC', dRcdDate, iClicks);       // put it in the database
                            //                    } else {
                            //                        console.log ("Zero length file: ", fromPath);
                            //                        aoCatsRead = [];
                        }
                    }
                    fs.closeSync(fdFuel);
                    fs.rename(fromPath, toPath, function (error: any) {
                        if (error) {
                            console.error("File moving error:", error);
                        } else {
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
