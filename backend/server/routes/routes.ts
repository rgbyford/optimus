var express = require ("express");
let router = express.Router();
const dbFunctions = require("../models/database");
const dbConn = require("../models/connection");

let aoCats: object[] = [{}];

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


router.get("/truck", async function (req: Request, res: any) {
    console.log("get truck data");
    console.log ('req.url: ', req.url);
    let sSearch: string = req.url.split ('=')[1];
    sSearch = decodeURIComponent (sSearch);
    console.log ('sSearch: ', sSearch);

    await dbConn.queryDB(sSearch).then(function (aoFound: any[]) {
        // mongo returns an extra null element on the end of the array
        // don't ask why howMany is done in such a weird way
        // handlebars wasn't coping with an extra variable
        if (aoFound.length === undefined || aoFound.length <= 1) { // none found
            aoFound.length = 0;
            aoFound.push({
                TruckNum: "None found"
            });
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
        res.json({
            aoFound
        }); // and sends it
    })
        .catch(function (err: any) {
            console.log(`queryDB error ${err}`);
        });

    return;
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