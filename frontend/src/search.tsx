import * as React from 'react';
import { getList, getContacts } from './public';
//import ComboSelect from 'react-combo-select';
//require('../node_modules/react-combo-select/style.css');
import Header from './components/Header';
//import { O_CREAT } from 'constants';
//import PropTypes from 'prop-types';
//import {Table, Thead, Th, Tr,Td} from 'reactable';
import ReactDataGrid from 'react-data-grid';
//import {ModalContainer, ModalDialog} from 'react-modal-dialog';

//import PropTypes from 'prop-types';
//import { isNullOrUndefined } from 'util';


//const NUM_ANDS = 4;
type OMod = {
  id: number,
  GivenName: string,
  FamilyName: string,
  "E-mail1-Value": string,
  'Phone1-Value': string,
  Photo1: string,
  FC_ID1: string,
  FC_ID2: string,
  url: string
};

type OCat = {
  sIsSubCatOf: string,
  sThisCat: string,
  key: number
};

type CSRState = {
  list: OCat[],
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
  bSearch: boolean = true;
  sSubCatOf: string = '';
  iCatSearches: number = 0;
  bComplete: boolean = false;
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
  maxHeight: 350,
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
  margin: 20,
  verticalAlign: 'top',
  display: 'inline-block'
};
const boxStyle = {
  margin: 20,
  verticalAlign: 'top',
  display: 'inline-block'
};
    
let aiCatsSelected: number[] = [];
let aoSearch: OSearch[] = [];
//aoSearch.push (new OSearch ());
aoSearch[0] = new OSearch ();
aoSearch[0].bNext = true;
console.log ("aoS original length: ", aoSearch.length);
let bRefining: boolean;
//let sSubCatOf: string;
let aoFoundNames: OMod[] = [];

let iTotalRows = 0;   // easy way, rather than checking aoSearch
//let iPersonShow = -1;

const columns = [
  { key: 'GivenName', name: 'GivenName' },
  { key: 'FamilyName', name: 'FamilyName'}
];


export class Search extends React.Component<{}, CSRState> {
  state: CSRState;
  constructor(props: any) {
    super(props);
    this.state = {
      list: [],
      loading: true,
      sAddCat: [],
      aoFound: [],
      iCounter: 0,
      iPersonShow: -1
    }
    console.log ("constructor aoFound: ", this.state.aoFound);
    this.nextButton = this.nextButton.bind(this);
    this.andButton = this.andButton.bind(this);
    this.searchButton = this.searchButton.bind(this);
    aiCatsSelected[0] = 0;
  }
   
  onClose () {
    return;
  }

//          {this.props.children}

  ModalBox (iPerson: number) {
    console.log ("ModalBox: ", aoFoundNames[iPerson].GivenName);
    return (
      <div className="backdrop" style={backStyle}>
      <div className="modal" style={modalStyle}>
          <div><p>{aoFoundNames[iPerson].GivenName} {aoFoundNames[iPerson].FamilyName}</p></div>
          <p>{aoFoundNames[iPerson].FC_ID1 !== undefined ? <a target="_blank" href={aoFoundNames[iPerson].url}><strong>FullContact</strong></a> : ''}</p>
          <p>{aoFoundNames[iPerson]['Phone1-Value']}&nbsp;&nbsp;{aoFoundNames[iPerson]['E-mail1-Value']}</p><br></br>
          <img alt="" style={{height: 120}} src={aoFoundNames[iPerson].Photo1}/>
          <div className="footer"></div>
        </div>
      </div>
    );
  }


  rowSel (index: number) {
    console.log ("Row: ", index);
    this.setState ({iPersonShow: index});
    console.log ('iPS: ', this.state.iPersonShow);
  }

//  handleClick () {
//    return;
//  }

//  handleClohandleClose () {
//    this.setState ({iPersonShow: -1});
//    return;
//  }

