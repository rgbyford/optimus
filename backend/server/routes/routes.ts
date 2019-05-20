var express = require ("express");
//var app = express();
//let express = require("express");
let router = express.Router();
const cjFns = require("../models/csvjson");
const vcfFns = require('../models/vcfjson');
const dbFunctions = require("../models/database");
const dbConn = require("../models/connection");
//const socketIo = require("socket.io");
//require ("@types/express");

let aoCats: object[] = [{}];
//let asPrev: string[] = [];
//let iAnd: number = -1;
//let bAndBtnDisabled: boolean = false;
//let bClearedDB: boolean = false;
var multer = require("multer");
var uploadMulter = multer({
    dest: "./uploads/"
});

// I don"t know if the "avatar" here has to match what is in the put

router.put("/contacts/import", 
    uploadMulter.single("avatar"), async function (req: any, res: any, next: any) {
    //req.file.filename gives the file name on the server
    // req.file.originalname gives the client file name
    // console.log("body: ", req.body);
    //    document.body.style.cursor  = 'wait';
    // console.log ("res render import");
    // res.render("loadcontacts", {
    //     loading: true
    // });
    // open a socket
    //const io = socketIo();
    dbFunctions.writeDateFile ();

    //bClearedDB = false;
    console.log("/contacts/import req.body: ", req.body);
    console.log ("req.file: ", req.file);
    console.log ('req.file.path: ', req.file.path);
    if (req.body.clearDB === 'true') {
        await dbConn.clearDB();
        //bClearedDB = true;
        // empty the database collection
    }
    if (req.body.clearCats === 'true') {
        dbFunctions.deleteCatsFile();
        // erase the categories file
    }
    //let fname = req.body.avatar.toLowerCase();
    let fname = req.file.filename.toLowerCase();
    console.log ("file name: ", fname);
    if (req.body.csv === 'true') {
        cjFns.csvJson(fname);
    }
    else {
        vcfFns.vcfJson (fname);
    }
});

router.get('/categories', async (req: any, res: any) => {
    console.log("server get cats");
    console.log ("cwd:", process.cwd());

    try {
        aoCats = dbFunctions.readCatsFile();
        res.json({
            aoCats
        }); // and sends it
    } catch (err) {
        console.log("categories fetch error");
        res.json({
            error: err.message || err.toString()
        });
    }
});

router.get ('/loadDate', async (req: Request, res: any) => {
    console.log ("get load date");
    const date: string = dbFunctions.readDateFile();
    res.json (date);
});

router.get("/contacts", async function (req: Request, res: any) {
    console.log("get contacts");
    //    setPrevious();
    //    iAnds = -1;
    let asSearchAnd: string[] = [];
    let asSearchOr: string[] = [];
    console.log ('req.url: ', req.url);
    let sSearch = req.url.split ('=')[1];
    sSearch = decodeURIComponent (sSearch);
    console.log ('sSearch: ', sSearch);
    let asSearches = sSearch.split ('@');
    console.log ('asSearches: ', asSearches);
//    for (let i = 0; i < req.body.search.length; i++) {
//        let sFind = req.body.search[i];
    for (let i: number = 0; i < asSearches.length; i++) {
        let sFind = asSearches[i];
        sFind = sFind.replace (/\ OR\ /, '|');
        console.log("sFind: ", sFind);
        //    console.log ("sFind[0]: ", sFind[0]);

        //    asPrev.forEach((sFind, index) => {
        //console.log("sFind: ", sFind);
        sFind = sFind.trim();
        //console.log(`sFind trimmed: *${sFind}*`);
        let asFinds = sFind.split("_");
        //console.log(`asFinds: ${asFinds}`);
        //console.log(`asFinds.length ${asFinds.length}`);
        if (asFinds.length > 1) { //['x y']
            asFinds.forEach((sCat) => {
                let asFindBars = sCat.split("|");
                if (asFindBars.length > 1) {
                    // there's an OR
                    asFindBars.forEach((sCatOr) => {
                        asSearchOr.push(sCatOr);
                    });
                } else {
                    if (sCat !== "any") {
                        //console.log(`pushing and 1: ${sCaT}`);
                        asSearchAnd.push(sCat);
                    }
                }
            });
        } else { // no &
            if (asFinds[0].length) {
                //console.log(`pushing and 2: |${asFinds[0]}|`);
                asSearchAnd.push(asFinds[0]);
            }
        }
    }
    for (let i: number = 0; i < asSearchAnd.length; i++) {
        asSearchAnd[i] = asSearchAnd[i].replace(/\s/g, '');
        console.log(`asSA spaces removed: |${asSearchAnd[i]}|`);
    }
    for (let i: number = 0; i < asSearchOr.length; i++) {
        asSearchOr[i] = asSearchOr[i].replace(/\s/g, '');
        console.log(`asSO spaces removed: |${asSearchOr[i]}|`);
    }

    //console.log("/contacts/search: ", asSearchAnd, asSearchOr);
    await dbConn.queryDB(asSearchAnd, asSearchOr).then(function (aoFound: any[]) {
        // mongo returns an extra null element on the end of the array
        // don't ask why howMany is done in such a weird way
        // handlebars wasn't coping with an extra variable
        if (aoFound.length === undefined || aoFound.length <= 1) { // none found
            aoFound.length = 0;
            aoFound.push({
                GivenName: "None",
                FamilyName: "found"
            });
            //    aoFound.length = 1;
            // aoFound[0].GivenName = "None";
            // aoFound[0].FamilyName = "found";
            aoFound[0].howMany = 0; // don't count this one!
        } else {
            aoFound.length = aoFound.length - 1;        // take off the null at the end
            //aoFound[0].howMany = aoFound.length;      // who knows?
        }
        console.log("aoF length: ", aoFound.length);
        //console.log ("aoFound: ", aoFound);
        for (let i: number = 0; i < aoFound.length; i++) {
            aoFound[i].itemNum = i;
        }
        // aoFoundPeople = aoFound;
        //        console.log("/contacts/search: ", aoFoundPeople);
        // askFC(aoFound[0]['Phone1-Value']).then(function (picture) {
        // res.render("index", {
        //     search: true,
        //     asPrevSearch: asPrev,
        //     aoFound: aoFound,
        //     showImage: false
        // });
        // });
        res.json({
            aoFound
        }); // and sends it
    })
    .catch (function (err: any) {
        console.log (`queryDB error ${err}`);
    });

    return;
});

 module.exports = router;