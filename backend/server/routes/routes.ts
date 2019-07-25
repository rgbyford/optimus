var express = require ("express");
let router = express.Router();
const dbConn = require("../models/connection");
import {OUserData} from '../models/connection';

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
    let sSearch: string = req.url.split ('?')[1];   // leaves q=email&pswd
    sSearch = decodeURIComponent (sSearch);
    let sParams: string[] = sSearch.split ('q=');
    sParams = sParams[1].split('&');
    let sEmail: string = sParams[0];
    let sNewPassword: string = sParams[1];
    await dbConn.UpdateHash (sEmail, sNewPassword);
    return;
});

router.get ('/addUser', async function (req: any, res: any, next: any) {
    var oUser: OUserData;
    // url is ?q=email&pswd&location
    let sSearch: string = req.url.split ('?')[1];   // leaves q=email&pswd
    sSearch = decodeURIComponent (sSearch);
    let sParams: string[] = sSearch.split ('q=');
    sParams = sParams[1].split('&');
    oUser.Email = sParams[0];
    oUser.Location = sParams[2];
    await dbConn.addUser (oUser, sParams[1]);
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
    await dbConn.removeUser (sEmail);
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

 module.exports = router;