  NameTable (tableData: { GivenName: string, FamilyName: string }[]) {
    //console.log("Hello World");
    return (<ReactDataGrid
      minWidth = {500}
      columns={columns}
      rowGetter={i => tableData[i]}
      rowsCount={tableData.length}
      enableCellSelect={true}
      onCellSelected={i => this.rowSel(i.rowIdx)}
      minHeight={420} />);
  }
  
  async componentDidMount() {
    try {
      iTotalRows = 1;
      bRefining = false;
      console.log ("CDM before gL call");
      const list = await getList();
      console.log("CDM:", list);
      this.setState({ // eslint-disable-line
        list: list,
        loading: false,
      });
      //bCatSelected = false;
    } catch (err) {
//      this.setState({ loading: false, error: err.message || err.toString() }); // eslint-disable-line
      this.setState({ loading: false }); // eslint-disable-line
    }
  }

  async searchButton () {
    console.log ("Search button");
    bRefining = true;
    let asSearch: string[] = [];  // api is written to use array of strings
    for (let i = 0; i < iTotalRows; i++) {
      asSearch[i] = aoSearch[i].sSearch;
    }
    let aoContacts = await getContacts(asSearch);
    console.log ("aoFound: ", aoContacts.aoFound);
    this.setState ({aoFound: aoContacts.aoFound});      // same name in backend!
      for (let i = 0; i < aoContacts.aoFound.length; i++) {
        let oName = {} as OMod;
        oName.id = i;
        oName = aoContacts.aoFound[i];
        aoFoundNames.push(oName);
      }
      console.log (aoFoundNames);
     return;
  }

  // Add category to search.  Selection is in e.target.options.  iRow is the search row
  catAddSelect = (e: React.ChangeEvent<HTMLSelectElement>, iRow: number) => {
    console.log ("Need to debug this");
    aoSearch[iRow].sCat = [].filter.call(e.target.options, (o: any) => o.selected).map((o: any) => o.value);
    console.log ("catAddSelect: ", aoSearch[iRow].sCat);
  }

  andButton = (param: number) => () => {
    aoSearch[param].bAnd = false;
    aoSearch[param].bSearch = false;
    console.log ('AND iCatSearches: ', aoSearch[param].iCatSearches);
    iTotalRows++;
    aoSearch[iTotalRows - 1] = new OSearch ();
    aoSearch[iTotalRows - 1].bNext = true;
    // eslint-disable-next-line
    this.setState ({iCounter: this.state.iCounter++});    // just to cause refresh
  }
  
  nextButton = (param: number) => () => {
    // param is the argument you passed to the function
    // e is the event object that returned
    console.log ("next button: ", param, aoSearch[param].iCatSearches);
    aoSearch[param].iCatSearches++;
    if (aoSearch[param].sSearch !== "") {
      aoSearch[param].sSearch += ' _ ';
    }
    if (aoSearch[param].iCatSearches < 3  && aoSearch[param].sCat.length < 2) {     // < 2 ==> not OR
      console.log ('sCat: ', aoSearch[param].sCat);
      console.log ('sCat length: ', aoSearch[param].sCat.length);
      aoSearch[param].bComplete = false;
      if (aoSearch[param].iCatSearches > 0) {
        aoSearch[param].bAnd = true;
      }
    }
    else {
      aoSearch[iTotalRows - 1].bComplete = true;
      aoSearch[iTotalRows - 1].bAnd = false;
      aoSearch[iTotalRows - 1].bNext = false;
      aoSearch[iTotalRows - 1].bSearch = false;
      iTotalRows++;
      aoSearch[iTotalRows - 1] = new OSearch ();
      aoSearch[iTotalRows - 1].bNext = true;
    }
    aoSearch[param].sSearch += aoSearch[param].sCat.join (' OR '); // only puts in OR if there's more than one item in sCat?
    console.log ("searchString: ", aoSearch[param].sSearch);
    aoSearch[param].sSubCatOf = aoSearch[param].sCat[0];
    console.log ('asSubCatOf: ', aoSearch[param].sCat[0]);
    //sSubCatOf = this.sCat[0];          // deal with the fact that this is an array
    //aiCatsSelected[param]++;
    if (bRefining) {
      this.searchButton ();      // fake it
    }
    else {
      // eslint-disable-next-line
      this.setState ({iCounter: this.state.iCounter++});    // just to cause refresh
    }
  }

