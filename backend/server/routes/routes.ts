var express = require ("express");
let router = express.Router();
const dbConn = require("../models/connection");
import {OUserData, OPriceData} from '../models/connection';

var userInfo: OUserData;

router.get('/login', async function (req: any, res: any, next: any) {
    console.log('get /login');
    userInfo = { Email: "", Location: "", Hash: "" };
    let sSearch: string = req.url.split('?')[1];   // leaves q=email&pswd
    sSearch = decodeURIComponent(sSearch);
    let sParams: string[] = sSearch.split('q=');
    sParams = sParams[1].split('&');
    let sEmail: string = sParams[0];
    let sPassword: string = sParams[1];
    let sLocation: string = undefined;
    let err: Error;

    if (sEmail && sPassword) {
        console.log("User, password:", sEmail, sPassword);
        await dbConn.checkLogin(sEmail, sPassword, function (bOK: any, user: any) {
            if (bOK === false) {
                console.log(`Login failed: error ${bOK}, user |${user}|`);
                let err: any = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                console.log('Successful login - user: ', user);
                userInfo = user;
                console.log("Successful login - userInfo:", userInfo);
                res.json(user);
            }
        });
    } else {
        // should never happen - caught by client
        console.log('Returning error');
        let err: any = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});
  
router.get ('/newPassword', async function (req: any, res: any, next: any) {
    console.log ('new password');
    let sSearch: string = req.url.split ('?')[1];   // leaves q=email&pswd
    sSearch = decodeURIComponent (sSearch);
    let sParams: string[] = sSearch.split ('q=');
    sParams = sParams[1].split('&');
    let sEmail: string = sParams[0];
    let sNewPassword: string = sParams[1];
    let sResult = await dbConn.UpdateHash (sEmail, sNewPassword);
    console.log ('get new password - result', sResult);
    res.json (sResult);    // sResult is email
    return;
});

router.get ('/addUser', async function (req: any, res: any, next: any) {
    var oUser: OUserData = {Email: "", Location: "", Hash: ""};
    // url is ?q=email&pswd&location
    let sSearch: string = req.url.split ('?')[1];   // leaves q=email&pswd
    sSearch = decodeURIComponent (sSearch);
    let sParams: string[] = sSearch.split ('q=');
    sParams = sParams[1].split('&');
    oUser.Email = sParams[0];
    oUser.Location = sParams[2];
    let oResult: any = await dbConn.addUser (oUser, sParams[1]);
    console.log ('get addUser - result', oResult);
    res.json (oResult);          // oResult is user
    return;
});

// generates a list of users to select one for removal
router.get("/listUsers", async function (req: Request, res: any) {
    await dbConn.queryDB('', '', 'users').then(function (aoFound: any[]) {
        // don't care about the second search item
        // mongo returns an extra null element on the end of the array
        if (aoFound.length === undefined || aoFound.length <= 1) { // none found
            aoFound.length = 0;
            aoFound.push({
                TruckNum: "None found"
            });
            aoFound[0].howMany = 0; // don't count this one!
        } else {
            aoFound.length = aoFound.length - 1;        // take off the null at the end
        }
        console.log("aoF length: ", aoFound.length);
        for (let i: number = 0; i < aoFound.length; i++) {
            aoFound[i].itemNum = i;
        }
        res.json({aoFound}); // send it
    })
    .catch(function (err: any) {
        console.log(`queryDB error ${err}`);
    });

    return;
});

router.get("/removeUser", async function (req: Request, res: any) {
    console.log("remove user");
    console.log ('req.url: ', req.url);
    let sEmail: string = req.url.split ('=')[1];
    sEmail = decodeURIComponent (sEmail);
    console.log ('sEmail: ', sEmail);
    let oResult: any = await dbConn.removeUser (sEmail);
    console.log (oResult);
    res.json (oResult);
    return;
});
  
// generates a list of prices for a location
router.get("/listPrices", async function (req: Request, res: any) {
    let sLocation: string = req.url.split('=')[1];
    sLocation = decodeURIComponent(sLocation);
    console.log('sLocation: ', sLocation);

    await dbConn.queryDB('-1', sLocation, 'prices').then(function (aoFound: any[]) {
        aoFound.length = aoFound.length - 1;    // mongo always returns a null record on the end
        console.log(`Found ${aoFound.length} prices.`);
        res.json({
            aoFound
        });
    });
    return;
});

router.get("/removePrice", async function (req: Request, res: any) {
    // location, date (as '20190701')
    console.log("remove price");
    // url is ?q=Location&Date
    let sSearch: string = req.url.split ('?')[1];   // leaves q=email&pswd
    sSearch = decodeURIComponent (sSearch);
    let sParams: string[] = sSearch.split ('q=');
    sParams = sParams[1].split('&');
    let sLocation: string = sParams[0];
    let sDate: string = sParams[1];
    console.log ('Removing price:', sLocation, sDate);
    let oRes: any = await dbConn.removePrice (sLocation, sDate);
//    console.log (oResult);
    res.json (oRes.result);
    return;
});

router.get ('/addPrice', async function (req: any, res: any, next: any) {
    var oPriceInfo: OPriceData = {Location: "", Price: 0, Date: ""};
    // url is ?q=email&pswd&location
    let sSearch: string = req.url.split ('?')[1];   // leaves q=Location&Price&Date
    sSearch = decodeURIComponent (sSearch);
    let sParams: string[] = sSearch.split ('q=');
    sParams = sParams[1].split('&');
    oPriceInfo.Location = sParams[0];
    oPriceInfo.Price = parseFloat (sParams[1]);
    oPriceInfo.Date = sParams[2];
    let oResult: any = await dbConn.addPrice (oPriceInfo);
    console.log ('get addPrice - result', oResult);
    res.json (oResult);          // oResult is price
    return;
});


router.get("/listTrucks", async function (req: Request, res: any) {
    let sLocation: string = req.url.split ('=')[1];
    sLocation = decodeURIComponent (sLocation);
    console.log ('sLocation: ', sLocation);          // could be 'any'

   await dbConn.queryDB('-1', sLocation, 'trucks').then(function (aoFound: any[]) {
       console.log (`Found ${aoFound.length} trucks.`)
        res.json({
            aoFound
        });
   });
});

router.get("/listUsers", async function (req: Request, res: any) {
    console.log ("user list");

   await dbConn.queryDB('-1', "", 'users').then(function (aoFound: any[]) {
       console.log (`Found ${aoFound.length} users.`)
        res.json({
            aoFound
        });
   });
});

router.get("/truck", async function (req: Request, res: any) {
    console.log("get truck data");
    console.log ('req.url: ', req.url);
    let sSearch: string = req.url.split ('=')[1];
    sSearch = decodeURIComponent (sSearch);
    console.log ('sSearch: ', sSearch);

    await dbConn.queryDB(sSearch, 'any', 'trucks').then(function (aoFound: any[]) {
        // mongo returns an extra null element on the end of the array
        if (aoFound.length === undefined || aoFound.length <= 1) { // none found
            aoFound.length = 0;
            aoFound.push({
                TruckNum: "None found"
            });
            aoFound[0].howMany = 0; // don't count this one!
        } else {
            aoFound.length = aoFound.length - 1;        // take off the null at the end
        }
        console.log("aoF length: ", aoFound.length);
        for (let i: number = 0; i < aoFound.length; i++) {
            aoFound[i].itemNum = i;
        }
        res.json({aoFound}); // send it
    })
    .catch(function (err: any) {
        console.log(`queryDB error ${err}`);
    });
    return;
});

// get all fuelings for a location - used to write a file for DC
router.get("/fuel", async function (req: Request, res: any) {
    console.log("get fueling data");
    console.log ('req.url: ', req.url);
    let sSearch: string = req.url.split ('=')[1];
    sSearch = decodeURIComponent (sSearch);
    console.log ('sSearch: ', sSearch);     // should be the location

    await dbConn.queryDB('-2', sSearch, 'trucks').then(function (aoFound: any[]) {
        // fuel rcds for all trucks at location (-1 is truck numbers for location)
        // would be more efficient to use the start and end date for the file, but
        // never mind for now
        // mongo returns an extra null element on the end of the array
        aoFound.length = aoFound.length - 1;        // take off the null at the end
        console.log("aoF length: ", aoFound.length);
        for (let i: number = 0; i < aoFound.length; i++) {
            aoFound[i].itemNum = i;
        }
        res.json({aoFound}); // send it
    })
    .catch(function (err: any) {
        console.log(`queryDB error ${err}`);
    });
    return;
});

 module.exports = router;