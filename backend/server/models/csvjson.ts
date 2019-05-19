//import MongoClient from 'mongodb';
//let dbCSVJ = require("./database.js");
//import * as CSVJ from "./database";
const dbStuff = require("./database");

let papa = require("papaparse");
var fs = require("fs");
let index = 0;      // just to count and display the rows
let fileName: string;
let fd: number;

function CJDone() {
    dbStuff.importNames(index);
    console.log(`import done: ${index} rows according to papaparse`);
    fs.closeSync (fd);
    fs.unlinkSync('./uploads/' + fileName);
    index = 0;
}

function CJRow(results: any) {
//    document.body.style.cursor  = 'wait';
    index++;
    dbStuff.pushContact(results.data);
}

interface configObj {
    newLine: string;
    // eslint-disable-next-line quotes
    quoteChar: string,
    delimiter: string[1],
    // eslint-disable-next-line quotes
    escapeChar: string[1],
    header: boolean,
    trimHeaders: boolean,
    dynamicTyping: boolean,
    preview: number,
    encoding: string,
    worker: boolean,
    comments: boolean,
    step: any,
    complete: any,
    error: any,
    download: boolean,
    skipEmptyLines: boolean,
    chunk: any,
    fastMode: any,
    beforeFirstChunk: any,
    withCredentials: any,
    transform: any
};

var myConfig: configObj = {
    newLine: "", // auto-detect
    // eslint-disable-next-line quotes
    quoteChar: '"',
    delimiter: "", // auto-detect
    // eslint-disable-next-line quotes
    escapeChar: '"',
    header: true,
    trimHeaders: false,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: CJRow,
    complete: CJDone,
    error: undefined,
    download: false,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined,
    transform: undefined
}

module.exports.csvJson = function (file: string) {
    console.log ("csvJson file:", file);
    dbStuff.clearContacts('CSV');
    fileName = file;
    dbStuff.readCatsFile(); // read in existing categories
    // When the file is a local file we need to convert to a file Obj.
    fd = fs.openSync ("./uploads/" + file);
//    var content = fs.readFileSync("./uploads/" + file, "utf8");
    var content = fs.readFileSync(fd, "utf8");
    papa.parse(content, myConfig);
};