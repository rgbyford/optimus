let dbContent = require("./database");
const fsV = require('fs');
module.exports.vcfJson = function (file) {
    let iTels = 1;
    let iEmails = 1;
    let iPhotos = 1;
    let iOrgs = 1;
    let iTitles = 1;
    let iURLs = 1;
    let iAdrs = 1;
    let asFirst = [];
    let asSecond = [];
    let oContact = {};
    let asLines = [];
    let i;
    let iCards = 0;
    console.log("vcfJson");
    dbContent.clearContacts('VCF');
    dbContent.readCatsFile();
    let fd = fsV.openSync("./uploads/" + file, 'r+');
    var content = fsV.readFileSync(fd, "utf8");
    asLines = content.split('\r\n');
    console.log('length: ', asLines.length);
    for (i = 0; i < asLines.length - 1; i++) {
        if (asLines[i].length < 2) {
            continue;
        }
        let j = i;
        while (asLines[i + 1][0] === ' ') {
            asLines[j] += asLines[i + 1].substr(1);
            i++;
        }
        let k;
        for (k = 0; k < asLines[j].length; k++) {
            if (asLines[j][k] === ':') {
                break;
            }
        }
        asFirst = asLines[j].slice(0, k).split(';');
        asSecond = asLines[j].slice(k + 1).split(';');
        switch (asFirst[0]) {
            case 'N':
                oContact['Family Name'] = asSecond[0];
                oContact['Given Name'] = asSecond[1];
                break;
            case 'TEL':
                let sTel = iTels.toString();
                oContact['Phone' + sTel + '-Type'] = asFirst[1].substr(5);
                oContact['Phone' + sTel + '-Value'] = asSecond[0];
                iTels++;
                break;
            case 'EMAIL':
                let sEmail = iEmails.toString();
                oContact['E-mail' + sEmail + '-Type'] = asFirst[1].substr(5);
                oContact['E-mail' + sEmail + '-Value'] = asSecond[0];
                iEmails++;
                break;
            case 'X-FC-LIST-ID':
                oContact['FC_ID1'] = asSecond[0];
                break;
            case 'X-ID':
                oContact['FC_ID2'] = asSecond[0];
                break;
            case 'PHOTO':
                let sPhoto = iPhotos.toString();
                oContact['Photo' + sPhoto + ''] = asSecond[0];
                iPhotos++;
                break;
            case 'ORG':
                let sOrg = iOrgs.toString();
                oContact['Organization' + sOrg + '-Name'] = asSecond[0];
                iOrgs++;
                break;
            case 'TITLE':
                let sTitle = iTitles.toString();
                oContact['Organization' + sTitle + '-Title'] = asSecond[0];
                iTitles++;
                break;
            case 'URL':
                let sURL = iURLs.toString();
                oContact['Website' + sURL + ''] = asSecond[0];
                iURLs++;
                break;
            case 'NOTE':
                oContact['Notes'] = asSecond[0];
                break;
            case 'ADR':
                oContact['Address' + iAdrs + '-Street'] = asSecond[2];
                oContact['Address' + iAdrs + '-City'] = asSecond[3];
                oContact['Address' + iAdrs + '-State'] = asSecond[4];
                oContact['Address' + iAdrs + '-PostalCode'] = asSecond[5];
                oContact['Address' + iAdrs + '-Country'] = asSecond[6];
                iAdrs++;
                break;
            case 'CATEGORIES':
                oContact['Group Membership'] = asSecond[0];
                break;
            case 'END':
                iTels = 1;
                iEmails = 1;
                iPhotos = 1;
                iOrgs = 1;
                iTitles = 1;
                iURLs = 1;
                iAdrs = 1;
                dbContent.pushContact(oContact);
                oContact = {};
                iCards++;
                break;
            default:
                break;
        }
    }
    console.log("vcfJson complete, ", iCards, " names");
    dbContent.importNames(iCards);
    fsV.closeSync(fd);
    fsV.unlinkSync('./uploads/' + file);
};
//# sourceMappingURL=vcfjson.js.map