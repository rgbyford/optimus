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
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst MongoClient = __webpack_require__(/*! mongodb */ \"mongodb\");\r\nconst dbName = \"optimus\";\r\nlet dbOptimus;\r\nconst url = \"mongodb://localhost:27017\";\r\nfunction connect() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"Connecting to database\");\r\n        MongoClient.connect(url, function (err, client) {\r\n            return __awaiter(this, void 0, void 0, function* () {\r\n                if (err) {\r\n                    throw err;\r\n                }\r\n                dbOptimus = yield client.db(dbName);\r\n                dbOptimus.stats().then(function (res) {\r\n                    console.log(\"Connected to database: \", res);\r\n                    return;\r\n                }).catch(function (err) {\r\n                    console.log(`Mongo connect error: ${err}`);\r\n                    return;\r\n                });\r\n            });\r\n        });\r\n    });\r\n}\r\nexports.connect = connect;\r\nfunction clearDB() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        try {\r\n            yield dbOptimus.collection(\"optimus\").drop();\r\n            console.log(\"Database emptied\");\r\n        }\r\n        catch (error) {\r\n            console.log(\"Error emptying database:\", error);\r\n        }\r\n    });\r\n}\r\nexports.clearDB = clearDB;\r\nmodule.exports.queryDB = function (sTruckNum) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        let iTruckNum = parseInt(sTruckNum);\r\n        let aoFound = [{}];\r\n        let oSearch = {\r\n            TruckNum: { $eq: iTruckNum }\r\n        };\r\n        console.log('oSearch:', oSearch);\r\n        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {\r\n            const cursor = dbOptimus.collection(\"optimus\").find(oSearch)\r\n                .project({\r\n                TruckNum: 1,\r\n                DateTime: 1,\r\n                Amount: 1\r\n            });\r\n            let itemCount = 0;\r\n            yield cursor.each(function (err, item) {\r\n                if (err) {\r\n                    console.log(\"Cursor error: \", err);\r\n                    throw (err);\r\n                }\r\n                if (item === null) {\r\n                    console.log(`Last item. ${aoFound.length} found.`);\r\n                    console.log(\"Found: \", aoFound);\r\n                    resolve(aoFound);\r\n                }\r\n                aoFound[itemCount++] = item;\r\n                console.log(itemCount, \"itemCount\");\r\n                return;\r\n            });\r\n            console.log(\"end of queryDB - found: \", aoFound.length);\r\n        }));\r\n    });\r\n};\r\nlet iRowsNBad = 0;\r\nlet iRowsCBCount = 0;\r\nlet iRowsResultBad = 0;\r\nfunction insertRcdCallback(err, res) {\r\n    if (err) {\r\n        console.log(\"iRC err: \", err.name, err.message);\r\n    }\r\n    else {\r\n        if (res.result.n !== 1) {\r\n            console.log(`nR != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);\r\n            iRowsNBad++;\r\n        }\r\n        if (res.result.ok !== 1) {\r\n            console.log(`ok != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);\r\n            iRowsResultBad++;\r\n        }\r\n        iRowsCBCount++;\r\n    }\r\n    return;\r\n}\r\nmodule.exports.insertFuelRcd = function (iTruckNum, dateTime, clicks) {\r\n    dbOptimus.collection(\"optimus\").updateOne({\r\n        'Location': 'DC',\r\n        'TruckNum': iTruckNum,\r\n        'DateTime': dateTime\r\n    }, {\r\n        $set: { 'Location': 'DC', 'TruckNum': iTruckNum, 'DateTime': dateTime, 'Amount': clicks }\r\n    }, {\r\n        upsert: true\r\n    }, insertRcdCallback);\r\n};\r\n\n\n//# sourceURL=webpack:///./server/models/connection.ts?");

/***/ }),

