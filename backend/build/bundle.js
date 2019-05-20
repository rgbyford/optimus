/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/server.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/models/connection.ts":
/*!*************************************!*\
  !*** ./server/models/connection.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst MongoClient = __webpack_require__(/*! mongodb */ \"mongodb\");\r\nconst dbName = \"toby\";\r\nlet dbToby;\r\nconst url = \"mongodb://localhost:27017\";\r\nconst appFns = __webpack_require__(/*! ../server */ \"./server/server.ts\");\r\nMongoClient.connect(url, function (err, client) {\r\n    if (err) {\r\n        throw err;\r\n    }\r\n    dbToby = client.db(dbName);\r\n    dbToby.stats().then(function (res) {\r\n        console.log(\"Connected to database: \", res);\r\n    }).catch(function (err) {\r\n        console.log(`Mongo connect error: ${err}`);\r\n    });\r\n});\r\nfunction clearDB() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        try {\r\n            yield dbToby.collection(\"contacts\").drop();\r\n            console.log(\"Database emptied\");\r\n        }\r\n        catch (error) {\r\n            console.log(\"Error emptying database\");\r\n        }\r\n    });\r\n}\r\nexports.clearDB = clearDB;\r\nmodule.exports.queryDB = function (asSearchAnd, asSearchOr) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        let aoFound = [{}];\r\n        let oSearch = {\r\n            GroupMembership: {\r\n                $all: asSearchAnd,\r\n                $in: asSearchOr\r\n            }\r\n        };\r\n        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {\r\n            console.log(`typeof asSearchOr: ${typeof (asSearchOr)} length: ${asSearchOr.length} |${asSearchOr}|`);\r\n            if (asSearchOr.length === 0) {\r\n                console.log(\"Empty OR search\");\r\n                if (asSearchAnd.length === 0) {\r\n                    oSearch.GroupMembership.$all = [];\r\n                    oSearch.GroupMembership.$in = [];\r\n                    console.log(\"Search any\");\r\n                }\r\n                else {\r\n                    asSearchOr[0] = asSearchAnd[0];\r\n                }\r\n            }\r\n            console.log(`SearchAnd: *${asSearchAnd}* searchOr: *${asSearchOr}*`);\r\n            console.log(\"oSearch: \", oSearch);\r\n            const cursor = dbToby.collection(\"contacts\").find(oSearch)\r\n                .project({\r\n                GivenName: 1,\r\n                FamilyName: 1,\r\n                GroupMembership: 1,\r\n                Photo1: 1,\r\n                'Phone1-Value': 1,\r\n                'E-mail1-Value': 1,\r\n                FC_ID1: 1,\r\n                FC_ID2: 1,\r\n                imageURL: 1\r\n            });\r\n            let itemCount = 0;\r\n            yield cursor.each(function (err, item) {\r\n                if (err) {\r\n                    console.log(\"Cursor error: \", err);\r\n                    throw (err);\r\n                }\r\n                if (item === null) {\r\n                    console.log(`Last item. ${aoFound.length} found.`);\r\n                    resolve(aoFound);\r\n                }\r\n                aoFound[itemCount++] = item;\r\n                return;\r\n            });\r\n            console.log(\"end of queryDB - found: \", aoFound.length);\r\n        }));\r\n    });\r\n};\r\nlet iRowsCBCount = 0;\r\nlet dbStuff = __webpack_require__(/*! ./database */ \"./server/models/database.ts\");\r\nlet oContactSaved;\r\nlet aoModified = [{}];\r\nlet bLast;\r\nlet iRowsResultBad;\r\nlet iRowsNBad;\r\nmodule.exports.getSaved = function async() {\r\n    return (dbStuff.adminDb.contacts.find());\r\n};\r\nmodule.exports.getModified = function () {\r\n    console.log(\"gM: \", aoModified.length);\r\n    return (aoModified);\r\n};\r\nmodule.exports.getLoaded = function () {\r\n    return (iRowsCBCount);\r\n};\r\nmodule.exports.prepLoad = function () {\r\n    iRowsCBCount = 0;\r\n    aoModified.length = 0;\r\n};\r\nfunction insertContactCallback(err, res) {\r\n    if (err) {\r\n        console.log(\"iC err: \", err.name, err.message);\r\n        console.log(\"iC err - not loaded\", aoModified.length);\r\n    }\r\n    else {\r\n        if (res.result.nModified > 0) {\r\n            let oMod = {};\r\n            oMod.GivenName = oContactSaved.GivenName;\r\n            oMod.FamilyName = oContactSaved.FamilyName;\r\n            aoModified.push(oMod);\r\n        }\r\n        if (res.result.n !== 1) {\r\n            console.log(`nR != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);\r\n            iRowsNBad++;\r\n        }\r\n        if (res.result.ok !== 1) {\r\n            console.log(`ok != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);\r\n            iRowsResultBad++;\r\n        }\r\n        iRowsCBCount++;\r\n        dbStuff.importNames();\r\n    }\r\n    if (bLast) {\r\n        console.log(\"last callback\");\r\n        console.log(\"Modified: \", aoModified.length);\r\n        console.log(\"RowsNBad\", iRowsNBad);\r\n        console.log(\"iRowsResultBad\", iRowsResultBad);\r\n        dbStuff.writeFile();\r\n        aoModified.shift();\r\n        appFns.sendSomething(aoModified);\r\n        bLast = false;\r\n    }\r\n    return;\r\n}\r\nmodule.exports.insertContact = function (oContact, bLastParam) {\r\n    bLast = bLastParam;\r\n    oContactSaved = oContact;\r\n    dbToby.collection(\"contacts\").updateOne({\r\n        \"E-mail1-Value\": oContact[\"E-mail1-Value\"],\r\n        \"GivenName\": oContact[\"GivenName\"],\r\n        \"FamilyName\": oContact[\"FamilyName\"]\r\n    }, {\r\n        $set: oContact\r\n    }, {\r\n        upsert: true\r\n    }, insertContactCallback);\r\n};\r\n\n\n//# sourceURL=webpack:///./server/models/connection.ts?");

