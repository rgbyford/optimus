import * as React from 'react';
import { getList, getContacts } from './public';
import Header from './components/Header';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';

type OMod = {
  id: number,
  GivenName: string,
  FamilyName: string,
  "E-mail1-Value": string,
  'Phone1-Value': string,
  Photo1: string,
  FC_ID1: string,
  FC_ID2: string,
  GroupMembership: string[],
//  GMString: string,
  url: string
};

type OCat = {
  sIsSubCatOf: string,
  sThisCat: string,
  iIndent: number,
  key: number
};

type catListType = {
  aoCats: OCat[]
};

let catList: catListType;

type CSRState = {
  loading: boolean,
  sAddCat: string[],
  aoFound: OSearch[],
  iCounter: number,
  iPersonShow: number,
  iSelectedRow: number,
  iStillInSearch: number
};  

class OTagInfo {
  sTag: string = '';
  iPersonNum: number = 0;
};

class OSearch {
  sSearch: string = '';
  asSelect: string[] = [];
  bNext: boolean = false;
  bAnd: boolean = false;
  bSearch: boolean = false;
  bShowList: boolean = false;
  bStartOver: boolean = false;
  sSubCatOf: string = '';
  iCatSearches: number = 0;
  bComplete: boolean = true;   // a fake to prevent new list from appearing right after search
  aoCatsList: OCat[] = [];
  sCat: string[] = [];
  bAllowMult: boolean = false;
  iCatSearchesMax: number = 0;
};

// The gray background
const backStyle = {
  //        position: 'fixed',  // typescript doesn't like this
  //top: 0,
  bottom: 0,
  left: 20,
  right: 0,
  maxWidth: 600,
  maxHeight: 1000,
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: 50
};

// The modal "window"
const modalStyle = {
  backgroundColor: '#fff',
  borderRadius: 5,
  maxWidth: 500,
  minHeight: 200,
  margin: '0 auto',
  padding: 30
};

const tableStyle = {
  backgroundColor: '#fff',
  margin: 20,
  verticalAlign: 'top',
  display: 'inline-block',
  overflow: 'auto!important'
};

const boxStyle = {
  margin: 20,
  verticalAlign: 'top',
  display: 'inline-block'
};

// const paraStyle = {
//   marginBottom: 0,
//   whiteSpace: 'pre' as 'pre',
//   textAlign: 'left' as 'left',
//   marginTop: 0
// }

const textStyle = {
  textAlign: 'left' as 'left',
  marginLeft: '45%'
}

// const tableText = {
//   textAlign: 'left' as 'left'
// }

let aiCatsSelected: number[] = [];
let aoSearch: OSearch[] = [];
aoSearch[0] = new OSearch ();
aoSearch[0].bNext = true;
let bRefining: boolean;
let aoFoundNames: OMod[] = [];
let bStartOver: boolean = false;
let aoFoundPeople: OMod[] = [];

let iTotalRows = 0;   // easy way, rather than checking aoSearch

async function searchButton (param: number, thisParam: any) {
    console.log ("Search button:", param);
    bRefining = true;
    aoSearch[param].bSearch = false;
    aoSearch[param].bShowList = false;
//    aoSearch[param].bComplete = true;   // don't show list after search
    let asSearch: string[] = [];  // api is written to use array of strings
    for (let i = 0; i < iTotalRows; i++) {
      asSearch[i] = aoSearch[i].sSearch;
    }
    let aoContacts = await getContacts(asSearch);
    console.log ("aoContacts.aoFound[0]: ", aoContacts.aoFound[0]);
    aoFoundNames = [];
    for (let i = 0; i < aoContacts.aoFound.length; i++) {
      aoContacts.aoFound[i].GivenName = aoContacts.aoFound[i].GivenName + ' ';   // for table display
    }
    console.log ("setState 1");
    thisParam.setState ({aoFound: aoContacts.aoFound});      // same name in backend!
    for (let i = 0; i < aoContacts.aoFound.length; i++) {
      let oName = {} as OMod;
      oName.id = i;
      oName = aoContacts.aoFound[i];
      // oName.GMString = '';
      // for (let j = 0; j < oName.GroupMembership.length; j++) {
      //   oName.GMString += '\n' + oName.GroupMembership[j];
      // }
      aoFoundNames.push(oName);
    }
    return;
  }

