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
  iPersonShow: number
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

const paraStyle = {
  marginBottom: 0,
  whiteSpace: 'pre' as 'pre',
  textAlign: 'left' as 'left',
  marginTop: 0
}

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
// searchButton = (param: number) => async () => {
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

export class Search extends React.Component<{}, CSRState> {
  state: CSRState;
  constructor(props: any) {
    super(props);
    this.state = {
//      list: [],
      loading: true,
      sAddCat: [],
      aoFound: [],
      iCounter: 0,
      iPersonShow: -1
    }
    console.log ("constructor aoFound: ", this.state.aoFound);
    this.nextButton = this.nextButton.bind(this);
    this.andButton = this.andButton.bind(this);
//    this.searchButton = this.searchButton.bind(this);
    aiCatsSelected[0] = 0;
  }
   
  onClose () {
    return;
  }

  ModalBox (iPerson: number) {
    console.log ("ModalBox: ", iPerson, aoFoundNames[iPerson].GivenName);
    let sAddString: string;
    
    // for each GroupMembership string
    for (let i = 0; i < aoFoundNames[iPerson].GroupMembership.length; i++) {
      for (let j = 0; j < catList.aoCats.length; j++) {
        // search aoCats.sThisCat for a match
        if (aoFoundNames[iPerson].GroupMembership[i] === catList.aoCats[j].sThisCat) {
          // set GroupMembership string using aoCats.iIndent
          switch (catList.aoCats[j].iIndent) {
            case 0: sAddString = ''; break;
            case 1: sAddString = '    '; break;
            case 2: sAddString = '        '; break;
            case 3: sAddString = '            '; break;
            default: sAddString = ''; break;
          }
          aoFoundNames[iPerson].GroupMembership[i] = sAddString + aoFoundNames[iPerson].GroupMembership[i];
          break;
        }
      }
    }
    console.log ("xx|", aoFoundNames[iPerson].GroupMembership[1], "|xx");
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
          {aoFoundNames[iPerson].GroupMembership.map((sTagName,index1) => <div key={index1}>
            <div><p style={paraStyle}>{sTagName}</p></div></div>)}
          <div className="footer"></div>
        </div>
      </div>
    );
  }

  rowSel (index: number) {
    console.log ("Clicked row: ", index);
    this.setState ({iPersonShow: index});
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

  async componentDidMount() {
    try {
      aoSearch[0].bShowList = true;
      iTotalRows = 1;
      bRefining = false;
      catList = await getList();
      this.setState({ // eslint-disable-link
        loading: false
      });
    } catch (err) {
      this.setState({ loading: false }); // eslint-disable-line
    }
  }

  srchButton = (param: number, thisParam: any) => async () => {
    searchButton (param, thisParam);
  }
  
  // Add category to search.  Selection is in e.target.options.  iRow is the search row
  catAddSelect = (e: React.ChangeEvent<HTMLSelectElement>, iRow: number) => {
//    console.log ("Need to debug this");
    aoSearch[iRow].sCat = [].filter.call(e.target.options, (o: any) => o.selected).map((o: any) => o.value);
//    console.log ("catAddSelect: ", aoSearch[iRow].sCat);
  }

  startOverButton = (thisParam: any) => () => {
    bStartOver = true;
    thisParam.setState ({aoFound: [], iPersonShow: -1});
    //thisParam.setState ({iCounter: thisParam.state.iCounter++});    // just to cause refresh
  }

  andButton = (param: number) => () => {
    aoSearch[param].bAnd = false;
    aoSearch[param].bSearch = false;
    aoSearch[param].bStartOver = false;
    console.log ('AND iCatSearches: ', aoSearch[param].iCatSearches);
    iTotalRows++;
    aoSearch[iTotalRows - 1] = new OSearch ();
    aoSearch[iTotalRows - 1].bNext = true;
    aoSearch[iTotalRows - 1].bShowList = true;
    // eslint-disable-next-line
    this.setState ({iPersonShow: -1, iCounter: this.state.iCounter++});    // ensure refresh
  }
  
  nextButton = (param: number) => () => {
    // param is the argument you passed to the function
    // e is the event object that returned
    console.log ("next button: ", param, aoSearch[param].iCatSearches);
    aoSearch[param].iCatSearches++;
    if (aoSearch[param].sSearch !== "") {
      aoSearch[param].sSearch += ' _ ';
    }
    if (aoSearch[param].iCatSearches < 4 && aoSearch[param].sCat.length < 2) {     // < 2 ==> not OR
      console.log ('sCat: ', aoSearch[param].sCat);
      console.log ('sCat length: ', aoSearch[param].sCat.length);
      aoSearch[param].bComplete = false;
      aoSearch[param].bShowList = true;
      if (aoSearch[param].iCatSearches > 0) {       // not first list
        aoSearch[param].bAnd = true;
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
    aoSearch[param].bSearch = true;
    aoSearch[param].bStartOver = true;
    aoSearch[param].sSearch += aoSearch[param].sCat.join (' OR '); // only puts in OR if there's more than one item in sCat?
    console.log ("searchString: ", aoSearch[param].sSearch);
    aoSearch[param].sSubCatOf = aoSearch[param].sCat[0];
    console.log ('asSubCatOf: ', aoSearch[param].sCat[0]);
    //sSubCatOf = this.sCat[0];          // deal with the fact that this is an array
    //aiCatsSelected[param]++;
    if (bRefining) {
      console.log ("Faking search");
      searchButton (param, this);      // fake it
    }
    else {
      // eslint-disable-next-line
      this.setState ({iCounter: this.state.iCounter++});    // just to cause refresh
    }
  }

  csr(state: any) {
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
    // if (iTotalRows === 1) {             // first time through
    //   aoSearch[0].bShowList = true;
    // }

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
          <div><p>{oSrch.sSearch}</p></div>
          {oSrch.bShowList ?
            <div><select size={10} multiple={oSrch.bAllowMult ? true : false} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.catAddSelect(e, index1)}>
            {oSrch.aoCatsList.map((value2, index2) => <option key = {index2}> {value2.sThisCat} </option>)}
          </select></div> : ''}
          <div>{oSrch.bNext ? <button onClick={this.nextButton(index1)}>Next</button> : ''}</div>
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
        //console.log ("oSrch.sSearch: ", aoSearch[0].sSearch);
    console.log (`render CSRWD: |`, {...this.state});
    // state has members as above - list is null on the first call, is {aoCats[]} on the second call
    // and loading true on the first call, false on the second
    // return <CSR {...this.props} {...this.state} />;
   return (<div> {this.csr ({...this.state})} </div>);
  }
}