/***/ }),

/***/ "./server/models/csvjson.ts":
/*!**********************************!*\
  !*** ./server/models/csvjson.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const dbStuff = __webpack_require__(/*! ./database */ \"./server/models/database.ts\");\r\nlet papa = __webpack_require__(/*! papaparse */ \"papaparse\");\r\nvar fs = __webpack_require__(/*! fs */ \"fs\");\r\nlet index = 0;\r\nlet fileName;\r\nlet fd;\r\nfunction CJDone() {\r\n    dbStuff.importNames(index);\r\n    console.log(`import done: ${index} rows according to papaparse`);\r\n    fs.closeSync(fd);\r\n    fs.unlinkSync('./uploads/' + fileName);\r\n    index = 0;\r\n}\r\nfunction CJRow(results) {\r\n    index++;\r\n    dbStuff.pushContact(results.data);\r\n}\r\n;\r\nvar myConfig = {\r\n    newLine: \"\",\r\n    quoteChar: '\"',\r\n    delimiter: \"\",\r\n    escapeChar: '\"',\r\n    header: true,\r\n    trimHeaders: false,\r\n    dynamicTyping: false,\r\n    preview: 0,\r\n    encoding: \"\",\r\n    worker: false,\r\n    comments: false,\r\n    step: CJRow,\r\n    complete: CJDone,\r\n    error: undefined,\r\n    download: false,\r\n    skipEmptyLines: false,\r\n    chunk: undefined,\r\n    fastMode: undefined,\r\n    beforeFirstChunk: undefined,\r\n    withCredentials: undefined,\r\n    transform: undefined\r\n};\r\nmodule.exports.csvJson = function (file) {\r\n    console.log(\"csvJson file:\", file);\r\n    dbStuff.clearContacts('CSV');\r\n    fileName = file;\r\n    dbStuff.readCatsFile();\r\n    fd = fs.openSync(\"./uploads/\" + file);\r\n    var content = fs.readFileSync(fd, \"utf8\");\r\n    papa.parse(content, myConfig);\r\n};\r\n\n\n//# sourceURL=webpack:///./server/models/csvjson.ts?");

