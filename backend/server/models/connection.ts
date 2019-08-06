//import * as MongoClient from 'mongodb';
const MongoClient = require ('mongodb').MongoClient;
const dbName = "optimus";
let dbOptimus: any;
const url = "mongodb://localhost:53092";
const bcrypt = require('bcrypt');
const assert = require ('assert');

export type OUserData = {
//    iId: number;
    Email: string;
    Location: string;
    Hash: string;
};

export type OPriceData = {
    Location: string;
    Price: number;
    Date: string;
}

let oTempUser: OUserData = {Email: 'rgb@test.com', Location: 'any', Hash: ''};
let iRcdCount: number;

// Connect using MongoClient
export async function connect() {
    console.log("Connecting to database");
    const client = new MongoClient(url);
    iRcdCount = 10;
    try {
        await client.connect();
        dbOptimus = client.db(dbName);
        let res: string = await dbOptimus.stats();
        console.log("Connected to database: ", res);
        //await updateRcds();
    } catch (err) {
        console.log(`Mongo connect error: ${err}`);
    }
    return;
}

export async function updateRcds () {
    if (iRcdCount > 0) {
        oTempUser.Email = 'rgb' + (10 - iRcdCount).toString() + '@test.com';
        let sHash = bcrypt.hashSync('123' + (10 - iRcdCount).toString(), 10);
        //console.log('hash:', sHash);
        await updateSingleRcd(sHash);
        //console.log ('doOne done');
        iRcdCount--;
    }
}

function updateSingleRcd (sHash: string) {
    return new Promise((resolve: any, reject: any) => {
        let r = dbOptimus.collection("users").updateOne({ 'Email': oTempUser.Email },
            { $set: { 'Email': oTempUser.Email, 'Location': oTempUser.Location, 'Hash': sHash } },
            { upsert: true }, updateOneCallback);
        resolve();
    });
}

function updateOneCallback() {
    updateRcds();
    //console.log('iOCB');
}

module.exports.addPrice = async function (oPriceInfo: OPriceData) {
    return new Promise((resolve: any, reject: any) => {
        let r = dbOptimus.collection("prices").updateOne({ 'Date': oPriceInfo.Date, 'Location': oPriceInfo.Location },
            { $set: { 'Date': oPriceInfo.Date, 'Location': oPriceInfo.Location, 'Price': oPriceInfo.Price } },
            { upsert: true }, () => { });
        resolve( oPriceInfo);
    });
}

export async function deletePrice (sLocation: string, sDate: string) {
    return await dbOptimus.collection("prices").deleteOne({'Location': sLocation, 'Date': sDate}, {});

}

//module.exports.clearDB = async function () {
export async function clearDB () {
    try {
        await dbOptimus.collection("optimus").drop();
        console.log("Database emptied");
    } catch (error) {
        console.log("Error emptying database:", error);
    }
}

//module.exports.clearDB = async function () {
export async function clearUsers () {
    try {
        await dbOptimus.collection("users").drop();
        console.log("users cleared");
    } catch (error) {
        console.log("Error clearing users:", error);
    }
}

// find specific user for login (and check password)
module.exports.checkLogin = async function (sEmail: string, sPassword: string, fCallback: any) {
    const cursor = await dbOptimus.collection("users")
        .find({ 'Email': { $eq: sEmail } })
        .project({
            Email: 1,
            Location: 1,
            Hash: 1
        })
        .limit(1);
    if (await cursor.count() > 0) {
        await cursor.forEach(async function (user: any) {
            console.log('user:', user);
            const err = bcrypt.compareSync(sPassword, user.Hash);
            console.log('bcrypt compare:', err);
            return (fCallback(err, user));     // One more (null) to go
        });
    }
    else {
        return (fCallback(false, {}));
    }
}

//async function addUser (oUser: OUserData, sPassword: string) {
module.exports.addUser = async function (oUser: OUserData, sPassword: string) {
    let sHash: string = bcrypt.hashSync(sPassword, 10);
    console.log('password, hash:', sPassword, sHash);
    return new Promise((resolve: any, reject: any) => {
        let r = dbOptimus.collection("users").updateOne({ 'Email': oUser.Email },
            { $set: { 'Email': oUser.Email, 'Location': oUser.Location, 'Hash': sHash } },
            { upsert: true }, () => { });
        resolve( oUser);
    });
}

module.exports.removeUser = async function (sEmail: string) {
    return await dbOptimus.collection("users").deleteOne({'Email': sEmail}, {});
}

module.exports.removePrice = async function (sLocation: string, sDate: string) {
    return await dbOptimus.collection("prices").deleteOne({'Location': sLocation, 'Date': sDate}, {});
}

