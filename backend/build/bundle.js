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
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst MongoClient = __webpack_require__(/*! mongodb */ \"mongodb\").MongoClient;\r\nconst dbName = \"optimus\";\r\nlet dbOptimus;\r\nconst url = \"mongodb://localhost:53092\";\r\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\r\nconst assert = __webpack_require__(/*! assert */ \"assert\");\r\nlet oTempUser = { Email: 'rgb@test.com', Location: 'any', Hash: '' };\r\nlet iRcdCount;\r\nfunction connect() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"Connecting to database\");\r\n        const client = new MongoClient(url);\r\n        iRcdCount = 10;\r\n        try {\r\n            yield client.connect();\r\n            dbOptimus = client.db(dbName);\r\n            let res = yield dbOptimus.stats();\r\n            console.log(\"Connected to database: \", res);\r\n        }\r\n        catch (err) {\r\n            console.log(`Mongo connect error: ${err}`);\r\n        }\r\n        return;\r\n    });\r\n}\r\nexports.connect = connect;\r\nfunction updateRcds() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        if (iRcdCount > 0) {\r\n            oTempUser.Email = 'rgb' + (10 - iRcdCount).toString() + '@test.com';\r\n            let sHash = bcrypt.hashSync('123' + (10 - iRcdCount).toString(), 10);\r\n            yield updateSingleRcd(sHash);\r\n            iRcdCount--;\r\n        }\r\n    });\r\n}\r\nexports.updateRcds = updateRcds;\r\nfunction updateSingleRcd(sHash) {\r\n    return new Promise((resolve, reject) => {\r\n        let r = dbOptimus.collection(\"users\").updateOne({ 'Email': oTempUser.Email }, { $set: { 'Email': oTempUser.Email, 'Location': oTempUser.Location, 'Hash': sHash } }, { upsert: true }, updateOneCallback);\r\n        resolve();\r\n    });\r\n}\r\nfunction updateOneCallback() {\r\n    updateRcds();\r\n}\r\nmodule.exports.addPrice = function (oPriceInfo) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        return new Promise((resolve, reject) => {\r\n            let r = dbOptimus.collection(\"prices\").updateOne({ 'Date': oPriceInfo.Date, 'Location': oPriceInfo.Location }, { $set: { 'Date': oPriceInfo.Date, 'Location': oPriceInfo.Location, 'Price': oPriceInfo.Price } }, { upsert: true }, () => { });\r\n            resolve(oPriceInfo);\r\n        });\r\n    });\r\n};\r\nfunction deletePrice(sLocation, sDate) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        return yield dbOptimus.collection(\"prices\").deleteOne({ 'Location': sLocation, 'Date': sDate }, {});\r\n    });\r\n}\r\nexports.deletePrice = deletePrice;\r\nfunction clearDB() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        try {\r\n            yield dbOptimus.collection(\"optimus\").drop();\r\n            console.log(\"Database emptied\");\r\n        }\r\n        catch (error) {\r\n            console.log(\"Error emptying database:\", error);\r\n        }\r\n    });\r\n}\r\nexports.clearDB = clearDB;\r\nfunction clearUsers() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        try {\r\n            yield dbOptimus.collection(\"users\").drop();\r\n            console.log(\"users cleared\");\r\n        }\r\n        catch (error) {\r\n            console.log(\"Error clearing users:\", error);\r\n        }\r\n    });\r\n}\r\nexports.clearUsers = clearUsers;\r\nmodule.exports.checkLogin = function (sEmail, sPassword, fCallback) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        const cursor = yield dbOptimus.collection(\"users\")\r\n            .find({ 'Email': { $eq: sEmail } })\r\n            .project({\r\n            Email: 1,\r\n            Location: 1,\r\n            Hash: 1\r\n        })\r\n            .limit(1);\r\n        if ((yield cursor.count()) > 0) {\r\n            yield cursor.forEach(function (user) {\r\n                return __awaiter(this, void 0, void 0, function* () {\r\n                    console.log('user:', user);\r\n                    const err = bcrypt.compareSync(sPassword, user.Hash);\r\n                    console.log('bcrypt compare:', err);\r\n                    return (fCallback(err, user));\r\n                });\r\n            });\r\n        }\r\n        else {\r\n            return (fCallback(false, {}));\r\n        }\r\n    });\r\n};\r\nmodule.exports.addUser = function (oUser, sPassword) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        let sHash = bcrypt.hashSync(sPassword, 10);\r\n        console.log('password, hash:', sPassword, sHash);\r\n        return new Promise((resolve, reject) => {\r\n            let r = dbOptimus.collection(\"users\").updateOne({ 'Email': oUser.Email }, { $set: { 'Email': oUser.Email, 'Location': oUser.Location, 'Hash': sHash } }, { upsert: true }, () => { });\r\n            resolve(oUser);\r\n        });\r\n    });\r\n};\r\nmodule.exports.removeUser = function (sEmail) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        return yield dbOptimus.collection(\"users\").deleteOne({ 'Email': sEmail }, {});\r\n    });\r\n};\r\nmodule.exports.removePrice = function (sLocation, sDate) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        return yield dbOptimus.collection(\"prices\").deleteOne({ 'Location': sLocation, 'Date': sDate }, {});\r\n    });\r\n};\r\nmodule.exports.UpdateHash = function (sEmail, sPassword) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        let sHash = bcrypt.hashSync(sPassword, 10);\r\n        return new Promise((resolve, reject) => {\r\n            let r = dbOptimus.collection(\"users\").updateOne({ 'Email': sEmail }, { $set: { 'Hash': sHash } }, {}, () => { });\r\n            resolve(sEmail);\r\n        });\r\n        return;\r\n    });\r\n};\r\nmodule.exports.queryDB = function (sToFindFirst, sToFindSecond, sCollection) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        let oSearch;\r\n        let oToReturn;\r\n        let aoFound = [{}];\r\n        let iTruckNum = 0;\r\n        let oSearchLoc;\r\n        console.log(`sTFF: ${sToFindFirst}, sTFS: ${sToFindSecond}, sCollection: ${sCollection}`);\r\n        if (sCollection === 'trucks') {\r\n            iTruckNum = parseInt(sToFindFirst);\r\n            console.log('iTruckNum:', iTruckNum);\r\n            if (iTruckNum >= 0) {\r\n                if (sToFindSecond === 'any') {\r\n                    oSearch = { TruckNum: { $eq: iTruckNum } };\r\n                }\r\n                else {\r\n                    oSearch = { TruckNum: { $eq: iTruckNum }, Location: { $eq: sToFindSecond } };\r\n                }\r\n            }\r\n            else {\r\n                if (sToFindSecond === 'any') {\r\n                    oSearchLoc = {};\r\n                }\r\n                else {\r\n                    oSearchLoc = { Location: sToFindSecond };\r\n                    oSearch = { Location: sToFindSecond };\r\n                }\r\n            }\r\n            oToReturn = { TruckNum: 1, Tag: 1, DateTime: 1, Location: 1, Amount: 1 };\r\n        }\r\n        else if (sCollection === 'users') {\r\n            if (sToFindFirst === '') {\r\n                oSearch = {};\r\n            }\r\n            else {\r\n                oSearch = {\r\n                    Email: { $eq: sToFindFirst }\r\n                };\r\n            }\r\n            oToReturn = { Email: 1, Location: 1, sHash: 1 };\r\n            iTruckNum = 0;\r\n        }\r\n        else {\r\n            oSearch = { Location: { $eq: sToFindSecond } };\r\n            oToReturn = { Price: 1, Date: 1, Location: 1 };\r\n            iTruckNum = 0;\r\n        }\r\n        console.log('oSearch:', oSearch);\r\n        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {\r\n            if (iTruckNum >= 0 || iTruckNum === -2) {\r\n                let cursor = yield dbOptimus.collection(sCollection).find(oSearch).project(oToReturn);\r\n                let itemCount = 0;\r\n                yield cursor.each(function (err, item) {\r\n                    if (err) {\r\n                        console.log(\"Cursor error: \", err);\r\n                        throw (err);\r\n                    }\r\n                    if (item === null) {\r\n                        console.log(`Last item. ${aoFound.length} found.`);\r\n                        console.log(\"Found: \", aoFound);\r\n                        resolve(aoFound);\r\n                    }\r\n                    aoFound[itemCount++] = item;\r\n                    console.log(itemCount, \"itemCount\");\r\n                    return;\r\n                });\r\n                console.log(\"end of queryDB - found: \", aoFound.length);\r\n            }\r\n            else {\r\n                console.log(\"looking for distinct on \", oSearchLoc);\r\n                yield dbOptimus.collection(sCollection).distinct('TruckNum', oSearchLoc, (err, asTruckNums) => {\r\n                    console.log('err:', err);\r\n                    console.log('asTruckNums:', asTruckNums);\r\n                    resolve(asTruckNums);\r\n                });\r\n            }\r\n        }));\r\n    });\r\n};\r\nlet iRowsCBCount = 0;\r\nlet iRowsNBad = 0;\r\nlet iRowsResultBad = 0;\r\nmodule.exports.insertFuelRcd = function (iTruckNum, sTag, sLocation, dateTime, clicks) {\r\n    dbOptimus.collection(\"trucks\").updateOne({\r\n        'Location': sLocation,\r\n        'TruckNum': iTruckNum,\r\n        'DateTime': dateTime\r\n    }, {\r\n        $set: { 'Location': sLocation, 'TruckNum': iTruckNum, 'Tag': sTag, 'DateTime': dateTime, 'Amount': clicks }\r\n    }, {\r\n        upsert: true\r\n    }, insertRcdCallback);\r\n};\r\nfunction insertRcdCallback(err, res) {\r\n    if (err) {\r\n        console.log(\"iRC err: \", err.name, err.message);\r\n    }\r\n    else {\r\n        if (res.result.n !== 1) {\r\n            console.log(`nR != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);\r\n            iRowsNBad++;\r\n        }\r\n        if (res.result.ok !== 1) {\r\n            console.log(`ok != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);\r\n            iRowsResultBad++;\r\n        }\r\n        iRowsCBCount++;\r\n    }\r\n    return;\r\n}\r\n\n\n//# sourceURL=webpack:///./server/models/connection.ts?");

