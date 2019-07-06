import * as MongoClient from 'mongodb';
const dbName = "optimus";
let dbOptimus: any;
const url = "mongodb://localhost:27017";

// Connect using MongoClient
export async function connect() {
    console.log ("Connecting to database");
    MongoClient.connect(url, async function (err: object, client: any) {
        if (err) {
            throw err;
        }
        dbOptimus = await client.db(dbName);
        dbOptimus.stats().then(function (res: string) {
            console.log("Connected to database: ", res);
            return;
        }).catch(function (err: string) {
            console.log(`Mongo connect error: ${err}`);
            return;
        });
    });
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

module.exports.queryDB = async function (sTruckNum: string) {
    let iTruckNum: number = parseInt (sTruckNum);
    let aoFound: object[] = [{}];
 
    let oSearch = {
        TruckNum: {$eq: iTruckNum}
    };
    console.log ('oSearch:', oSearch);

    return new Promise (async (resolve) => {
        const cursor = dbOptimus.collection("optimus").find(oSearch)
        .project({
            TruckNum: 1,
            DateTime: 1,
            Amount: 1
        });
        //console.log ('queryDB cursor: ', cursor);
        let itemCount: number = 0;
        await cursor.each(function (err: any, item: any) {
//        cursor.forEach(function (item: any) {
            if (err) {
                console.log("Cursor error: ", err);
                throw (err);
            }
            if (item === null) {
                console.log(`Last item. ${aoFound.length} found.`);
                console.log ("Found: ", aoFound);
                resolve(aoFound);       // resolve the promise
            }
            //console.log(item);
            //aoFound.push(item);
            aoFound[itemCount++] = item;
            console.log (itemCount, "itemCount");
            return;
        });
        console.log("end of queryDB - found: ", aoFound.length);
//        resolve (aoFound);
    });
};

let iRowsNBad: number = 0;
let iRowsCBCount: number = 0;
let iRowsResultBad: number = 0;

function insertRcdCallback(err: any, res: any) {
    //console.log("iCCB: ", rowCBCount);
    if (err) {
        console.log("iRC err: ", err.name, err.message);
        //console.log("iRC err - not loaded", aoModified.length);
        //console.log ("result: ", err);
    } else {
        if (res.result.n !== 1) {
            console.log(`nR != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            //console.log("rowCBCount: ", rowCBCount);
            //    console.log("Rows: ", rowCount);
            iRowsNBad++;
        }
        if (res.result.ok !== 1) {
            console.log(`ok != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            //console.log("rowCBCount: ", rowCBCount);
            //    console.log("Rows: ", rowCount);
            iRowsResultBad++;
        }
        iRowsCBCount++;
        /*
        dbStuff.importNames(); // recursive call for next row
        */
        //console.log("iC result: ", ++iCC, res.result);
    }
    return;
}

module.exports.insertFuelRcd = function (iTruckNum: number, dateTime: Date, clicks: number) {
    dbOptimus.collection("optimus").updateOne({
        'Location': 'DC',
        'TruckNum': iTruckNum,
        'DateTime': dateTime
    }, {
        $set: {'Location': 'DC', 'TruckNum': iTruckNum, 'DateTime': dateTime, 'Amount': clicks}
    }, {
        upsert: true
    }, insertRcdCallback);
}