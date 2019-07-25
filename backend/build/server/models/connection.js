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
const MongoClient = require('mongodb').MongoClient;
const dbName = "optimus";
let dbOptimus;
const url = "mongodb://localhost:27017";
const bcrypt = require('bcrypt');
const assert = require('assert');
let oTempUser = { Email: 'rgb@test.com', Location: 'any', Hash: '' };
let iRcdCount;
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Connecting to database");
        const client = new MongoClient(url);
        iRcdCount = 10;
        try {
            yield client.connect();
            dbOptimus = client.db(dbName);
            let res = yield dbOptimus.stats();
            console.log("Connected to database: ", res);
        }
        catch (err) {
            console.log(`Mongo connect error: ${err}`);
        }
        return;
    });
}
exports.connect = connect;
function updateRcds() {
    return __awaiter(this, void 0, void 0, function* () {
        if (iRcdCount > 0) {
            oTempUser.Email = 'rgb' + (10 - iRcdCount).toString() + '@test.com';
            let sHash = bcrypt.hashSync('123' + (10 - iRcdCount).toString(), 10);
            yield doOne(sHash);
            iRcdCount--;
        }
    });
}
function doOne(sHash) {
    return new Promise((resolve, reject) => {
        let r = dbOptimus.collection("users").updateOne({ 'Email': oTempUser.Email }, { $set: { 'Email': oTempUser.Email, 'Location': oTempUser.Location, 'Hash': sHash } }, { upsert: true }, updateOneCallback);
        resolve();
    });
}
function updateOneCallback() {
    updateRcds();
}
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
function clearUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield dbOptimus.collection("users").drop();
            console.log("users cleared");
        }
        catch (error) {
            console.log("Error clearing users:", error);
        }
    });
}
exports.clearUsers = clearUsers;
module.exports.checkLogin = function (sEmail, sPassword, fCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        const cursor = yield dbOptimus.collection("users")
            .find({ 'Email': { $eq: sEmail } })
            .project({
            Email: 1,
            Location: 1,
            Hash: 1
        })
            .limit(1);
        if ((yield cursor.count()) > 0) {
            yield cursor.forEach(function (user) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('user:', user);
                    const err = bcrypt.compareSync(sPassword, user.Hash);
                    console.log('bcrypt compare:', err);
                    return (fCallback(err, user));
                });
            });
        }
        else {
            return (fCallback(false, {}));
        }
    });
};
module.exports.addUser = function (oUser, sPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        let sHash = bcrypt.hashSync(sPassword, 10);
        console.log('password, hash:', sPassword, sHash);
        try {
            let r = yield dbOptimus.collection("users").updateOne({ 'Email': oUser.Email }, { $set: { 'Email': oUser.Email, 'Location': oUser.Location, 'Hash': sHash } }, { upsert: true }, () => { });
            assert.equal(1, r.upsertedCount);
        }
        catch (e) {
            console.log("db err:", e);
        }
    });
};
module.exports.removeUser = function (sEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        yield dbOptimus.collection("users").remove({ 'Email': sEmail }, {});
    });
};
module.exports.UpdateHash = function (sEmail, sPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        let sHash = bcrypt.hashSync(sPassword, 10);
        yield dbOptimus.collection("users").updateOne({ 'Email': sEmail }, { $set: { 'Hash': sHash } });
        return;
    });
};
module.exports.queryDB = function (sToFindFirst, sToFindSecond, sCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        let oSearch;
        let oToReturn;
        let aoFound = [{}];
        let iTruckNum = 0;
        let oSearchLoc;
        if (sCollection === 'trucks') {
            iTruckNum = parseInt(sToFindFirst);
            if (iTruckNum >= 0) {
                if (sToFindSecond === 'any') {
                    oSearch = { TruckNum: { $eq: iTruckNum } };
                }
                else {
                    oSearch = { TruckNum: { $eq: iTruckNum }, Location: { $eq: sToFindSecond } };
                }
                oToReturn = { TruckNum: 1, DateTime: 1, Location: 1, Amount: 1 };
            }
            else {
                if (sToFindSecond === 'any') {
                    oSearchLoc = {};
                }
                else {
                    oSearchLoc = { Location: sToFindSecond };
                }
            }
        }
        else {
            if (sToFindFirst === '') {
                oSearch = {};
            }
            else {
                oSearch = {
                    Email: { $eq: sToFindFirst }
                };
            }
            oToReturn = { Email: 1, Location: 1, sHash: 1 };
            iTruckNum = 0;
        }
        console.log('oSearch:', oSearch);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (iTruckNum >= 0) {
                let cursor = yield dbOptimus.collection(sCollection).find(oSearch).project(oToReturn);
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
            }
            else {
                console.log("looking for distinct on ", oSearchLoc);
                yield dbOptimus.collection(sCollection).distinct('TruckNum', oSearchLoc, (err, asTruckNums) => {
                    console.log('err:', err);
                    console.log('asTruckNums:', asTruckNums);
                    resolve(asTruckNums);
                });
            }
        }));
    });
};
let iRowsCBCount = 0;
let iRowsNBad = 0;
let iRowsResultBad = 0;
module.exports.insertFuelRcd = function (iTruckNum, sLocation, dateTime, clicks) {
    dbOptimus.collection("trucks").updateOne({
        'Location': sLocation,
        'TruckNum': iTruckNum,
        'DateTime': dateTime
    }, {
        $set: { 'Location': sLocation, 'TruckNum': iTruckNum, 'DateTime': dateTime, 'Amount': clicks }
    }, {
        upsert: true
    }, insertRcdCallback);
};
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
//# sourceMappingURL=connection.js.map