  csr(state: any) {
    for (let iRow = 0; iRow < iTotalRows; iRow++) {
      console.log('iTR, iRow, iCatSearches: ', iTotalRows, iRow, aoSearch[iRow].iCatSearches);
      aoSearch[iRow].aoCatsList = [];
      if (aoSearch[iRow].iCatSearches < 3) {
        console.log('aoS[iR].sSCO: ', aoSearch[iRow].sSubCatOf);
        // work out select elements
        let j = 0;
        for (let i = 0; i < state.list.aoCats.length; i++) {
          if (state.list.aoCats[i].sIsSubCatOf === aoSearch[iRow].sSubCatOf) {
            aoSearch[iRow].aoCatsList.push(state.list.aoCats[i]);
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
        aoSearch[iRow].iCatSearchesMax = 2;
      }
    }

    let aoFoundPeople: OMod[] = [];
    console.log ("csr aoFound 1: ", state.aoFound);
//    if(state.aoFound !== undefined) {
    if(state.aoFound !== []) {
      console.log ("csr aoFound 2: ", state.aoFound);
      aoFoundPeople = state.aoFound;
      aoFoundPeople.sort((a: OMod, b: OMod) => (a.FamilyName > b.FamilyName) ? 1 :
       (b.FamilyName > a.FamilyName) ? -1 : 
       ((a.GivenName > b.GivenName) ? 1 : (b.GivenName > a.GivenName) ? -1 : 0));
      //console.log ("aoFound", state.aoFound.aoFound[0].FamilyName);
    }
    else {
      aoFoundPeople = [];
    }
    //console.log ("aoFP: ", aoFoundPeople);

//    this.aoFound.map((x, y) => console.log (x.FamilyName));

    for (let i = 0; i < aoFoundPeople.length; i++) {
      aoFoundPeople[i].url = `https://app.fullcontact.com/contacts/${aoFoundPeople[i].FC_ID1}/${aoFoundPeople[i].FC_ID2}`;
//      console.log ('URL: ', aoFoundPeople[i].url);
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
          {oSrch.bComplete ? '' :
            <div><select size={10} multiple={oSrch.bAllowMult ? true : false} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.catAddSelect(e, index1)}>
            {oSrch.aoCatsList.map((value2, index2) => <option key = {index2}> {value2.sThisCat} </option>)}
          </select></div>}
          <div>{oSrch.bNext ? <button onClick={this.nextButton(index1)}>Next</button> : ''}</div>
          <div>{oSrch.bAnd ? <button onClick={this.andButton(index1)}>AND</button> : ''}</div>
          <div>{oSrch.bSearch ? <button onClick={this.searchButton}>Search</button> : ''}</div>
          </div>)}
          <br></br>
            <div style={tableStyle}>{aoFoundPeople.length > 0 ? this.NameTable  (aoFoundPeople) : ''}</div>
            <div style={boxStyle}>{this.state.iPersonShow >= 0 ? this.ModalBox (this.state.iPersonShow) : ''}</div>
          <div>
      </div>
    </strong>
    </div>
    );
}


  render() {
    console.log (`render CSRWD: |`, {...this.state});
    // state has members as above - list is null on the first call, is {aoCats[]} on the second call
    // and loading true on the first call, false on the second
    // return <CSR {...this.props} {...this.state} />;
   return (<div> {this.csr ({...this.state})} </div>);
  }
}
