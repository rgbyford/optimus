const connFns = require("./connection");
const serverFns = require('../server');
let iBadOnes = 0;
let iRows = 0;
let aoContacts = [];
let aasTagsMain = [
    ['1', '1'],
    ['event', 'event'],
    ['los', 'los'],
    ['mashable', 'mashable'],
    ['PP', 'PP'],
    ['seven-horizons', 'seven-horizons'],
    ['via-ace', 'via-ace'],
    ['x', 'x'],
    ['pp', 'Prodigium'],
    ['coc', 'Cinema of Change'],
    ['dis', 'dis'],
    ['ethn', 'ethnicity'],
    ['gend', 'gender'],
    ['intellectual', 'intellectual'],
    ['id', 'ideology'],
    ['lang', 'language spoken'],
    ['loc', 'location'],
    ['net', 'shared network'],
    ['team', 'Prodigium worker'],
    ['research', 'researcher'],
    ['sport', 'sports pro'],
    ['queer', 'neither']
];
let aoTagNames = [];
for (let i = 0; i < aasTagsMain.length; i++) {
    aoTagNames.push({
        'sShortName': aasTagsMain[i][0],
        'sLongName': aasTagsMain[i][1]
    });
}
class AoCats {
    constructor(sCat, sSubCat) {
        this.sIsSubCatOf = sCat;
        this.sThisCat = sSubCat;
    }
}
let aoCatsRead;
const fsDB = require("fs");
let fdCats;
function indexOfByKey(obj_list, key, value) {
    for (let index = 0; index < obj_list.length; index++) {
        if (obj_list[index][key] === value)
            return index;
    }
    return -1;
}
module.exports.writeDateFile = function () {
    const fdDate = fsDB.openSync('loaddate.txt', 'w');
    let dDate = new Date();
    let sDate;
    console.log('sDate1: ', dDate);
    sDate = dDate.toString().slice(4, 15);
    console.log("sDate2:", sDate);
    fsDB.writeFileSync(fdDate, sDate);
    fsDB.closeSync(fdDate);
};
module.exports.readDateFile = function () {
    const fdDate = fsDB.openSync('loaddate.txt', 'r');
    const sDate = fsDB.readFileSync(fdDate, "utf8");
    fsDB.closeSync(fdDate);
    return (sDate);
};
function openCatsFile(mode) {
    console.log("cwd:", process.cwd());
    fdCats = fsDB.openSync("categories.txt", mode);
}
function writeCatsFile(aoCats) {
    openCatsFile("w");
    fsDB.writeFileSync(fdCats, JSON.stringify(aoCats));
    fsDB.closeSync(fdCats);
}
module.exports.deleteCatsFile = function () {
    fsDB.unlinkSync('categories.txt', (err) => {
        if (err)
            throw err;
        console.log('categories file deleted');
    });
};
module.exports.writeFile = function () {
    console.log("wCF: ", aoCatsRead.length);
    console.log("Bad tags: ", iBadOnes);
    aoCatsRead.sort((a, b) => (a.sThisCat > b.sThisCat) ? 1 : (b.sThisCat > a.sThisCat) ? -1 : 0);
    writeCatsFile(aoCatsRead);
    iBadOnes = 0;
};
module.exports.readCatsFile = function () {
    openCatsFile("a+");
    console.log("readCatsFile: ", fdCats);
    const sCats = fsDB.readFileSync(fdCats, "utf8");
    if (sCats.length) {
        aoCatsRead = JSON.parse(sCats);
    }
    else {
        aoCatsRead = [];
    }
    fsDB.closeSync(fdCats);
    return (aoCatsRead);
};
let contactsSource;
module.exports.clearContacts = function (source) {
    contactsSource = source;
    aoContacts.length = 0;
    connFns.prepLoad();
};
module.exports.pushContact = function (oContact) {
    aoContacts.push(oContact);
};
var arrayUnique = function (arr) {
    return arr.filter(function (item, index) {
        return arr.indexOf(item) >= index;
    });
};
function buildCategories(asTag) {
    for (let i = 0; i < asTag.length; i++) {
        if (asTag[i][0] !== ".") {
            iBadOnes++;
            continue;
        }
        asTag[i] = asTag[i].slice(1);
        asTag[i] = asTag[i].replace("..", "_");
        asTag[i] = asTag[i].replace("vendors", "vendor");
        asTag[i] = asTag[i].replace(/\./g, "_");
        let asCatSub = asTag[i].split("_");
        let iTagPos = indexOfByKey(aoTagNames, 'sShortName', asCatSub[0]);
        if (iTagPos >= 0) {
            asCatSub[0] = aoTagNames[iTagPos].sLongName;
        }
        let sIsSubCatOf = "";
        for (let j = 0; j < asCatSub.length; j++) {
            let iCatFound;
            iCatFound = aoCatsRead.findIndex(function (element) {
                return (element.sThisCat === asCatSub[j]);
            });
            if (iCatFound < 0) {
                aoCatsRead.push(new AoCats(sIsSubCatOf, asCatSub[j]));
            }
            sIsSubCatOf = asCatSub[j];
        }
    }
}
let iTotalRows;
let iPercent = 0;
module.exports.importNames = function (iCount = 0) {
    if (iCount > 0) {
        iTotalRows = iCount;
        iPercent = 0;
    }
    if (aoContacts.length === 0) {
        console.log(`Import names done - ${iTotalRows} rows`);
        return;
    }
    var oContact = {};
    oContact.id = 0;
    const nestedContent = aoContacts[0];
    Object.keys(nestedContent).forEach(docTitle => {
        let givenName;
        let sPropName;
        sPropName = docTitle.replace(/ /g, "");
        if (sPropName === "GivenName") {
            givenName = nestedContent[docTitle];
            oContact.GivenName = givenName;
        }
        else if (sPropName === "FamilyName") {
            oContact.FamilyName = nestedContent[docTitle];
        }
        else if (sPropName === "GroupMembership") {
            let asFirstSplit;
            let asSecondSplit = [];
            let sValue = nestedContent[docTitle];
            asFirstSplit = sValue.split(contactsSource === 'CSV' ? ' ::: ' : ',');
            for (let i = 0; i < asFirstSplit.length; i++) {
                let sTemp;
                if (asFirstSplit[i].indexOf(".loc_U") < 0) {
                    sTemp = asFirstSplit[i].replace(".loc", "intl");
                }
                else {
                    sTemp = asFirstSplit[i];
                }
                if (sTemp[0] === '.') {
                    sTemp = sTemp.slice(1);
                }
                asSecondSplit = asSecondSplit.concat(sTemp.split("_"));
                for (let j = 0; j < asSecondSplit.length; j++) {
                    let iTagPos = indexOfByKey(aoTagNames, 'sShortName', asSecondSplit[j]);
                    if (iTagPos >= 0) {
                        asSecondSplit[j] = aoTagNames[iTagPos].sLongName;
                    }
                }
            }
            buildCategories(asFirstSplit);
            oContact[sPropName] = arrayUnique(asSecondSplit);
        }
        else {
            let value = nestedContent[docTitle];
            value = value.toString().replace(/[%,]/g, "");
            if (nestedContent[docTitle] !== "") {
                oContact[sPropName] = value;
            }
        }
    });
    aoContacts.shift();
    connFns.insertContact(oContact, aoContacts.length === 0);
    if (iRows++ > iTotalRows / 50) {
        iPercent += 2;
        serverFns.sendProgress(iPercent.toString());
        iRows = 0;
    }
    return;
};
//# sourceMappingURL=database.js.map