/***/ "./server/models/database.ts":
/*!***********************************!*\
  !*** ./server/models/database.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst connFns = __webpack_require__(/*! ./connection */ \"./server/models/connection.ts\");\r\nvar fs = __webpack_require__(/*! fs */ \"fs\");\r\nvar path = __webpack_require__(/*! path */ \"path\");\r\nfunction connectFn() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        yield connFns.connect();\r\n        let promise = new Promise((resolve, reject) => {\r\n            setTimeout(() => resolve(\"done!\"), 2000);\r\n        });\r\n        let result = yield promise;\r\n        readFuelFiles();\r\n    });\r\n}\r\nexports.connectFn = connectFn;\r\n;\r\nvar aasTags = [[]];\r\nfunction readFuelFiles() {\r\n    console.log(\"Reading fuel files\");\r\n    console.log(\"dir name: \", __dirname);\r\n    console.log(\"cwd: \", process.cwd());\r\n    let fdTags = fs.openSync(process.cwd() + '/tagstable.txt', 'a+');\r\n    console.log(\"fdTags: \", fdTags);\r\n    let sTagInfo = fs.readFileSync(fdTags, \"utf8\");\r\n    console.log(\"sTagInfo: \", sTagInfo);\r\n    let asTags = sTagInfo.split('\\r\\n');\r\n    console.log(\"asTags:\", asTags, asTags.length);\r\n    for (let i = 0; i < asTags.length; i++) {\r\n        if (asTags[i].length > 0) {\r\n            let aSplit = asTags[i].split(' ');\r\n            if (aSplit.length === 3) {\r\n                aSplit[1] = aSplit[2];\r\n            }\r\n            console.log(\"aSplit:\", aSplit);\r\n            aasTags.push(aSplit);\r\n            console.log(\"aasTags[i]:\", aasTags[i]);\r\n        }\r\n    }\r\n    aasTags.shift();\r\n    let moveFrom = \"/home/rgbyford/fuelDC\";\r\n    let moveTo = \"/home/rgbyford/fuelDC/old\";\r\n    console.log(\"readdir next\");\r\n    fs.readdir(moveFrom, function (err, files) {\r\n        if (err) {\r\n            console.error(\"Could not list the directory.\", err);\r\n            process.exit(1);\r\n        }\r\n        files.forEach(function (file, index) {\r\n            let fromPath = path.join(moveFrom, file);\r\n            let toPath = path.join(moveTo, file);\r\n            fs.stat(fromPath, function (error, stat) {\r\n                if (error) {\r\n                    console.error(\"Error stating file.\", error);\r\n                    return;\r\n                }\r\n                if (stat.isFile()) {\r\n                    console.log(\"'%s' is a file.\", fromPath);\r\n                    let fdFuel = fs.openSync(fromPath, \"a+\");\r\n                    let iTruckNum;\r\n                    let tag = file.split('.');\r\n                    tag = tag[0].split('_');\r\n                    iTruckNum = -1;\r\n                    for (let i = 0; i < aasTags.length; i++) {\r\n                        if (tag[0] === aasTags[i][0]) {\r\n                            iTruckNum = parseInt(aasTags[i][1]);\r\n                            console.log(\"truck num: \", iTruckNum);\r\n                            break;\r\n                        }\r\n                    }\r\n                    if (iTruckNum >= 0) {\r\n                        const sFuelInfo = fs.readFileSync(fdFuel, \"utf8\");\r\n                        if (sFuelInfo.length > 30) {\r\n                            console.log(\"sFuelInfo: \", sFuelInfo);\r\n                            let year = parseInt(sFuelInfo.substring(0, 4));\r\n                            let month = parseInt(sFuelInfo.substring(4, 6));\r\n                            let day = parseInt(sFuelInfo.substring(6, 8));\r\n                            let hour = parseInt(sFuelInfo.substring(8, 10));\r\n                            let minute = parseInt(sFuelInfo.substring(10, 12));\r\n                            let second = parseInt(sFuelInfo.substring(12, 14));\r\n                            let iClicks = parseInt(sFuelInfo.substring(39));\r\n                            let dRcdDate = new Date(year, month, day, hour, minute, second, 0);\r\n                            connFns.insertFuelRcd(iTruckNum, dRcdDate, iClicks);\r\n                        }\r\n                    }\r\n                    fs.closeSync(fdFuel);\r\n                    fs.rename(fromPath, toPath, function (error) {\r\n                        if (error) {\r\n                            console.error(\"File moving error:\", error);\r\n                        }\r\n                        else {\r\n                            console.log(\"Moved file '%s' to '%s'.\", fromPath, toPath);\r\n                        }\r\n                    });\r\n                }\r\n                else if (stat.isDirectory()) {\r\n                    console.log(\"'%s' is a directory.\", fromPath);\r\n                }\r\n            });\r\n        });\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack:///./server/models/database.ts?");

/***/ }),