/***/ }),

/***/ "./server/models/database.ts":
/*!***********************************!*\
  !*** ./server/models/database.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const connFns = __webpack_require__(/*! ./connection */ \"./server/models/connection.ts\");\r\nconst serverFns = __webpack_require__(/*! ../server */ \"./server/server.ts\");\r\nlet iBadOnes = 0;\r\nlet iRows = 0;\r\nlet aoContacts = [];\r\nlet aasTagsMain = [\r\n    ['1', '1'],\r\n    ['event', 'event'],\r\n    ['los', 'los'],\r\n    ['mashable', 'mashable'],\r\n    ['PP', 'PP'],\r\n    ['seven-horizons', 'seven-horizons'],\r\n    ['via-ace', 'via-ace'],\r\n    ['x', 'x'],\r\n    ['pp', 'Prodigium'],\r\n    ['coc', 'Cinema of Change'],\r\n    ['dis', 'dis'],\r\n    ['ethn', 'ethnicity'],\r\n    ['gend', 'gender'],\r\n    ['intellectual', 'intellectual'],\r\n    ['id', 'ideology'],\r\n    ['lang', 'language spoken'],\r\n    ['loc', 'location'],\r\n    ['net', 'shared network'],\r\n    ['team', 'Prodigium worker'],\r\n    ['research', 'researcher'],\r\n    ['sport', 'sports pro'],\r\n    ['queer', 'neither']\r\n];\r\nlet aoTagNames = [];\r\nfor (let i = 0; i < aasTagsMain.length; i++) {\r\n    aoTagNames.push({\r\n        'sShortName': aasTagsMain[i][0],\r\n        'sLongName': aasTagsMain[i][1]\r\n    });\r\n}\r\nclass AoCats {\r\n    constructor(sCat, sSubCat) {\r\n        this.sIsSubCatOf = sCat;\r\n        this.sThisCat = sSubCat;\r\n    }\r\n}\r\nlet aoCatsRead;\r\nconst fsDB = __webpack_require__(/*! fs */ \"fs\");\r\nlet fdCats;\r\nfunction indexOfByKey(obj_list, key, value) {\r\n    for (let index = 0; index < obj_list.length; index++) {\r\n        if (obj_list[index][key] === value)\r\n            return index;\r\n    }\r\n    return -1;\r\n}\r\nmodule.exports.writeDateFile = function () {\r\n    const fdDate = fsDB.openSync('loaddate.txt', 'w');\r\n    let dDate = new Date();\r\n    let sDate;\r\n    console.log('sDate1: ', dDate);\r\n    sDate = dDate.toString().slice(4, 15);\r\n    console.log(\"sDate2:\", sDate);\r\n    fsDB.writeFileSync(fdDate, sDate);\r\n    fsDB.closeSync(fdDate);\r\n};\r\nmodule.exports.readDateFile = function () {\r\n    const fdDate = fsDB.openSync('loaddate.txt', 'r');\r\n    const sDate = fsDB.readFileSync(fdDate, \"utf8\");\r\n    fsDB.closeSync(fdDate);\r\n    return (sDate);\r\n};\r\nfunction openCatsFile(mode) {\r\n    console.log(\"cwd:\", process.cwd());\r\n    fdCats = fsDB.openSync(\"categories.txt\", mode);\r\n}\r\nfunction writeCatsFile(aoCats) {\r\n    openCatsFile(\"w\");\r\n    fsDB.writeFileSync(fdCats, JSON.stringify(aoCats));\r\n    fsDB.closeSync(fdCats);\r\n}\r\nmodule.exports.deleteCatsFile = function () {\r\n    fsDB.unlinkSync('categories.txt', (err) => {\r\n        if (err)\r\n            throw err;\r\n        console.log('categories file deleted');\r\n    });\r\n};\r\nmodule.exports.writeFile = function () {\r\n    console.log(\"wCF: \", aoCatsRead.length);\r\n    console.log(\"Bad tags: \", iBadOnes);\r\n    aoCatsRead.sort((a, b) => (a.sThisCat > b.sThisCat) ? 1 : (b.sThisCat > a.sThisCat) ? -1 : 0);\r\n    writeCatsFile(aoCatsRead);\r\n    iBadOnes = 0;\r\n};\r\nmodule.exports.readCatsFile = function () {\r\n    openCatsFile(\"a+\");\r\n    console.log(\"readCatsFile: \", fdCats);\r\n    const sCats = fsDB.readFileSync(fdCats, \"utf8\");\r\n    if (sCats.length) {\r\n        aoCatsRead = JSON.parse(sCats);\r\n    }\r\n    else {\r\n        aoCatsRead = [];\r\n    }\r\n    fsDB.closeSync(fdCats);\r\n    return (aoCatsRead);\r\n};\r\nlet contactsSource;\r\nmodule.exports.clearContacts = function (source) {\r\n    contactsSource = source;\r\n    aoContacts.length = 0;\r\n    connFns.prepLoad();\r\n};\r\nmodule.exports.pushContact = function (oContact) {\r\n    aoContacts.push(oContact);\r\n};\r\nvar arrayUnique = function (arr) {\r\n    return arr.filter(function (item, index) {\r\n        return arr.indexOf(item) >= index;\r\n    });\r\n};\r\nfunction buildCategories(asTag) {\r\n    for (let i = 0; i < asTag.length; i++) {\r\n        if (asTag[i][0] !== \".\") {\r\n            iBadOnes++;\r\n            continue;\r\n        }\r\n        asTag[i] = asTag[i].slice(1);\r\n        asTag[i] = asTag[i].replace(\"..\", \"_\");\r\n        asTag[i] = asTag[i].replace(\"vendors\", \"vendor\");\r\n        asTag[i] = asTag[i].replace(/\\./g, \"_\");\r\n        let asCatSub = asTag[i].split(\"_\");\r\n        let iTagPos = indexOfByKey(aoTagNames, 'sShortName', asCatSub[0]);\r\n        if (iTagPos >= 0) {\r\n            asCatSub[0] = aoTagNames[iTagPos].sLongName;\r\n        }\r\n        let sIsSubCatOf = \"\";\r\n        for (let j = 0; j < asCatSub.length; j++) {\r\n            let iCatFound;\r\n            iCatFound = aoCatsRead.findIndex(function (element) {\r\n                return (element.sThisCat === asCatSub[j]);\r\n            });\r\n            if (iCatFound < 0) {\r\n                aoCatsRead.push(new AoCats(sIsSubCatOf, asCatSub[j]));\r\n            }\r\n            sIsSubCatOf = asCatSub[j];\r\n        }\r\n    }\r\n}\r\nlet iTotalRows;\r\nlet iPercent = 0;\r\nmodule.exports.importNames = function (iCount = 0) {\r\n    if (iCount > 0) {\r\n        iTotalRows = iCount;\r\n        iPercent = 0;\r\n    }\r\n    if (aoContacts.length === 0) {\r\n        console.log(`Import names done - ${iTotalRows} rows`);\r\n        return;\r\n    }\r\n    var oContact = {};\r\n    oContact.id = 0;\r\n    const nestedContent = aoContacts[0];\r\n    Object.keys(nestedContent).forEach(docTitle => {\r\n        let givenName;\r\n        let sPropName;\r\n        sPropName = docTitle.replace(/ /g, \"\");\r\n        if (sPropName === \"GivenName\") {\r\n            givenName = nestedContent[docTitle];\r\n            oContact.GivenName = givenName;\r\n        }\r\n        else if (sPropName === \"FamilyName\") {\r\n            oContact.FamilyName = nestedContent[docTitle];\r\n        }\r\n        else if (sPropName === \"GroupMembership\") {\r\n            let asFirstSplit;\r\n            let asSecondSplit = [];\r\n            let sValue = nestedContent[docTitle];\r\n            asFirstSplit = sValue.split(contactsSource === 'CSV' ? ' ::: ' : ',');\r\n            for (let i = 0; i < asFirstSplit.length; i++) {\r\n                let sTemp;\r\n                if (asFirstSplit[i].indexOf(\".loc_U\") < 0) {\r\n                    sTemp = asFirstSplit[i].replace(\".loc\", \"intl\");\r\n                }\r\n                else {\r\n                    sTemp = asFirstSplit[i];\r\n                }\r\n                if (sTemp[0] === '.') {\r\n                    sTemp = sTemp.slice(1);\r\n                }\r\n                asSecondSplit = asSecondSplit.concat(sTemp.split(\"_\"));\r\n                for (let j = 0; j < asSecondSplit.length; j++) {\r\n                    let iTagPos = indexOfByKey(aoTagNames, 'sShortName', asSecondSplit[j]);\r\n                    if (iTagPos >= 0) {\r\n                        asSecondSplit[j] = aoTagNames[iTagPos].sLongName;\r\n                    }\r\n                }\r\n            }\r\n            buildCategories(asFirstSplit);\r\n            oContact[sPropName] = arrayUnique(asSecondSplit);\r\n        }\r\n        else {\r\n            let value = nestedContent[docTitle];\r\n            value = value.toString().replace(/[%,]/g, \"\");\r\n            if (nestedContent[docTitle] !== \"\") {\r\n                oContact[sPropName] = value;\r\n            }\r\n        }\r\n    });\r\n    aoContacts.shift();\r\n    connFns.insertContact(oContact, aoContacts.length === 0);\r\n    if (iRows++ > iTotalRows / 50) {\r\n        iPercent += 2;\r\n        serverFns.sendProgress(iPercent.toString());\r\n        iRows = 0;\r\n    }\r\n    return;\r\n};\r\n\n\n//# sourceURL=webpack:///./server/models/database.ts?");