/***/ }),

/***/ "./server/models/database.ts":
/*!***********************************!*\
  !*** ./server/models/database.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst connFns = __webpack_require__(/*! ./connection */ \"./server/models/connection.ts\");\r\nvar fs = __webpack_require__(/*! fs */ \"fs\");\r\nvar path = __webpack_require__(/*! path */ \"path\");\r\nfunction connectFn() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        yield connFns.connect();\r\n        let promise = new Promise((resolve, reject) => {\r\n            setTimeout(() => resolve(\"done!\"), 2000);\r\n        });\r\n        let result = yield promise;\r\n    });\r\n}\r\nexports.connectFn = connectFn;\r\n;\r\nvar aasTags = [[]];\r\nfunction readFuelFiles() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"Reading fuel files\");\r\n        console.log(\"dir name: \", __dirname);\r\n        console.log(\"cwd: \", process.cwd());\r\n        let fdTags = fs.openSync(process.cwd() + '/tagstable.txt', 'a+');\r\n        console.log(\"fdTags: \", fdTags);\r\n        let sTagInfo = fs.readFileSync(fdTags, \"utf8\");\r\n        console.log(\"sTagInfo: \", sTagInfo);\r\n        let asTags = sTagInfo.split('\\r\\n');\r\n        console.log(\"asTags:\", asTags, asTags.length);\r\n        for (let i = 0; i < asTags.length; i++) {\r\n            if (asTags[i].length > 0) {\r\n                let aSplit = asTags[i].split(' ');\r\n                if (aSplit.length === 3) {\r\n                    aSplit[1] = aSplit[2];\r\n                }\r\n                console.log(\"aSplit:\", aSplit);\r\n                aasTags.push(aSplit);\r\n                console.log(\"aasTags[i]:\", aasTags[i]);\r\n            }\r\n        }\r\n        aasTags.shift();\r\n        let moveFrom = \"/home/rgbyford/fuelDC\";\r\n        let moveTo = \"/home/rgbyford/fuelDC/old\";\r\n        console.log(\"readdir next\");\r\n        fs.readdir(moveFrom, function (err, files) {\r\n            if (err) {\r\n                console.error(\"Could not list the directory.\", err);\r\n                process.exit(1);\r\n            }\r\n            files.forEach(function (file, index) {\r\n                let fromPath = path.join(moveFrom, file);\r\n                let toPath = path.join(moveTo, file);\r\n                fs.stat(fromPath, function (error, stat) {\r\n                    if (error) {\r\n                        console.error(\"Error stating file.\", error);\r\n                        return;\r\n                    }\r\n                    if (stat.isFile()) {\r\n                        console.log(\"'%s' is a file.\", fromPath);\r\n                        let fdFuel = fs.openSync(fromPath, \"a+\");\r\n                        let iTruckNum;\r\n                        let tag = file.split('.');\r\n                        tag = tag[0].split('_');\r\n                        iTruckNum = -1;\r\n                        for (let i = 0; i < aasTags.length; i++) {\r\n                            if (tag[0] === aasTags[i][0]) {\r\n                                iTruckNum = parseInt(aasTags[i][1]);\r\n                                console.log(\"truck num: \", iTruckNum);\r\n                                break;\r\n                            }\r\n                        }\r\n                        if (iTruckNum >= 0) {\r\n                            const sFuelInfo = fs.readFileSync(fdFuel, \"utf8\");\r\n                            if (sFuelInfo.length > 30) {\r\n                                console.log(\"sFuelInfo: \", sFuelInfo);\r\n                                let year = parseInt(sFuelInfo.substring(0, 4));\r\n                                let month = parseInt(sFuelInfo.substring(4, 6));\r\n                                let day = parseInt(sFuelInfo.substring(6, 8));\r\n                                let hour = parseInt(sFuelInfo.substring(8, 10));\r\n                                let minute = parseInt(sFuelInfo.substring(10, 12));\r\n                                let second = parseInt(sFuelInfo.substring(12, 14));\r\n                                let iClicks = parseInt(sFuelInfo.substring(39));\r\n                                let dRcdDate = new Date(year, month, day, hour, minute, second, 0);\r\n                                connFns.insertFuelRcd(iTruckNum, tag[0], 'DC', dRcdDate, iClicks);\r\n                            }\r\n                        }\r\n                        fs.closeSync(fdFuel);\r\n                        fs.rename(fromPath, toPath, function (error) {\r\n                            if (error) {\r\n                                console.error(\"File moving error:\", error);\r\n                            }\r\n                            else {\r\n                                console.log(\"Moved file '%s' to '%s'.\", fromPath, toPath);\r\n                            }\r\n                        });\r\n                    }\r\n                    else if (stat.isDirectory()) {\r\n                        console.log(\"'%s' is a directory.\", fromPath);\r\n                    }\r\n                });\r\n            });\r\n        });\r\n    });\r\n}\r\nexports.readFuelFiles = readFuelFiles;\r\n\n\n//# sourceURL=webpack:///./server/models/database.ts?");

