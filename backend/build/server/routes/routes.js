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
var express = require("express");
let router = express.Router();
const dbConn = require("../models/connection");
var userInfo;
router.get('/login', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('get /login');
        userInfo = { Email: "", Location: "", Hash: "" };
        let sSearch = req.url.split('?')[1];
        sSearch = decodeURIComponent(sSearch);
        let sParams = sSearch.split('q=');
        sParams = sParams[1].split('&');
        let sEmail = sParams[0];
        let sPassword = sParams[1];
        let sLocation = undefined;
        let err;
        if (sEmail && sPassword) {
            console.log("User, password:", sEmail, sPassword);
            yield dbConn.checkLogin(sEmail, sPassword, function (bOK, user) {
                if (bOK === false) {
                    console.log(`Login failed: error ${bOK}, user |${user}|`);
                    let err = new Error('Wrong email or password.');
                    err.status = 401;
                    return next(err);
                }
                else {
                    console.log('Successful login - user: ', user);
                    userInfo = user;
                    console.log("Successful login - userInfo:", userInfo);
                    res.json(user);
                }
            });
        }
        else {
            console.log('Returning error');
            let err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    });
});
router.get('/newPassword', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('new password');
        let sSearch = req.url.split('?')[1];
        sSearch = decodeURIComponent(sSearch);
        let sParams = sSearch.split('q=');
        sParams = sParams[1].split('&');
        let sEmail = sParams[0];
        let sNewPassword = sParams[1];
        let sResult = yield dbConn.UpdateHash(sEmail, sNewPassword);
        console.log('get new password - result', sResult);
        res.json(sResult);
        return;
    });
});
router.get('/addUser', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var oUser = { Email: "", Location: "", Hash: "" };
        let sSearch = req.url.split('?')[1];
        sSearch = decodeURIComponent(sSearch);
        let sParams = sSearch.split('q=');
        sParams = sParams[1].split('&');
        oUser.Email = sParams[0];
        oUser.Location = sParams[2];
        let oResult = yield dbConn.addUser(oUser, sParams[1]);
        console.log('get addUser - result', oResult);
        res.json(oResult);
        return;
    });
});
router.get("/listUsers", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield dbConn.queryDB('', '', 'users').then(function (aoFound) {
            if (aoFound.length === undefined || aoFound.length <= 1) {
                aoFound.length = 0;
                aoFound.push({
                    TruckNum: "None found"
                });
                aoFound[0].howMany = 0;
            }
            else {
                aoFound.length = aoFound.length - 1;
            }
            console.log("aoF length: ", aoFound.length);
            for (let i = 0; i < aoFound.length; i++) {
                aoFound[i].itemNum = i;
            }
            res.json({ aoFound });
        })
            .catch(function (err) {
            console.log(`queryDB error ${err}`);
        });
        return;
    });
});
router.get("/removeUser", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("remove user");
        console.log('req.url: ', req.url);
        let sEmail = req.url.split('=')[1];
        sEmail = decodeURIComponent(sEmail);
        console.log('sEmail: ', sEmail);
        let oResult = yield dbConn.removeUser(sEmail);
        console.log(oResult);
        res.json(oResult);
        return;
    });
});
router.get("/listPrices", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let sLocation = req.url.split('=')[1];
        sLocation = decodeURIComponent(sLocation);
        console.log('sLocation: ', sLocation);
        yield dbConn.queryDB('-1', sLocation, 'prices').then(function (aoFound) {
            aoFound.length = aoFound.length - 1;
            console.log(`Found ${aoFound.length} prices.`);
            res.json({
                aoFound
            });
        });
        return;
    });
});
router.get("/removePrice", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("remove price");
        let sSearch = req.url.split('?')[1];
        sSearch = decodeURIComponent(sSearch);
        let sParams = sSearch.split('q=');
        sParams = sParams[1].split('&');
        let sLocation = sParams[0];
        let sDate = sParams[1];
        console.log('Removing price:', sLocation, sDate);
        let oRes = yield dbConn.removePrice(sLocation, sDate);
        res.json(oRes.result);
        return;
    });
});
router.get('/addPrice', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var oPriceInfo = { Location: "", Price: 0, Date: "" };
        let sSearch = req.url.split('?')[1];
        sSearch = decodeURIComponent(sSearch);
        let sParams = sSearch.split('q=');
        sParams = sParams[1].split('&');
        oPriceInfo.Location = sParams[0];
        oPriceInfo.Price = parseFloat(sParams[1]);
        oPriceInfo.Date = sParams[2];
        let oResult = yield dbConn.addPrice(oPriceInfo);
        console.log('get addPrice - result', oResult);
        res.json(oResult);
        return;
    });
});
router.get("/listTrucks", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let sLocation = req.url.split('=')[1];
        sLocation = decodeURIComponent(sLocation);
        console.log('sLocation: ', sLocation);
        yield dbConn.queryDB('-1', sLocation, 'trucks').then(function (aoFound) {
            console.log(`Found ${aoFound.length} trucks.`);
            res.json({
                aoFound
            });
        });
    });
});
router.get("/listUsers", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("user list");
        yield dbConn.queryDB('-1', "", 'users').then(function (aoFound) {
            console.log(`Found ${aoFound.length} users.`);
            res.json({
                aoFound
            });
        });
    });
});
router.get("/truck", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("get truck data");
        console.log('req.url: ', req.url);
        let sSearch = req.url.split('=')[1];
        sSearch = decodeURIComponent(sSearch);
        console.log('sSearch: ', sSearch);
        yield dbConn.queryDB(sSearch, 'any', 'trucks').then(function (aoFound) {
            if (aoFound.length === undefined || aoFound.length <= 1) {
                aoFound.length = 0;
                aoFound.push({
                    TruckNum: "None found"
                });
                aoFound[0].howMany = 0;
            }
            else {
                aoFound.length = aoFound.length - 1;
            }
            console.log("aoF length: ", aoFound.length);
            for (let i = 0; i < aoFound.length; i++) {
                aoFound[i].itemNum = i;
            }
            res.json({ aoFound });
        })
            .catch(function (err) {
            console.log(`queryDB error ${err}`);
        });
        return;
    });
});
router.get("/fuel", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("get fueling data");
        console.log('req.url: ', req.url);
        let sSearch = req.url.split('=')[1];
        sSearch = decodeURIComponent(sSearch);
        console.log('sSearch: ', sSearch);
        yield dbConn.queryDB('-2', sSearch, 'trucks').then(function (aoFound) {
            aoFound.length = aoFound.length - 1;
            console.log("aoF length: ", aoFound.length);
            for (let i = 0; i < aoFound.length; i++) {
                aoFound[i].itemNum = i;
            }
            res.json({ aoFound });
        })
            .catch(function (err) {
            console.log(`queryDB error ${err}`);
        });
        return;
    });
});
module.exports = router;
//# sourceMappingURL=routes.js.map