/***/ }),

/***/ "./server/models/vcfjson.ts":
/*!**********************************!*\
  !*** ./server/models/vcfjson.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("let dbContent = __webpack_require__(/*! ./database */ \"./server/models/database.ts\");\r\nconst fsV = __webpack_require__(/*! fs */ \"fs\");\r\nmodule.exports.vcfJson = function (file) {\r\n    let iTels = 1;\r\n    let iEmails = 1;\r\n    let iPhotos = 1;\r\n    let iOrgs = 1;\r\n    let iTitles = 1;\r\n    let iURLs = 1;\r\n    let iAdrs = 1;\r\n    let asFirst = [];\r\n    let asSecond = [];\r\n    let oContact = {};\r\n    let asLines = [];\r\n    let i;\r\n    let iCards = 0;\r\n    console.log(\"vcfJson: \", file);\r\n    dbContent.clearContacts('VCF');\r\n    dbContent.readCatsFile();\r\n    let fd = fsV.openSync(\"./uploads/\" + file, 'r+');\r\n    var content = fsV.readFileSync(fd, \"utf8\");\r\n    asLines = content.split('\\r\\n');\r\n    console.log('length: ', asLines.length);\r\n    for (i = 0; i < asLines.length - 1; i++) {\r\n        if (asLines[i].length < 2) {\r\n            continue;\r\n        }\r\n        let j = i;\r\n        while (asLines[i + 1][0] === ' ') {\r\n            asLines[j] += asLines[i + 1].substr(1);\r\n            i++;\r\n        }\r\n        let k;\r\n        for (k = 0; k < asLines[j].length; k++) {\r\n            if (asLines[j][k] === ':') {\r\n                break;\r\n            }\r\n        }\r\n        asFirst = asLines[j].slice(0, k).split(';');\r\n        asSecond = asLines[j].slice(k + 1).split(';');\r\n        switch (asFirst[0]) {\r\n            case 'N':\r\n                oContact['Family Name'] = asSecond[0];\r\n                oContact['Given Name'] = asSecond[1];\r\n                break;\r\n            case 'TEL':\r\n                let sTel = iTels.toString();\r\n                oContact['Phone' + sTel + '-Type'] = asFirst[1].substr(5);\r\n                oContact['Phone' + sTel + '-Value'] = asSecond[0];\r\n                iTels++;\r\n                break;\r\n            case 'EMAIL':\r\n                let sEmail = iEmails.toString();\r\n                oContact['E-mail' + sEmail + '-Type'] = asFirst[1].substr(5);\r\n                oContact['E-mail' + sEmail + '-Value'] = asSecond[0];\r\n                iEmails++;\r\n                break;\r\n            case 'X-FC-LIST-ID':\r\n                oContact['FC_ID1'] = asSecond[0];\r\n                break;\r\n            case 'X-ID':\r\n                oContact['FC_ID2'] = asSecond[0];\r\n                break;\r\n            case 'PHOTO':\r\n                let sPhoto = iPhotos.toString();\r\n                oContact['Photo' + sPhoto + ''] = asSecond[0];\r\n                iPhotos++;\r\n                break;\r\n            case 'ORG':\r\n                let sOrg = iOrgs.toString();\r\n                oContact['Organization' + sOrg + '-Name'] = asSecond[0];\r\n                iOrgs++;\r\n                break;\r\n            case 'TITLE':\r\n                let sTitle = iTitles.toString();\r\n                oContact['Organization' + sTitle + '-Title'] = asSecond[0];\r\n                iTitles++;\r\n                break;\r\n            case 'URL':\r\n                let sURL = iURLs.toString();\r\n                oContact['Website' + sURL + ''] = asSecond[0];\r\n                iURLs++;\r\n                break;\r\n            case 'NOTE':\r\n                oContact['Notes'] = asSecond[0];\r\n                break;\r\n            case 'ADR':\r\n                oContact['Address' + iAdrs + '-Street'] = asSecond[2];\r\n                oContact['Address' + iAdrs + '-City'] = asSecond[3];\r\n                oContact['Address' + iAdrs + '-State'] = asSecond[4];\r\n                oContact['Address' + iAdrs + '-PostalCode'] = asSecond[5];\r\n                oContact['Address' + iAdrs + '-Country'] = asSecond[6];\r\n                iAdrs++;\r\n                break;\r\n            case 'CATEGORIES':\r\n                oContact['Group Membership'] = asSecond[0];\r\n                break;\r\n            case 'END':\r\n                iTels = 1;\r\n                iEmails = 1;\r\n                iPhotos = 1;\r\n                iOrgs = 1;\r\n                iTitles = 1;\r\n                iURLs = 1;\r\n                iAdrs = 1;\r\n                dbContent.pushContact(oContact);\r\n                oContact = {};\r\n                iCards++;\r\n                break;\r\n            default:\r\n                break;\r\n        }\r\n    }\r\n    console.log(\"vcfJson complete, \", iCards, \" names\");\r\n    dbContent.importNames(iCards);\r\n    fsV.closeSync(fd);\r\n    fsV.unlinkSync('./uploads/' + file);\r\n};\r\n\n\n//# sourceURL=webpack:///./server/models/vcfjson.ts?");

