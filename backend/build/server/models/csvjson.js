const dbStuff = require("./database");
let papa = require("papaparse");
var fs = require("fs");
let index = 0;
let fileName;
let fd;
function CJDone() {
    dbStuff.importNames(index);
    console.log(`import done: ${index} rows according to papaparse`);
    fs.closeSync(fd);
    fs.unlinkSync('./uploads/' + fileName);
    index = 0;
}
function CJRow(results) {
    index++;
    dbStuff.pushContact(results.data);
}
;
var myConfig = {
    newLine: "",
    quoteChar: '"',
    delimiter: "",
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
};
module.exports.csvJson = function (file) {
    console.log("csvJson file:", file);
    dbStuff.clearContacts('CSV');
    fileName = file;
    dbStuff.readCatsFile();
    fd = fs.openSync("./uploads/" + file);
    var content = fs.readFileSync(fd, "utf8");
    papa.parse(content, myConfig);
};
//# sourceMappingURL=csvjson.js.map