//let iSelectedRow: number;
let sTag: string;

  // ************ Search class
export class Search extends React.Component<{}, CSRState> {
  state: CSRState;

  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      sAddCat: [],
      aoFound: [],
      iCounter: 0,
      iPersonShow: -1,
      iSelectedRow: -1,
      iStillInSearch: 0
    }
    console.log ("constructor aoFound: ", this.state.aoFound);
    this.nextButton = this.nextButton.bind(this);
    this.andButton = this.andButton.bind(this);
    this.onRefineClick = this.onRefineClick.bind(this);
    aiCatsSelected[0] = 0;
  }

  async componentDidMount() {
    try {
      aoSearch[0].bShowList = true;
      iTotalRows = 1;
      bRefining = false;
      catList = await getList();
      console.log ("setState 2");
      this.setState({ // eslint-disable-link
        loading: false
      });
    } catch (err) {
      console.log ("setState 3");
      this.setState({ loading: false }); // eslint-disable-line
    }
  }
 
  onClose () {
    return;
  }

  onRefineClick = (index: number) => () => {
    let sSearch: string = "";
    let sSrchTag: string = sTag;
//    let sSubCat: string = '';
    // build the search string
    do {
      for (let i: number = 0; i < catList.aoCats.length; i++) {
        if (catList.aoCats[i].sThisCat === sSrchTag) {
          if (sSearch !== '') {
            sSearch = ' _ ' + sSearch;
          }
          sSearch = sSrchTag + sSearch;
          sSrchTag = catList.aoCats[i].sIsSubCatOf;
//          sSubCat = sSrchTag;
          break;
        }
      }
    } while (sSrchTag !== '');
    console.log("Search string: ", sSearch);
    iTotalRows++;
    aoSearch[iTotalRows - 1] = new OSearch ();
    aoSearch[iTotalRows - 1].sSearch = sSearch;
    aoSearch[iTotalRows - 1].sSubCatOf = sTag;
    aoSearch[iTotalRows - 1].sCat[0] = sTag;
    console.log("iTotalRows: ", iTotalRows);
    console.log("aoSearch: ", aoSearch);
    console.log("Faking search");
    console.log ("setState 4");
    this.setState ({iSelectedRow: -2, iPersonShow: -1});  // prevent show of picture (index is about to change)
    searchButton (iTotalRows - 1, this);      // fake it
  }

  tagRowSel (index: number, iPerson: number) {
    // take off the indent
    sTag = aoFoundNames[iPerson].GroupMembership[index].substr(1);
    console.log ("Clicked tag: ", sTag);
    let bFound: boolean = false;
    console.log ("setState 5");
    this.setState ({iSelectedRow: -2}); // clear any previous selection
    
    // now search the searches (!) to see if this tag was already included
    console.log ("Search lengths: ", aoSearch.length, aoSearch[0].aoCatsList.length);
    console.log ("aoSearch: ", aoSearch);
    for (let i: number = 0; i < aoSearch.length; i++) {
      if (aoSearch[i].sSearch.indexOf (sTag) >= 0) {
        console.log ("Found tag ", sTag);
        bFound = true;
        break;
      }
    }
    if (!bFound) {
      console.log ("Can't find tag", sTag);
      // work out how many this would reduce the search to
      // GM includes indent in its strings, but that doesn't matter
      let iRemaining = 0;
      for (let i = 0; i < aoFoundNames.length; i++) {
        console.log("aoFN[i].GM: ", i, aoFoundNames[i].GivenName, aoFoundNames[i].GroupMembership);
        for (let j = 0; j < aoFoundNames[i].GroupMembership.length; j++) {
          if (aoFoundNames[i].GroupMembership[j].includes(sTag)) {
            iRemaining++;
            break;
          }
        }
      }
      console.log ("iRemaining: ", iRemaining);
      console.log ("setState 6");
      this.setState ({iSelectedRow: index, iStillInSearch: iRemaining});
      // add it to the searches (have to find its parents), and fake the search button
      // find the parents by searching through aoCatsList.sThisCat, and taking sIsSubCatOf
      // repeat - until sIsSubCat of == ""
//      this.setState ({iPersonShow: index});    // prevent trying to "reshow person" - is that what we want?

    }
    return;
  }

  // ********** Gives the list of the found person's tags
  tagTable (asTagData: string[], iPerson: number) {
    let aoTagInfo: OTagInfo[] = [];
    
    // table wants array of objects
    for (let i: number = 0; i < asTagData.length; i++) {
      aoTagInfo[i] = new OTagInfo ();
      aoTagInfo[i].sTag = asTagData[i];
      aoTagInfo[i].iPersonNum = iPerson;
    }
//    console.log ("setState 7");
//    this.setState ({iSelectedRow: -2}); // clear any previous selection

    // had to create cellRenderer to get the indents to work
    return (<Table
      width={200}
      height={200}
      headerHeight={20}
      rowHeight={25}
      rowCount={aoTagInfo.length}
      rowGetter={({ index }) => aoTagInfo[index]}
      onRowClick={({ event, index, rowData }) => this.tagRowSel(index, iPerson)}
      >

    <Column
      dataKey='sTag'
      cellRenderer={({ cellData, columnData, dataKey, rowData, rowIndex}) => {
        const sIndent = cellData[0].toString() + 'em';
        cellData = cellData.substr(1);
        return (rowIndex === this.state.iSelectedRow ?
        <div style={{backgroundColor: 'palegreen', textAlign: 'left', marginLeft: sIndent}}>{cellData}</div> :
        <div style={{backgroundColor: 'white', textAlign: 'left', marginLeft: sIndent}}>{cellData}</div>)
      }}
      width={150}
    />
    </Table>

    );
  }

  // *********** displays person (after click on list)
  ModalBox (iPerson: number) {
    // for each GroupMembership string
    for (let i = 0; i < aoFoundNames[iPerson].GroupMembership.length; i++) {
      for (let j = 0; j < catList.aoCats.length; j++) {
        // search aoCats.sThisCat for a match
        if (aoFoundNames[iPerson].GroupMembership[i] === catList.aoCats[j].sThisCat) {
          // have to include indent in the string, because it seems you can only pass one 
          // string as cellData to the cellRenderer
          aoFoundNames[iPerson].GroupMembership[i] = 
            catList.aoCats[j].iIndent + aoFoundNames[iPerson].GroupMembership[i];
          break;
        }
      }
    }
    return (
      <div className="backdrop" style={backStyle}>
      <div className="modal" style={modalStyle}>
          <div><p>{aoFoundNames[iPerson].GivenName} {aoFoundNames[iPerson].FamilyName}</p></div>
          <p>{aoFoundNames[iPerson].FC_ID1 !== undefined
            ? <a rel="noopener noreferrer" target="_blank" href={aoFoundNames[iPerson].url}><strong>FullContact</strong></a>
            : ''}</p>
          <p>{aoFoundNames[iPerson]['Phone1-Value']}&nbsp;&nbsp;{aoFoundNames[iPerson]['E-mail1-Value']}</p><br></br>
          <img alt="" style={{height: 120}} src={aoFoundNames[iPerson].Photo1}/>
          <br></br>
          <br></br>
            <div style={tableStyle}>{this.tagTable (aoFoundNames[iPerson].GroupMembership, iPerson)}</div>
          <div>{this.state.iSelectedRow >= 0 ? <button onClick={this.onRefineClick(iPerson)}>Refine search ({this.state.iStillInSearch})</button> : ''}</div>
          <div className="footer"></div>
        </div>
      </div>
    );
  }

  rowSel (index: number) {
    console.log ("Clicked row: ", index);
    console.log ("setState 8");
    this.setState ({iSelectedRow: -2, iPersonShow: index});
  }

 NameTable (tableData: { GivenName: string, FamilyName: string }[]) {
    return (<Table
    width={300}
    height={300}
     headerHeight={20}
    rowHeight={30}
    rowCount={tableData.length}
    rowGetter={({ index }) => tableData[index]}
    onRowClick={({event, index, rowData}) => this.rowSel(index)}
  >
    <Column
      dataKey='GivenName'
      width={100}
      style= {{float: 'inline-start', display: 'inline'}}
    />
    <Column
      width={100}
      dataKey='FamilyName'
      style= {{float: 'inline-end', display: 'inline'}}
    />
  </Table>
    );
  }

  
  srchButton = (param: number, thisParam: any) => async () => {
    searchButton (param, thisParam);
  }
  
  // Add category to search.  Selection is in e.target.options.  iRow is the search row
  catAddSelect = (e: React.ChangeEvent<HTMLSelectElement>, iRow: number) => {
    aoSearch[iRow].sCat = [].filter.call(e.target.options, (o: any) => o.selected).map((o: any) => o.value);
  }

  startOverButton = (thisParam: any) => () => {
    bStartOver = true;
    console.log ("setState 9");
    thisParam.setState ({aoFound: [], iPersonShow: -1});
  }

  andButton = (iAndSearchNum: number) => () => {
    aoSearch[iAndSearchNum].bAnd = false;
    aoSearch[iAndSearchNum].bSearch = false;
    aoSearch[iAndSearchNum].bStartOver = false;
    console.log ('AND iCatSearches: ', aoSearch[iAndSearchNum].iCatSearches);
    iTotalRows++;
    aoSearch[iTotalRows - 1] = new OSearch ();
    aoSearch[iTotalRows - 1].bNext = true;
    aoSearch[iTotalRows - 1].bShowList = true;
    // eslint-disable-next-line
    console.log ("setState 10");
    let iCtr: number = this.state.iCounter;
    iCtr++;
    this.setState ({iPersonShow: -1, iCounter: iCtr});    // ensure refresh
  }
  
  // ************ next button
  // iAndSearchNum is incremented each time you hit AND
  nextButton = (iAndSearchNum: number) => () => {
    console.log ("next button: ", iAndSearchNum, aoSearch[iAndSearchNum].iCatSearches);
    aoSearch[iAndSearchNum].iCatSearches++;   // count categories added
    if (aoSearch[iAndSearchNum].sSearch !== "") {   // not first category
      aoSearch[iAndSearchNum].sSearch += ' _ ';
    }
    if (aoSearch[iAndSearchNum].iCatSearches < 4 && aoSearch[iAndSearchNum].sCat.length < 2) {     // < 2 ==> not OR
      aoSearch[iAndSearchNum].bComplete = false;
      aoSearch[iAndSearchNum].bShowList = true;
      if (aoSearch[iAndSearchNum].iCatSearches > 0) {       // not first list
        aoSearch[iAndSearchNum].bAnd = true;
      }
    }
    else {            // got to 3 subcats
      aoSearch[iTotalRows - 1].bComplete = true;
      aoSearch[iTotalRows - 1].bAnd = false;
      aoSearch[iTotalRows - 1].bNext = false;
      aoSearch[iTotalRows - 1].bSearch = false;
      aoSearch[iTotalRows - 1].bShowList = false;
      iTotalRows++;
      aoSearch[iTotalRows - 1] = new OSearch ();
      //      aoSearch[iTotalRows - 1].bNext = true;
    }
    aoSearch[iAndSearchNum].bSearch = true;
    aoSearch[iAndSearchNum].bStartOver = true;
    aoSearch[iAndSearchNum].sSearch += aoSearch[iAndSearchNum].sCat.join (' OR '); // only puts in OR if there's more than one item in sCat?
    console.log ("searchString: ", aoSearch[iAndSearchNum].sSearch);
    aoSearch[iAndSearchNum].sSubCatOf = aoSearch[iAndSearchNum].sCat[0];
    console.log ('asSubCatOf: ', aoSearch[iAndSearchNum].sCat[0]);
    if (bRefining) {
      console.log ("Faking search");
      searchButton (iAndSearchNum, this);      // fake it
    }
    else {
      // eslint-disable-next-line
      console.log ("setState 11");
      let iCtr: number = this.state.iCounter;
      iCtr++;
      this.setState ({iCounter: iCtr});    // just to cause refresh
    }
  }

  presentSearchChoices (state: any) {
    for (let iRow = 0; iRow < iTotalRows; iRow++) {
      console.log('iTR, iRow, iCatSearches: ', iTotalRows, iRow, aoSearch[iRow].iCatSearches);
      console.log ("ACNSS: ", aoSearch[iRow].bAnd, aoSearch[iRow].bComplete, aoSearch[iRow].bNext, aoSearch[iRow].bSearch, aoSearch[iRow].bStartOver);
      console.log ("bRefining: ", bRefining);
      aoSearch[iRow].aoCatsList = [];
      if (aoSearch[iRow].iCatSearches < 4) {
        console.log('aoS[iR].sSCO: ', aoSearch[iRow].sSubCatOf);
        // work out select elements
        let j = 0;
        for (let i = 0; i < catList.aoCats.length; i++) {
          if (catList.aoCats[i].sIsSubCatOf === aoSearch[iRow].sSubCatOf) {
            aoSearch[iRow].aoCatsList.push(catList.aoCats[i]);
            aoSearch[iRow].aoCatsList[j].key = j++;
          }
        }
        aoSearch[iRow].aoCatsList.sort ((a: OCat, b:OCat) => (a.sThisCat > b.sThisCat) ? 1 : -1);
      }
      aoSearch[iRow].bAllowMult = aoSearch[iRow].sSubCatOf === '' ? false : true;
      if (aoSearch[iRow].aoCatsList.length < 2) {   // can't search a list of 1
        console.log ('short row: ', iRow, aoSearch[iRow].aoCatsList.length);
        aoSearch[iRow].bComplete = true; 
        aoSearch[iRow].bNext = false;
        aoSearch[iRow].bAnd = true;
        aoSearch[iRow].bShowList = false;
        aoSearch[iRow].iCatSearchesMax = 2;
      }
    }
  
    if(state.aoFound !== []) {
      aoFoundPeople = state.aoFound;
      aoFoundPeople.sort((a: OMod, b: OMod) => (a.FamilyName > b.FamilyName) ? 1 :
       (b.FamilyName > a.FamilyName) ? -1 : 
       ((a.GivenName > b.GivenName) ? 1 : (b.GivenName > a.GivenName) ? -1 : 0));
      //console.log ("aoFound", state.aoFound.aoFound[0].FamilyName);
    }
    else {
      aoFoundPeople = [];
    }

    for (let i = 0; i < aoFoundPeople.length; i++) {
      aoFoundPeople[i].url = `https://app.fullcontact.com/contacts/${aoFoundPeople[i].FC_ID1}/${aoFoundPeople[i].FC_ID2}`;
    }
    console.log ('aoSearch len', aoSearch.length);
    console.log ('aoCatsList: ', aoSearch[0].aoCatsList);
    return (
    <div style={{ textAlign: 'center', margin: '0 20px' }}>
      {Header ()}
      <h2>Search page</h2>
      <strong>
        {aoSearch.map((oSrch,index1) => <div key={index1}>
          <div><p>{oSrch.sSearch.length > 0 ? (index1 > 0 ? 'AND:' : 'Search for:') : ''} {oSrch.sSearch}</p></div>
          {oSrch.bShowList ?
          <div><p style={textStyle}>Select one {oSrch.bAllowMult ? ' or more' : ''}:</p>
            <select size={10} multiple={oSrch.bAllowMult ? true : false} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.catAddSelect(e, index1)}>
            {oSrch.aoCatsList.map((value2, index2) => <option key = {index2}> {value2.sThisCat} </option>)}
          </select></div> : ''}
          <div>{oSrch.bNext ? <button onClick={this.nextButton(index1)}>Select</button> : ''}</div>
          <div>{oSrch.bAnd ? <button onClick={this.andButton(index1)}>AND</button> : ''}</div>
          <div>{oSrch.bSearch ? <button onClick={this.srchButton(index1, this)}>Search</button> : ''}</div>
          <div>{oSrch.bStartOver ? <button onClick={this.startOverButton (this)}>Start over</button> : ''}</div>
          </div>)}
          <br></br>
            <div>{aoFoundPeople.length > 1 ? <p>Found {aoFoundPeople.length}</p> : ''}</div>
            <div style={tableStyle}>{aoFoundPeople.length > 0 ? this.NameTable  (aoFoundPeople) : ''}</div>
            <div style={boxStyle}>{this.state.iPersonShow >= 0 ? this.ModalBox (this.state.iPersonShow) : ''}</div>
          <div>
      </div>
    </strong>
    </div>
    );
}

  render() {
    if (bStartOver) { 
      aiCatsSelected = [];
      aoSearch = [];
      aoSearch[0] = new OSearch();
      aoSearch[0].bNext = true;
      aoSearch[0].bShowList = true;
      bRefining = false;
      aoFoundNames = [];
      aoFoundPeople = [];
      iTotalRows = 1;
      bStartOver = false;
    }
    console.log (`presentSearchChoices: |`, {...this.state});
    // state has members as above - list is null on the first call, is {aoCats[]} on the second call
    // and loading true on the first call, false on the second
    // return <CSR {...this.props} {...this.state} />;
   return (<div> {this.presentSearchChoices ({...this.state})} </div>);
  }
}