/***/ }),

/***/ "./server/routes/routes.ts":
/*!*********************************!*\
  !*** ./server/routes/routes.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar express = __webpack_require__(/*! express */ \"express\");\r\nlet router = express.Router();\r\nconst cjFns = __webpack_require__(/*! ../models/csvjson */ \"./server/models/csvjson.ts\");\r\nconst vcfFns = __webpack_require__(/*! ../models/vcfjson */ \"./server/models/vcfjson.ts\");\r\nconst dbFunctions = __webpack_require__(/*! ../models/database */ \"./server/models/database.ts\");\r\nconst dbConn = __webpack_require__(/*! ../models/connection */ \"./server/models/connection.ts\");\r\nlet aoCats = [{}];\r\nvar multer = __webpack_require__(/*! multer */ \"multer\");\r\nvar uploadMulter = multer({\r\n    dest: \"./uploads/\"\r\n});\r\nrouter.put(\"/contacts/import\", uploadMulter.single(\"avatar\"), function (req, res, next) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        dbFunctions.writeDateFile();\r\n        console.log(\"/contacts/import req.body: \", req.body);\r\n        console.log(\"req.file: \", req.file);\r\n        console.log('req.file.path: ', req.file.path);\r\n        if (req.body.clearDB === 'true') {\r\n            yield dbConn.clearDB();\r\n        }\r\n        if (req.body.clearCats === 'true') {\r\n            dbFunctions.deleteCatsFile();\r\n        }\r\n        let fname = req.file.filename.toLowerCase();\r\n        console.log(\"file name: \", fname);\r\n        if (req.body.csv === 'true') {\r\n            cjFns.csvJson(fname);\r\n        }\r\n        else {\r\n            vcfFns.vcfJson(fname);\r\n        }\r\n    });\r\n});\r\nrouter.get('/categories', (req, res) => __awaiter(this, void 0, void 0, function* () {\r\n    console.log(\"server get cats\");\r\n    console.log(\"cwd:\", process.cwd());\r\n    try {\r\n        aoCats = dbFunctions.readCatsFile();\r\n        res.json({\r\n            aoCats\r\n        });\r\n    }\r\n    catch (err) {\r\n        console.log(\"categories fetch error\");\r\n        res.json({\r\n            error: err.message || err.toString()\r\n        });\r\n    }\r\n}));\r\nrouter.get('/loadDate', (req, res) => __awaiter(this, void 0, void 0, function* () {\r\n    console.log(\"get load date\");\r\n    const date = dbFunctions.readDateFile();\r\n    res.json(date);\r\n}));\r\nrouter.get(\"/contacts\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"get contacts\");\r\n        let asSearchAnd = [];\r\n        let asSearchOr = [];\r\n        console.log('req.url: ', req.url);\r\n        let sSearch = req.url.split('=')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        console.log('sSearch: ', sSearch);\r\n        let asSearches = sSearch.split('@');\r\n        console.log('asSearches: ', asSearches);\r\n        for (let i = 0; i < asSearches.length; i++) {\r\n            let sFind = asSearches[i];\r\n            sFind = sFind.replace(/\\ OR\\ /, '|');\r\n            console.log(\"sFind: \", sFind);\r\n            sFind = sFind.trim();\r\n            let asFinds = sFind.split(\"_\");\r\n            if (asFinds.length > 1) {\r\n                asFinds.forEach((sCat) => {\r\n                    let asFindBars = sCat.split(\"|\");\r\n                    if (asFindBars.length > 1) {\r\n                        asFindBars.forEach((sCatOr) => {\r\n                            asSearchOr.push(sCatOr);\r\n                        });\r\n                    }\r\n                    else {\r\n                        if (sCat !== \"any\") {\r\n                            asSearchAnd.push(sCat);\r\n                        }\r\n                    }\r\n                });\r\n            }\r\n            else {\r\n                if (asFinds[0].length) {\r\n                    asSearchAnd.push(asFinds[0]);\r\n                }\r\n            }\r\n        }\r\n        for (let i = 0; i < asSearchAnd.length; i++) {\r\n            asSearchAnd[i] = asSearchAnd[i].replace(/\\s/g, '');\r\n            console.log(`asSA spaces removed: |${asSearchAnd[i]}|`);\r\n        }\r\n        for (let i = 0; i < asSearchOr.length; i++) {\r\n            asSearchOr[i] = asSearchOr[i].replace(/\\s/g, '');\r\n            console.log(`asSO spaces removed: |${asSearchOr[i]}|`);\r\n        }\r\n        yield dbConn.queryDB(asSearchAnd, asSearchOr).then(function (aoFound) {\r\n            if (aoFound.length === undefined || aoFound.length <= 1) {\r\n                aoFound.length = 0;\r\n                aoFound.push({\r\n                    GivenName: \"None\",\r\n                    FamilyName: \"found\"\r\n                });\r\n                aoFound[0].howMany = 0;\r\n            }\r\n            else {\r\n                aoFound.length = aoFound.length - 1;\r\n            }\r\n            console.log(\"aoF length: \", aoFound.length);\r\n            for (let i = 0; i < aoFound.length; i++) {\r\n                aoFound[i].itemNum = i;\r\n            }\r\n            res.json({\r\n                aoFound\r\n            });\r\n        })\r\n            .catch(function (err) {\r\n            console.log(`queryDB error ${err}`);\r\n        });\r\n        return;\r\n    });\r\n});\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./server/routes/routes.ts?");