/***/ }),

/***/ "./server/routes/routes.ts":
/*!*********************************!*\
  !*** ./server/routes/routes.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar express = __webpack_require__(/*! express */ \"express\");\r\nlet router = express.Router();\r\nconst dbConn = __webpack_require__(/*! ../models/connection */ \"./server/models/connection.ts\");\r\nvar userInfo;\r\nrouter.get('/login', function (req, res, next) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log('get /login');\r\n        userInfo = { Email: \"\", Location: \"\", Hash: \"\" };\r\n        let sSearch = req.url.split('?')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        let sParams = sSearch.split('q=');\r\n        sParams = sParams[1].split('&');\r\n        let sEmail = sParams[0];\r\n        let sPassword = sParams[1];\r\n        let sLocation = undefined;\r\n        let err;\r\n        if (sEmail && sPassword) {\r\n            console.log(\"User, password:\", sEmail, sPassword);\r\n            yield dbConn.checkLogin(sEmail, sPassword, function (bOK, user) {\r\n                if (bOK === false) {\r\n                    console.log(`Login failed: error ${bOK}, user |${user}|`);\r\n                    let err = new Error('Wrong email or password.');\r\n                    err.status = 401;\r\n                    return next(err);\r\n                }\r\n                else {\r\n                    console.log('Successful login - user: ', user);\r\n                    userInfo = user;\r\n                    console.log(\"Successful login - userInfo:\", userInfo);\r\n                    res.json(user);\r\n                }\r\n            });\r\n        }\r\n        else {\r\n            console.log('Returning error');\r\n            let err = new Error('All fields required.');\r\n            err.status = 400;\r\n            return next(err);\r\n        }\r\n    });\r\n});\r\nrouter.get('/newPassword', function (req, res, next) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log('new password');\r\n        let sSearch = req.url.split('?')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        let sParams = sSearch.split('q=');\r\n        sParams = sParams[1].split('&');\r\n        let sEmail = sParams[0];\r\n        let sNewPassword = sParams[1];\r\n        let sResult = yield dbConn.UpdateHash(sEmail, sNewPassword);\r\n        console.log('get new password - result', sResult);\r\n        res.json(sResult);\r\n        return;\r\n    });\r\n});\r\nrouter.get('/addUser', function (req, res, next) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        var oUser = { Email: \"\", Location: \"\", Hash: \"\" };\r\n        let sSearch = req.url.split('?')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        let sParams = sSearch.split('q=');\r\n        sParams = sParams[1].split('&');\r\n        oUser.Email = sParams[0];\r\n        oUser.Location = sParams[2];\r\n        let oResult = yield dbConn.addUser(oUser, sParams[1]);\r\n        console.log('get addUser - result', oResult);\r\n        res.json(oResult);\r\n        return;\r\n    });\r\n});\r\nrouter.get(\"/listUsers\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        yield dbConn.queryDB('', '', 'users').then(function (aoFound) {\r\n            if (aoFound.length === undefined || aoFound.length <= 1) {\r\n                aoFound.length = 0;\r\n                aoFound.push({\r\n                    TruckNum: \"None found\"\r\n                });\r\n                aoFound[0].howMany = 0;\r\n            }\r\n            else {\r\n                aoFound.length = aoFound.length - 1;\r\n            }\r\n            console.log(\"aoF length: \", aoFound.length);\r\n            for (let i = 0; i < aoFound.length; i++) {\r\n                aoFound[i].itemNum = i;\r\n            }\r\n            res.json({ aoFound });\r\n        })\r\n            .catch(function (err) {\r\n            console.log(`queryDB error ${err}`);\r\n        });\r\n        return;\r\n    });\r\n});\r\nrouter.get(\"/removeUser\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"remove user\");\r\n        console.log('req.url: ', req.url);\r\n        let sEmail = req.url.split('=')[1];\r\n        sEmail = decodeURIComponent(sEmail);\r\n        console.log('sEmail: ', sEmail);\r\n        let oResult = yield dbConn.removeUser(sEmail);\r\n        console.log(oResult);\r\n        res.json(oResult);\r\n        return;\r\n    });\r\n});\r\nrouter.get(\"/listPrices\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        let sLocation = req.url.split('=')[1];\r\n        sLocation = decodeURIComponent(sLocation);\r\n        console.log('sLocation: ', sLocation);\r\n        yield dbConn.queryDB('-1', sLocation, 'prices').then(function (aoFound) {\r\n            aoFound.length = aoFound.length - 1;\r\n            console.log(`Found ${aoFound.length} prices.`);\r\n            res.json({\r\n                aoFound\r\n            });\r\n        });\r\n        return;\r\n    });\r\n});\r\nrouter.get(\"/removePrice\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"remove price\");\r\n        let sSearch = req.url.split('?')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        let sParams = sSearch.split('q=');\r\n        sParams = sParams[1].split('&');\r\n        let sLocation = sParams[0];\r\n        let sDate = sParams[1];\r\n        console.log('Removing price:', sLocation, sDate);\r\n        let oRes = yield dbConn.removePrice(sLocation, sDate);\r\n        res.json(oRes.result);\r\n        return;\r\n    });\r\n});\r\nrouter.get('/addPrice', function (req, res, next) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        var oPriceInfo = { Location: \"\", Price: 0, Date: \"\" };\r\n        let sSearch = req.url.split('?')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        let sParams = sSearch.split('q=');\r\n        sParams = sParams[1].split('&');\r\n        oPriceInfo.Location = sParams[0];\r\n        oPriceInfo.Price = parseFloat(sParams[1]);\r\n        oPriceInfo.Date = sParams[2];\r\n        let oResult = yield dbConn.addPrice(oPriceInfo);\r\n        console.log('get addPrice - result', oResult);\r\n        res.json(oResult);\r\n        return;\r\n    });\r\n});\r\nrouter.get(\"/listTrucks\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        let sLocation = req.url.split('=')[1];\r\n        sLocation = decodeURIComponent(sLocation);\r\n        console.log('sLocation: ', sLocation);\r\n        yield dbConn.queryDB('-1', sLocation, 'trucks').then(function (aoFound) {\r\n            console.log(`Found ${aoFound.length} trucks.`);\r\n            res.json({\r\n                aoFound\r\n            });\r\n        });\r\n    });\r\n});\r\nrouter.get(\"/listUsers\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"user list\");\r\n        yield dbConn.queryDB('-1', \"\", 'users').then(function (aoFound) {\r\n            console.log(`Found ${aoFound.length} users.`);\r\n            res.json({\r\n                aoFound\r\n            });\r\n        });\r\n    });\r\n});\r\nrouter.get(\"/truck\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"get truck data\");\r\n        console.log('req.url: ', req.url);\r\n        let sSearch = req.url.split('=')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        console.log('sSearch: ', sSearch);\r\n        yield dbConn.queryDB(sSearch, 'any', 'trucks').then(function (aoFound) {\r\n            if (aoFound.length === undefined || aoFound.length <= 1) {\r\n                aoFound.length = 0;\r\n                aoFound.push({\r\n                    TruckNum: \"None found\"\r\n                });\r\n                aoFound[0].howMany = 0;\r\n            }\r\n            else {\r\n                aoFound.length = aoFound.length - 1;\r\n            }\r\n            console.log(\"aoF length: \", aoFound.length);\r\n            for (let i = 0; i < aoFound.length; i++) {\r\n                aoFound[i].itemNum = i;\r\n            }\r\n            res.json({ aoFound });\r\n        })\r\n            .catch(function (err) {\r\n            console.log(`queryDB error ${err}`);\r\n        });\r\n        return;\r\n    });\r\n});\r\nrouter.get(\"/fuel\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"get fueling data\");\r\n        console.log('req.url: ', req.url);\r\n        let sSearch = req.url.split('=')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        console.log('sSearch: ', sSearch);\r\n        yield dbConn.queryDB('-2', sSearch, 'trucks').then(function (aoFound) {\r\n            aoFound.length = aoFound.length - 1;\r\n            console.log(\"aoF length: \", aoFound.length);\r\n            for (let i = 0; i < aoFound.length; i++) {\r\n                aoFound[i].itemNum = i;\r\n            }\r\n            res.json({ aoFound });\r\n        })\r\n            .catch(function (err) {\r\n            console.log(`queryDB error ${err}`);\r\n        });\r\n        return;\r\n    });\r\n});\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./server/routes/routes.ts?");

