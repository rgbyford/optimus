var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var express = require("express");
let router = express.Router();
const cjFns = require("../models/csvjson");
const vcfFns = require('../models/vcfjson');
const dbFunctions = require("../models/database");
const dbConn = require("../models/connection");
let aoCats = [{}];
var multer = require("multer");
var uploadMulter = multer({
    dest: "./uploads/"
});
router.put("/contacts/import", uploadMulter.single("avatar"), function (req) {
    return __awaiter(this, void 0, void 0, function* () {
        dbFunctions.writeDateFile();
        if (req.body.clearDB === 'true') {
            yield dbConn.clearDB();
        }
        if (req.body.clearCats === 'true') {
            dbFunctions.deleteCatsFile();
        }
        let fname = req.file.filename.toLowerCase();
        console.log("file name: ", fname);
        if (req.body.csv === 'true') {
            cjFns.csvJson(fname);
        }
        else {
            vcfFns.vcfJson(fname);
        }
    });
});
router.get('/categories', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("server get cats");
    console.log("cwd:", process.cwd());
    try {
        aoCats = dbFunctions.readCatsFile();
        res.json({
            aoCats
        });
    }
    catch (err) {
        console.log("categories fetch error");
        res.json({
            error: err.message || err.toString()
        });
    }
}));
router.get('/loadDate', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("get load date");
    const date = dbFunctions.readDateFile();
    res.json(date);
}));
router.get("/contacts", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("get contacts");
        let asSearchAnd = [];
        let asSearchOr = [];
        console.log('req.url: ', req.url);
        let sSearch = req.url.split('=')[1];
        sSearch = decodeURIComponent(sSearch);
        console.log('sSearch: ', sSearch);
        let asSearches = sSearch.split('@');
        console.log('asSearches: ', asSearches);
        for (let i = 0; i < asSearches.length; i++) {
            let sFind = asSearches[i];
            sFind = sFind.replace(/\ OR\ /, '|');
            console.log("sFind: ", sFind);
            sFind = sFind.trim();
            let asFinds = sFind.split("_");
            if (asFinds.length > 1) {
                asFinds.forEach((sCat) => {
                    let asFindBars = sCat.split("|");
                    if (asFindBars.length > 1) {
                        asFindBars.forEach((sCatOr) => {
                            asSearchOr.push(sCatOr);
                        });
                    }
                    else {
                        if (sCat !== "any") {
                            asSearchAnd.push(sCat);
                        }
                    }
                });
            }
            else {
                if (asFinds[0].length) {
                    asSearchAnd.push(asFinds[0]);
                }
            }
        }
        for (let i = 0; i < asSearchAnd.length; i++) {
            asSearchAnd[i] = asSearchAnd[i].replace(/\s/g, '');
            console.log(`asSA spaces removed: |${asSearchAnd[i]}|`);
        }
        for (let i = 0; i < asSearchOr.length; i++) {
            asSearchOr[i] = asSearchOr[i].replace(/\s/g, '');
            console.log(`asSO spaces removed: |${asSearchOr[i]}|`);
        }
        yield dbConn.queryDB(asSearchAnd, asSearchOr).then(function (aoFound) {
            if (aoFound.length === undefined || aoFound.length <= 1) {
                aoFound.length = 0;
                aoFound.push({
                    GivenName: "None",
                    FamilyName: "found"
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
            res.json({
                aoFound
            });
        })
            .catch(function (err) {
            console.log(`queryDB error ${err}`);
        });
        return;
    });
});
module.exports = router;
//# sourceMappingURL=routes.js.map