/***/ }),

/***/ "./server/server.ts":
/*!**************************!*\
  !*** ./server/server.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar express = __webpack_require__(/*! express */ \"express\");\r\nconst path = __webpack_require__(/*! path */ \"path\");\r\nconst serveStatic = __webpack_require__(/*! serve-static */ \"serve-static\");\r\nconst cors = __webpack_require__(/*! cors */ \"cors\");\r\nvar app = express();\r\nconst socketServer = __webpack_require__(/*! http */ \"http\").Server(app);\r\nconst ioApp = __webpack_require__(/*! socket.io */ \"socket.io\").listen(socketServer);\r\nconst routes = __webpack_require__(/*! ./routes/routes */ \"./server/routes/routes.ts\");\r\nconst dev = \"development\" !== 'production';\r\nconst port = process.env.PORT || 3300;\r\nconst ROOT_URL = dev ? `http://localhost:${port}` : `http://localhost:${port}`;\r\napp.use(cors());\r\napp.use(express.json());\r\nconst frontend = __dirname.replace(\"back\", \"front\");\r\napp.use(routes);\r\napp.get('*', function (req, res, next) {\r\n    console.log(\"app.get\", path.join(__dirname, req.params[0]));\r\n    res.sendFile(req.params[0], { root: frontend });\r\n    console.log(\"contacts sendFile done: \", path.join(frontend, req.params[0]));\r\n});\r\nconsole.log(\"app listening on port \", port);\r\napp.listen(port, (err) => {\r\n    if (err)\r\n        throw err;\r\n    console.log(`> Ready on ${ROOT_URL}`);\r\n});\r\nsocketServer.listen('9900', () => {\r\n    console.log('socket listening on port 9900');\r\n});\r\nioApp.on('connection', function (socket) {\r\n    console.log('a user connected');\r\n    socket.on('my other event', function (data) {\r\n        console.log(\"other event\", data);\r\n    });\r\n});\r\nmodule.exports.sendSomething = function (aoContacts) {\r\n    ioApp.emit('news', {\r\n        something: JSON.stringify(aoContacts)\r\n    });\r\n};\r\nmodule.exports.sendProgress = function (value) {\r\n    ioApp.emit('progress', {\r\n        progress: value\r\n    });\r\n};\r\nexports.default = app;\r\n\n\n//# sourceURL=webpack:///./server/server.ts?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongodb\");\n\n//# sourceURL=webpack:///external_%22mongodb%22?");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"multer\");\n\n//# sourceURL=webpack:///external_%22multer%22?");

/***/ }),

/***/ "papaparse":
/*!****************************!*\
  !*** external "papaparse" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"papaparse\");\n\n//# sourceURL=webpack:///external_%22papaparse%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "serve-static":
/*!*******************************!*\
  !*** external "serve-static" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"serve-static\");\n\n//# sourceURL=webpack:///external_%22serve-static%22?");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"socket.io\");\n\n//# sourceURL=webpack:///external_%22socket.io%22?");

/***/ })

/******/ });