/***/ }),

/***/ "./server/server.ts":
/*!**************************!*\
  !*** ./server/server.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst database_1 = __webpack_require__(/*! ./models/database */ \"./server/models/database.ts\");\r\nvar express = __webpack_require__(/*! express */ \"express\");\r\nconst path = __webpack_require__(/*! path */ \"path\");\r\nconst cors = __webpack_require__(/*! cors */ \"cors\");\r\nvar parseUrl = __webpack_require__(/*! parseurl */ \"parseurl\");\r\nvar resolvePath = __webpack_require__(/*! resolve-path */ \"resolve-path\");\r\nlet dbFns = __webpack_require__(/*! ./models/database */ \"./server/models/database.ts\");\r\nlet schedule = __webpack_require__(/*! node-schedule */ \"node-schedule\");\r\nconst dev = false;\r\nconst port = 3300;\r\nconst socketPort = process.env.SOCKET || 9901;\r\nvar app = __webpack_require__(/*! express */ \"express\")();\r\nvar http = __webpack_require__(/*! http */ \"http\").Server(app);\r\nconsole.log(\"Socket port: \", socketPort);\r\nconst routes = __webpack_require__(/*! ./routes/routes */ \"./server/routes/routes.ts\");\r\nvar session = __webpack_require__(/*! express-session */ \"express-session\");\r\nfunction connectToDB() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        yield dbFns.connectFn();\r\n    });\r\n}\r\nconnectToDB();\r\napp.all('*', function (req, res, next) {\r\n    console.log('rp[0]', req.params[0]);\r\n    console.log('path: ', req.path);\r\n    next();\r\n});\r\napp.use(routes);\r\napp.use(cors());\r\napp.use(express.json());\r\napp.use(function (req, res, next) {\r\n    res.setHeader('Access-Control-Allow-Origin', '*');\r\n    res.header(\"Access-Control-Allow-Origin\", \"*\");\r\n    res.header(\"Access-Control-Allow-Headers\", \"Origin, X-Requested-With, Content-Type, Accept\");\r\n    next();\r\n});\r\nconsole.log(\"__dirname: \", __dirname);\r\nlet frontend = __dirname.replace(\"back\", \"front\");\r\nfrontend = frontend.replace(\"/build/server\", \"\");\r\nconsole.log(\"frontend: \", frontend);\r\napp.use(express.static(frontend));\r\nhttp.listen(port, (err) => {\r\n    if (err)\r\n        throw err;\r\n    console.log(\"> Ready on\", port);\r\n});\r\napp.get('/', function (req, res, next) {\r\n    var pathname = decodeURIComponent(parseUrl(req).pathname);\r\n    var filename = pathname.substr(1);\r\n    var fullpath = resolvePath(frontend, filename);\r\n    console.log('pathname: ', pathname);\r\n    console.log('filename: ', filename);\r\n    console.log('fullpath: ', fullpath);\r\n    console.log('r.p[0]: ', req.params[0]);\r\n    console.log('frontend: ', frontend);\r\n    res.sendFile(req.params[0], { root: frontend });\r\n    console.log(\"contacts sendFile done: \", req.params[0]);\r\n});\r\nvar rule = new schedule.RecurrenceRule();\r\nrule.hour = 5;\r\nrule.dayOfWeek = new schedule.Range(0, 6);\r\nvar j = schedule.scheduleJob(rule, function () {\r\n    database_1.readFuelFiles();\r\n    console.log('Read fuel files');\r\n});\r\nvar ioApp = __webpack_require__(/*! socket.io */ \"socket.io\")(http);\r\nioApp.on('connection', function (socket) {\r\n    console.log('a user connected');\r\n    socket.on('my other event', function (data) {\r\n        console.log(\"other event\", data);\r\n    });\r\n});\r\nconsole.log(\"app listening on port \", port);\r\nconsole.log(\"express.static: \", frontend);\r\nmodule.exports.sendSomething = function (aoContacts) {\r\n    ioApp.emit('news', {\r\n        something: JSON.stringify(aoContacts)\r\n    });\r\n};\r\nmodule.exports.sendProgress = function (value) {\r\n    ioApp.emit('progress', {\r\n        progress: value\r\n    });\r\n};\r\nexports.default = app;\r\n\n\n//# sourceURL=webpack:///./server/server.ts?");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"assert\");\n\n//# sourceURL=webpack:///external_%22assert%22?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bcrypt\");\n\n//# sourceURL=webpack:///external_%22bcrypt%22?");

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

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-session\");\n\n//# sourceURL=webpack:///external_%22express-session%22?");

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

/***/ "node-schedule":
/*!********************************!*\
  !*** external "node-schedule" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-schedule\");\n\n//# sourceURL=webpack:///external_%22node-schedule%22?");

/***/ }),

/***/ "parseurl":
/*!***************************!*\
  !*** external "parseurl" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"parseurl\");\n\n//# sourceURL=webpack:///external_%22parseurl%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "resolve-path":
/*!*******************************!*\
  !*** external "resolve-path" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"resolve-path\");\n\n//# sourceURL=webpack:///external_%22resolve-path%22?");

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