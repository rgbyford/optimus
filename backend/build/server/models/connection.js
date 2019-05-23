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
const dbName = "toby";
let dbToby;
const url = "mongodb://localhost:27017";
const appFns = require('../server');
MongoClient.connect(url, function (err, client) {
    if (err) {
        throw err;
    }
    dbToby = client.db(dbName);
    dbToby.stats().then(function (res) {
        console.log("Connected to database: ", res);
    }).catch(function (err) {
        console.log(`Mongo connect error: ${err}`);
    });
});
function clearDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield dbToby.collection("contacts").drop();
            console.log("Database emptied");
        }
        catch (error) {
            console.log("Error emptying database");
        }
    });
}
exports.clearDB = clearDB;
module.exports.queryDB = function (asSearchAnd, asSearchOr) {
    return __awaiter(this, void 0, void 0, function* () {
        let aoFound = [{}];
        let oSearch = {
            GroupMembership: {
                $all: asSearchAnd,
                $in: asSearchOr
            }
        };
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            console.log(`typeof asSearchOr: ${typeof (asSearchOr)} length: ${asSearchOr.length} |${asSearchOr}|`);
            if (asSearchOr.length === 0) {
                console.log("Empty OR search");
                if (asSearchAnd.length === 0) {
                    oSearch.GroupMembership.$all = [];
                    oSearch.GroupMembership.$in = [];
                    console.log("Search any");
                }
                else {
                    asSearchOr[0] = asSearchAnd[0];
                }
            }
            console.log(`SearchAnd: *${asSearchAnd}* searchOr: *${asSearchOr}*`);
            console.log("oSearch: ", oSearch);
            const cursor = dbToby.collection("contacts").find(oSearch)
                .project({
                GivenName: 1,
                FamilyName: 1,
                GroupMembership: 1,
                Photo1: 1,
                'Phone1-Value': 1,
                'E-mail1-Value': 1,
                FC_ID1: 1,
                FC_ID2: 1,
                imageURL: 1
            });
            let itemCount = 0;
            yield cursor.each(function (err, item) {
                if (err) {
                    console.log("Cursor error: ", err);
                    throw (err);
                }
                if (item === null) {
                    console.log(`Last item. ${aoFound.length} found.`);
                    resolve(aoFound);
                }
                aoFound[itemCount++] = item;
                return;
            });
            console.log("end of queryDB - found: ", aoFound.length);
        }));
    });
};
let iRowsCBCount = 0;
let dbStuff = require("./database");
let oContactSaved;
let aoModified = [{}];
let bLast;
let iRowsResultBad;
let iRowsNBad;
module.exports.getSaved = function async() {
    return (dbStuff.adminDb.contacts.find());
};
module.exports.getModified = function () {
    console.log("gM: ", aoModified.length);
    return (aoModified);
};
module.exports.getLoaded = function () {
    return (iRowsCBCount);
};
module.exports.prepLoad = function () {
    iRowsCBCount = 0;
    aoModified.length = 0;
};
function insertContactCallback(err, res) {
    if (err) {
        console.log("iC err: ", err.name, err.message);
        console.log("iC err - not loaded", aoModified.length);
    }
    else {
        if (res.result.nModified > 0) {
            let oMod = {};
            oMod.GivenName = oContactSaved.GivenName;
            oMod.FamilyName = oContactSaved.FamilyName;
            aoModified.push(oMod);
        }
        if (res.result.n !== 1) {
            console.log(`nR != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            iRowsNBad++;
        }
        if (res.result.ok !== 1) {
            console.log(`ok != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            iRowsResultBad++;
        }
        iRowsCBCount++;
        dbStuff.importNames();
    }
    if (bLast) {
        console.log("last callback");
        console.log("Modified: ", aoModified.length);
        console.log("RowsNBad", iRowsNBad);
        console.log("iRowsResultBad", iRowsResultBad);
        dbStuff.writeFile();
        aoModified.shift();
        appFns.sendSomething(aoModified);
        bLast = false;
    }
    return;
}
module.exports.insertContact = function (oContact, bLastParam) {
    bLast = bLastParam;
    oContactSaved = oContact;
    dbToby.collection("contacts").updateOne({
        "E-mail1-Value": oContact["E-mail1-Value"],
        "GivenName": oContact["GivenName"],
        "FamilyName": oContact["FamilyName"]
    }, {
        $set: oContact
    }, {
        upsert: true
    }, insertContactCallback);
};
//# sourceMappingURL=connection.js.map