/***/ "./server/routes/routes.ts":
/*!*********************************!*\
  !*** ./server/routes/routes.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar express = __webpack_require__(/*! express */ \"express\");\r\nlet router = express.Router();\r\nconst dbFunctions = __webpack_require__(/*! ../models/database */ \"./server/models/database.ts\");\r\nconst dbConn = __webpack_require__(/*! ../models/connection */ \"./server/models/connection.ts\");\r\nlet aoCats = [{}];\r\nrouter.get('/categories', (req, res) => __awaiter(this, void 0, void 0, function* () {\r\n    console.log(\"server get cats\");\r\n    console.log(\"cwd:\", process.cwd());\r\n    try {\r\n        aoCats = dbFunctions.readCatsFile();\r\n        res.json({\r\n            aoCats\r\n        });\r\n    }\r\n    catch (err) {\r\n        console.log(\"categories fetch error\");\r\n        res.json({\r\n            error: err.message || err.toString()\r\n        });\r\n    }\r\n}));\r\nrouter.get('/loadDate', (req, res) => __awaiter(this, void 0, void 0, function* () {\r\n    console.log(\"get load date\");\r\n    const date = dbFunctions.readDateFile();\r\n    res.json(date);\r\n}));\r\nrouter.get(\"/truck\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"get truck data\");\r\n        console.log('req.url: ', req.url);\r\n        let sSearch = req.url.split('=')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        console.log('sSearch: ', sSearch);\r\n        yield dbConn.queryDB(sSearch).then(function (aoFound) {\r\n            if (aoFound.length === undefined || aoFound.length <= 1) {\r\n                aoFound.length = 0;\r\n                aoFound.push({\r\n                    TruckNum: \"None found\"\r\n                });\r\n                aoFound[0].howMany = 0;\r\n            }\r\n            else {\r\n                aoFound.length = aoFound.length - 1;\r\n            }\r\n            console.log(\"aoF length: \", aoFound.length);\r\n            for (let i = 0; i < aoFound.length; i++) {\r\n                aoFound[i].itemNum = i;\r\n            }\r\n            res.json({\r\n                aoFound\r\n            });\r\n        })\r\n            .catch(function (err) {\r\n            console.log(`queryDB error ${err}`);\r\n        });\r\n        return;\r\n    });\r\n});\r\nrouter.get(\"/contacts\", function (req, res) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(\"get contacts\");\r\n        let asSearchAnd = [];\r\n        let asSearchOr = [];\r\n        console.log('req.url: ', req.url);\r\n        let sSearch = req.url.split('=')[1];\r\n        sSearch = decodeURIComponent(sSearch);\r\n        console.log('sSearch: ', sSearch);\r\n        let asSearches = sSearch.split('@');\r\n        console.log('asSearches: ', asSearches);\r\n        for (let i = 0; i < asSearches.length; i++) {\r\n            let sFind = asSearches[i];\r\n            sFind = sFind.replace(/\\ OR\\ /, '|');\r\n            console.log(\"sFind: \", sFind);\r\n            sFind = sFind.trim();\r\n            let asFinds = sFind.split(\"_\");\r\n            if (asFinds.length > 1) {\r\n                asFinds.forEach((sCat) => {\r\n                    let asFindBars = sCat.split(\"|\");\r\n                    if (asFindBars.length > 1) {\r\n                        asFindBars.forEach((sCatOr) => {\r\n                            asSearchOr.push(sCatOr);\r\n                        });\r\n                    }\r\n                    else {\r\n                        if (sCat !== \"any\") {\r\n                            asSearchAnd.push(sCat);\r\n                        }\r\n                    }\r\n                });\r\n            }\r\n            else {\r\n                if (asFinds[0].length) {\r\n                    asSearchAnd.push(asFinds[0]);\r\n                }\r\n            }\r\n        }\r\n        for (let i = 0; i < asSearchAnd.length; i++) {\r\n            asSearchAnd[i] = asSearchAnd[i].replace(/\\s/g, '');\r\n            console.log(`asSA spaces removed: |${asSearchAnd[i]}|`);\r\n        }\r\n        for (let i = 0; i < asSearchOr.length; i++) {\r\n            asSearchOr[i] = asSearchOr[i].replace(/\\s/g, '');\r\n            console.log(`asSO spaces removed: |${asSearchOr[i]}|`);\r\n        }\r\n        yield dbConn.queryDB(asSearchAnd, asSearchOr).then(function (aoFound) {\r\n            if (aoFound.length === undefined || aoFound.length <= 1) {\r\n                aoFound.length = 0;\r\n                aoFound.push({\r\n                    GivenName: \"None\",\r\n                    FamilyName: \"found\"\r\n                });\r\n                aoFound[0].howMany = 0;\r\n            }\r\n            else {\r\n                aoFound.length = aoFound.length - 1;\r\n            }\r\n            console.log(\"aoF length: \", aoFound.length);\r\n            for (let i = 0; i < aoFound.length; i++) {\r\n                aoFound[i].itemNum = i;\r\n            }\r\n            res.json({\r\n                aoFound\r\n            });\r\n        })\r\n            .catch(function (err) {\r\n            console.log(`queryDB error ${err}`);\r\n        });\r\n        return;\r\n    });\r\n});\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./server/routes/routes.ts?");