// used to change password
module.exports.UpdateHash = async function (sEmail: string, sPassword: string) {
    let sHash: string = bcrypt.hashSync(sPassword, 10);
    return new Promise((resolve: any, reject: any) => {
        let r = dbOptimus.collection("users").updateOne({ 'Email': sEmail },
            { $set: { 'Hash': sHash } }, {}, () => { });
        resolve(sEmail);
    });

    //    await dbOptimus.collection("users").updateOne({'Email': sEmail}, { $set: {'Hash': sHash}});
    return;
}

module.exports.queryDB = async function (sToFindFirst: string, sToFindSecond: string, sCollection: string) {
    let oSearch: object;
    let oToReturn: object;
    let aoFound: object[] = [{}];
    let iTruckNum: number = 0;
    let oSearchLoc: object;
    
    console.log (`sTFF: ${sToFindFirst}, sTFS: ${sToFindSecond}, sCollection: ${sCollection}`);
    if (sCollection === 'trucks') {
        iTruckNum = parseInt(sToFindFirst);
        console.log ('iTruckNum:', iTruckNum);
        if (iTruckNum >= 0) {
            if (sToFindSecond === 'any') {
                oSearch = {TruckNum: { $eq: iTruckNum }};
            }
            else {
                oSearch = {TruckNum: { $eq: iTruckNum }, Location: { $eq: sToFindSecond }};
            }
                // will screw up if trucks at different locations have the same numbers
        }
        else {        // TruckNum -1 = all trucks at location (which could be 'any')
            if (sToFindSecond === 'any') {
                oSearchLoc = {};
            }
            else {      // for finding all fuelings at a location - to make a price file
                        // or for finding all trucks at a location - for charts select box
                oSearchLoc = {Location: sToFindSecond};     // for charts select box list
                oSearch = {Location: sToFindSecond};        // for price file
            }
        }
        oToReturn = { TruckNum: 1, Tag: 1, DateTime: 1, Location: 1, Amount: 1 };      
    }
    else if (sCollection === 'users') {
        if (sToFindFirst === '') {          // all users
            oSearch = {};
        }
        else {
            oSearch = {
                Email: { $eq: sToFindFirst }
            }
        }
        oToReturn = { Email: 1, Location: 1, sHash: 1 };
        iTruckNum = 0;             // a cheat
    }
    else {         // is bio prices collection
        oSearch = {Location: {$eq: sToFindSecond}};
        oToReturn = { Price: 1, Date: 1, Location: 1 };
        iTruckNum = 0;
    }
    console.log('oSearch:', oSearch);
    return new Promise(async (resolve: any) => {
        if (iTruckNum >= 0 || iTruckNum === -2) {       // -2 is rcds to write price file
            let cursor = await dbOptimus.collection(sCollection).find(oSearch).project(oToReturn);
            //console.log ('queryDB cursor: ', cursor);
            let itemCount: number = 0;
            await cursor.each(function (err: any, item: any) {
                if (err) {
                    console.log("Cursor error: ", err);
                    throw (err);
                }
                if (item === null) {
                    console.log(`Last item. ${aoFound.length} found.`);
                    console.log("Found: ", aoFound);
                    resolve(aoFound);       // resolve the promise
                }
                aoFound[itemCount++] = item;
                console.log(itemCount, "itemCount");
                return;
            });
            console.log("end of queryDB - found: ", aoFound.length);
            //        resolve (aoFound);
        }
        else {      // iTruckNum == -1 - find the truck numbers for the charts select truck box
            console.log ("looking for distinct on ", oSearchLoc);
            await dbOptimus.collection(sCollection).distinct('TruckNum', oSearchLoc, (err: any, asTruckNums: string[]) => {
                console.log ('err:', err);
                console.log('asTruckNums:', asTruckNums);
                resolve (asTruckNums);
            });
        }   
    });
};

let iRowsCBCount: number = 0;
let iRowsNBad: number = 0;
let iRowsResultBad: number = 0;

module.exports.insertFuelRcd = function (iTruckNum: number, sTag: string, sLocation: string, dateTime: Date, clicks: number) {
    dbOptimus.collection("trucks").updateOne({
        'Location': sLocation,
        'TruckNum': iTruckNum,
        'DateTime': dateTime
    }, {
        $set: {'Location': sLocation, 'TruckNum': iTruckNum, 'Tag': sTag, 'DateTime': dateTime, 'Amount': clicks}
    }, {
        upsert: true
    }, insertRcdCallback);
}

function insertRcdCallback(err: any, res: any) {
    if (err) {
        console.log("iRC err: ", err.name, err.message);
    } else {
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

