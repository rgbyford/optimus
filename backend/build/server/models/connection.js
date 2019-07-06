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
const MongoClient = require("mongodb");
const dbName = "optimus";
let dbOptimus;
const url = "mongodb://localhost:27017";
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Connecting to database");
        MongoClient.connect(url, function (err, client) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    throw err;
                }
                dbOptimus = yield client.db(dbName);
                dbOptimus.stats().then(function (res) {
                    console.log("Connected to database: ", res);
                    return;
                }).catch(function (err) {
                    console.log(`Mongo connect error: ${err}`);
                    return;
                });
            });
        });
    });
}
exports.connect = connect;
function clearDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield dbOptimus.collection("optimus").drop();
            console.log("Database emptied");
        }
        catch (error) {
            console.log("Error emptying database:", error);
        }
    });
}
exports.clearDB = clearDB;
module.exports.queryDB = function (sTruckNum) {
    return __awaiter(this, void 0, void 0, function* () {
        let iTruckNum = parseInt(sTruckNum);
        let aoFound = [{}];
        let oSearch = {
            TruckNum: { $eq: iTruckNum }
        };
        console.log('oSearch:', oSearch);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const cursor = dbOptimus.collection("optimus").find(oSearch)
                .project({
                TruckNum: 1,
                DateTime: 1,
                Amount: 1
            });
            let itemCount = 0;
            yield cursor.each(function (err, item) {
                if (err) {
                    console.log("Cursor error: ", err);
                    throw (err);
                }
                if (item === null) {
                    console.log(`Last item. ${aoFound.length} found.`);
                    console.log("Found: ", aoFound);
                    resolve(aoFound);
                }
                aoFound[itemCount++] = item;
                console.log(itemCount, "itemCount");
                return;
            });
            console.log("end of queryDB - found: ", aoFound.length);
        }));
    });
};
let iRowsNBad = 0;
let iRowsCBCount = 0;
let iRowsResultBad = 0;
function insertRcdCallback(err, res) {
    if (err) {
        console.log("iRC err: ", err.name, err.message);
    }
    else {
        if (res.result.n !== 1) {
            console.log(`nR != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            iRowsNBad++;
        }
        if (res.result.ok !== 1) {
            console.log(`ok != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            iRowsResultBad++;
        }
        iRowsCBCount++;
    }
    return;
}
module.exports.insertFuelRcd = function (iTruckNum, dateTime, clicks) {
    dbOptimus.collection("optimus").updateOne({
        'Location': 'DC',
        'TruckNum': iTruckNum,
        'DateTime': dateTime
    }, {
        $set: { 'Location': 'DC', 'TruckNum': iTruckNum, 'DateTime': dateTime, 'Amount': clicks }
    }, {
        upsert: true
    }, insertRcdCallback);
};
//# sourceMappingURL=connection.js.map