/***/ }),

/***/ "./server/server.ts":
/*!**************************!*\
  !*** ./server/server.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar express = __webpack_require__(/*! express */ \"express\");\r\nconst path = __webpack_require__(/*! path */ \"path\");\r\nconst cors = __webpack_require__(/*! cors */ \"cors\");\r\nvar parseUrl = __webpack_require__(/*! parseurl */ \"parseurl\");\r\nvar resolvePath = __webpack_require__(/*! resolve-path */ \"resolve-path\");\r\nlet dbFns = __webpack_require__(/*! ./models/database */ \"./server/models/database.ts\");\r\nconst dev = false;\r\nconst port = 3300;\r\nconst socketPort = process.env.SOCKET || 9901;\r\nvar app = __webpack_require__(/*! express */ \"express\")();\r\nvar http = __webpack_require__(/*! http */ \"http\").Server(app);\r\nconsole.log(\"Socket port: \", socketPort);\r\nconst routes = __webpack_require__(/*! ./routes/routes */ \"./server/routes/routes.ts\");\r\ndbFns.connectFn();\r\napp.all('*', function (req, res, next) {\r\n    console.log('rp[0]', req.params[0]);\r\n    console.log('path: ', req.path);\r\n    next();\r\n});\r\napp.use(cors());\r\napp.use(express.json());\r\napp.use(function (req, res, next) {\r\n    res.setHeader('Access-Control-Allow-Origin', '*');\r\n    res.header(\"Access-Control-Allow-Origin\", \"*\");\r\n    res.header(\"Access-Control-Allow-Headers\", \"Origin, X-Requested-With, Content-Type, Accept\");\r\n    next();\r\n});\r\nconsole.log(\"__dirname: \", __dirname);\r\nlet frontend = __dirname.replace(\"back\", \"front\");\r\nfrontend = frontend.replace(\"/build/server\", \"\");\r\nconsole.log(\"frontend: \", frontend);\r\napp.use(express.static(frontend));\r\napp.use(routes);\r\nhttp.listen(port, (err) => {\r\n    if (err)\r\n        throw err;\r\n    console.log(\"> Ready on\", port);\r\n});\r\napp.get('/', function (req, res, next) {\r\n    var pathname = decodeURIComponent(parseUrl(req).pathname);\r\n    var filename = pathname.substr(1);\r\n    var fullpath = resolvePath(frontend, filename);\r\n    console.log('pathname: ', pathname);\r\n    console.log('filename: ', filename);\r\n    console.log('fullpath: ', fullpath);\r\n    console.log('r.p[0]: ', req.params[0]);\r\n    console.log('frontend: ', frontend);\r\n    res.sendFile(req.params[0], { root: frontend });\r\n    console.log(\"contacts sendFile done: \", req.params[0]);\r\n});\r\nvar ioApp = __webpack_require__(/*! socket.io */ \"socket.io\")(http);\r\nioApp.on('connection', function (socket) {\r\n    console.log('a user connected');\r\n    socket.on('my other event', function (data) {\r\n        console.log(\"other event\", data);\r\n    });\r\n});\r\nconsole.log(\"app listening on port \", port);\r\nconsole.log(\"express.static: \", frontend);\r\nmodule.exports.sendSomething = function (aoContacts) {\r\n    ioApp.emit('news', {\r\n        something: JSON.stringify(aoContacts)\r\n    });\r\n};\r\nmodule.exports.sendProgress = function (value) {\r\n    ioApp.emit('progress', {\r\n        progress: value\r\n    });\r\n};\r\nexports.default = app;\r\n\n\n//# sourceURL=webpack:///./server/server.ts?");

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