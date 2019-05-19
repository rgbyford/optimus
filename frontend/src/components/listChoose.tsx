import * as React from 'react';
//const load = require ('../pages/load');

type OCat = {
    sIsSubCatOf: string,
    sThisCat: string,
    key: number
  };
  

class ListChoose extends React.Component {
    aoCats: OCat[] = [];
    constructor (props: any) {
        super (props);
        console.log (`LC props: `, props);
//        this.state = {
//            aoCats: OCat[] = []
//        };
    }

    makeCatsList(isSubCatOf: string) {
        console.log(`makeCatsList - subCatsOf: |${isSubCatOf}|`);
        let aoCatsList: string[] = [];
        //let j: number = 0;
//        let aoCats = load.getCats();
//console.log ("this.props: ", this.props);
        let aoCatsLocal: object[] = this.aoCats;
        console.log (`aoCats: ${aoCatsLocal}`);
        // for (let i = 0; i < aoCats.length; i++) {
        //     if (aoCats[i].isSubCatOf === iSubCatOf) {
        //         aoCatsList.push(aoCats[i]);
        //         //            aoCatsList[j].key = j++;
        //     }
        // }
        console.log(`aoCL length: ${aoCatsList.length}`);
        return (aoCatsList);
    }

        //    let aoCatsList = makeCatsList ("");
    render() {
        return (
            <div>
            <select> {
                this.makeCatsList("").map((x, y) => <option key = {y}> {x} </option>)}
            </select>
            </div>
        );
    }
}

//                this.makeCatsList("").map((x, y) => <option key = {y.sThisCat}> {x} </option>)}

export default ListChoose;