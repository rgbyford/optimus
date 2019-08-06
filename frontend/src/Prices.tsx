import * as React from 'react';
import { sendRequest, getBioPrices, getFuelingData } from './public';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import  Col from 'react-bootstrap/Col';
import {oUser, OUserData} from './App';
import { string } from 'prop-types';

type PriceState = {
    loading: boolean,
    iTruckNum: number,
    bGoButton: boolean,
    bPriceChosen: boolean,
   iPriceList: number,
   bAddPrice: boolean
};

type PriceInfo = {
  Location: string,
  Price: number,
  Date: string
};

type FuelPrice = {
  TruckNum: string,
  Price: number,
  Date: string
};

const headingStyle = {
  fontWeight: 700
};

const h2Style = {
  fontSize: '25px',
  fontWeight: 700
};

const leftMargin = {
 marginLeft: "10%"
};

let asPricesDates: string[];
let sPriceToRemove: any;
let aoPriceInfo: PriceInfo[] = [];

export class PricesPage extends React.Component<{}> {
    state: PriceState;
    
    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            iTruckNum: 0,
            bGoButton: false,
            bPriceChosen: false,
            iPriceList: 0,
            bAddPrice: false
        };
    }

  async componentDidMount() {
    //        bGoButtonDone = false;
    //          <div> {this.state.iPriceList > 0 ? this.presentPrices({ ...this.state }) : ''} </div>
    // return (
    //   <div> {this.presentPrices({ ...this.state })} </div>
    // );
    asPricesDates = [];
    let oPrices: any = await getBioPrices (oUser.Location);
    console.log ('Prices:', oPrices.aoFound);
    for(let i = 0; i < oPrices.aoFound.length; i++) {
      aoPriceInfo[i] = oPrices.aoFound[i];
      let sYYYYMMDD = oPrices.aoFound[i].Date;
      let sDate: string = `${sYYYYMMDD.substring(4,6)}/${sYYYYMMDD.substring(6,8)}/${sYYYYMMDD.substring(2,4)}`;
      asPricesDates[i] = sDate + '  ' + oPrices.aoFound[i].Price;
    }
    this.setState ({iPriceList: 1, bChangePasswordButton: false});
  }

  makeCostFile = async (thisParam: any) => {
    let aoFuelingData: [any] = await getFuelingData (oUser.Location);
    let sYear: string = '';
    let sMonth: string = '';
    let sDay: string = '';
    let sHour: string = '';
    let sMinute: string = '';
    // create a date for sorting
    for (let i = 0; i < aoFuelingData.length; i++) {
      let sDate = aoFuelingData[i].DateTime;
      sYear = sDate.substring (0, 4);
      sMonth = (parseInt(sDate.substring(5, 7)) - 1).toString().padStart (2, '0');
      sDay = sDate.substring(8, 10);
      aoFuelingData[i].Date = sYear + sMonth + sDay;
    }
    aoFuelingData.sort ((a, b) => parseInt (a.Date) - parseInt (b.Date));
    aoPriceInfo.sort ((a, b) => parseInt (a.Date) - parseInt (b.Date));
    //console.log ('aoFD: ', aoFuelingData);
    //console.log ('aoPI: ', aoPriceInfo);

    //let aoFuelPrices: FuelPrice[] = [];
    //let oFuelPrice: FuelPrice = {TruckNum: '', Price: 0, Date: ''};
    let sFileLine: string = '';
    let iSeqNum: number = 1000;

    for (let i = 0; i < aoFuelingData.length; i++) {
      let j;
      for (j = aoPriceInfo.length - 1; j >= 0; j--) {     // find the price
        if (j === 0 || aoPriceInfo[j].Date <= aoFuelingData[i].Date) {
          break;
        }
      }
      aoFuelingData[i].Price = aoPriceInfo[j].Price;
      
      sFileLine += iSeqNum.toString().padStart (9, '0');
      iSeqNum++;
      sFileLine += '0000';
      let sDate = aoFuelingData[i].DateTime;
      sYear = sDate.substring (0, 4);
      sMonth = (parseInt(sDate.substring(5, 7)) - 1).toString().padStart (2, '0');
      sDay = sDate.substring(8, 10);
      sHour = sDate.substring(11,13);
      sMinute = sDate.substring(14, 16);
      sFileLine += sMonth + '/' + sDay + '/' + sYear + sHour + ':' + sMinute;
      sFileLine += 'DPWST 01    B900000';
      sFileLine += (aoFuelingData[i].TruckNum).toString().padStart (7, '0');
      sFileLine += '   00000';
      console.log ('aoFD.Tag: ', aoFuelingData[i].Tag);
      if (aoFuelingData[i].Tag !== undefined) {
        sFileLine += aoFuelingData[i].Tag.substring (12,22);
      }
      else {
        sFileLine += '0000000000';
      }
      // 8.3f Amount / 10 - 0000.000
      // multiply by 100, padStart to 7 digits, insert . in 5th position
      // 405 --> 40500 --> 0040500 --> 0040.500
      // 1 --> 100 --> 0000100 -> 0000.100
      let iFuel: number = aoFuelingData[i].Amount;
      let sFuel = (iFuel * 100).toString().padStart (7, '0');      // one less - add '.'
      sFuel = sFuel.substring (0,4) + '.' + sFuel.substring (4,7);
      
      // 7.3f Price - 000.000
      // * 1000, padStart to 6 digits, place . in 4th position
      // 1.45 --> 1450 --> 001450 --> 001.450
      let fPrice: number = aoFuelingData[i].Price;
      let sPrice = (fPrice * 1000).toFixed(0).padStart (6, '0');
      //console.log ('sP0: ', sPrice);
     //sPrice = sPrice.padStart (6, '0');
      //console.log ('sP1: ', sPrice);
      sPrice = sPrice.substring (0,3) + '.' + sPrice.substring (3,6);
      //console.log ('sP2: ', sPrice);
      

      // 7.2f Amount * Price / 10 - 0000.00
      // 405 * 1.45 / 10 = 0058.73
      // Work it out.  Round to 2 digits after the DP.  * 100, padStart to 6 digits, insert DP at position 5
      //  rounding: string = Number.parseFloat (interim).toFixed (2)
      // then just add 0s to the front until it's 7 long
      let fDollars = (iFuel * fPrice) / 10;
      let sMoney: string = Number.parseFloat (fDollars.toString()).toFixed (2);
      while (sMoney.length < 7) {
        sMoney = '0' + sMoney;
      }
      console.log (`sFuel: ${sFuel}, sPrice: ${sPrice}, sMoney: ${sMoney}`);
      sFileLine += sFuel + sPrice + sMoney;
      sFileLine += '00000000000000000000000000000000000000.0\r\n';
    }
    // for now, don't format it
//    const fileData = JSON.stringify(sFileLine);
    const fileData = sFileLine;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'fuel.txt';   // needs to be DCB......
    link.href = url;
    link.click();
  }

/*
  bioPricesButton: any = async (thisParam: any) => {
    asPricesDates = [];
    let oPrices: any = await getBioPrices (oUser.Location);
    console.log ('Prices:', oPrices.aoFound);
    for(let i = 0; i < oPrices.aoFound.length; i++) {
      aoPriceInfo[i] = oPrices.aoFound[i];
      let sYYYYMMDD = oPrices.aoFound[i].Date;
      let sDate: string = `${sYYYYMMDD.substring(4,6)}/${sYYYYMMDD.substring(6,8)}/${sYYYYMMDD.substring(2,4)}`;
      asPricesDates[i] = sDate + '  ' + oPrices.aoFound[i].Price;
    }
    this.setState ({iPriceList: 1, bChangePasswordButton: false});
  }
*/
  presentPrices(state: any) {
    return (
      <strong>
        <br /><br />
        {this.state.iPriceList > 0 ? 
        <Container>
          <h2 style={h2Style}>Prices</h2><br />
          <div style={leftMargin}>
            <Row>
              <Col>
                <h3 style={headingStyle}>Remove:</h3>
                <br />
                <select size={12} multiple={false}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.ChoosePrice(e)}>
                  {asPricesDates.map((value2, index2) => <option key={index2}> {value2} </option>)}
                </select>
                <br />
                {this.state.bPriceChosen ? <button onClick={() => this.removePrice(this)}>Remove</button> : ''}
              </Col>
              <Col>
                <br />
                <h3 style={headingStyle}>Add:</h3>
                <br />
                <div id='label-style'>Price:</div>
                <input width="100px" type="text" id='idprice' name="logprice" ref="refPriceAdd" placeholder="Price" required={true}></input>
                <br />
                <div id='label-style'>Date:</div>
                <input width="100px" type="text" id='iddate' name="logdate" ref="refDateAdd" placeholder="Date" required={true}></input>
                <br /><br />
                <button onClick={() => this.addPrice(this)}>Add</button>
              </Col>
            </Row>
            <Row>
                <button onClick={() => this.makeCostFile(this)}>Cost file</button>

            </Row>
          </div>
        </Container>
        : ''};
      </strong>
    )
  };

  ChoosePrice = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    let asPrices: string[] = [].filter.call(e.target.options, (o: any) => o.selected).map((o: any) => o.value);
    sPriceToRemove = asPrices[0];
    console.log("Price", sPriceToRemove);
    this.setState ({bPriceChosen: true, iPriceList: 1});
  }

  addPriceButton: any = async (thisParam: any) => {
    this.setState ({bAddPrice: true});
  }

//  addPriceSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  addPrice: any = async (event: React.FormEvent<HTMLFormElement>) => {
    //    event.preventDefault();
    let sPrice: any = this.refs.refPriceAdd;
    let sDate: any = this.refs.refDateAdd;
    sPrice = sPrice.value;
    sDate = sDate.value;
    let asDateSplit: string[] = sDate.split('/');
    //    if (!sQuery || !sPrice || !sDate || asDateSplit.length !== 3) {
    //      return false;
    //    }
    (this.refs.refPriceAdd as HTMLInputElement).value = "";
    (this.refs.refDateAdd as HTMLInputElement).value = "";
    // turn date into YYYYMMDD
    console.log('sDateSplit:', asDateSplit);
    let sMonth: string = asDateSplit[0].length === 1 ? '0' : '';
    sMonth += asDateSplit[0];
    let sDay: string = asDateSplit[1].length === 1 ? '0' : '';
    sDay += asDateSplit[1];
    let sYMD: string = '20' + asDateSplit[2] + sMonth + sDay;
    console.log('sYMD', sYMD);
    let sQuery: string = oUser.Location;
    sQuery += '&';
    sQuery += sPrice;
    sQuery += '&';
    sQuery += sYMD;
    console.log("sQuery", sQuery);
    let oResult: any = await sendRequest(`/addPrice?q=${sQuery}`, { method: 'GET' }) as unknown as any;
    console.log('Add price result: ', oResult);
    asPricesDates[asPricesDates.length] = sDate + '  ' + sPrice;
    this.setState({ iPriceList: this.state.iPriceList + 1 });
    return true;
  };

  removePrice: any = async (event:React.FormEvent<HTMLFormElement>) => {
      let sQueryParts: string = sPriceToRemove.split('\ ');   // splits to date, price
      let sDate = sQueryParts[0];
      let asDateSplit: string[] = sDate.split ('/');
    // turn date into YYYYMMDD
      console.log ('sDateSplit:', asDateSplit);
      let sMonth: string = asDateSplit[0].length === 1 ? '0' : '';
      sMonth += asDateSplit[0];
      let sDay: string = asDateSplit[1].length === 1 ? '0' : '';
      sDay += asDateSplit[1];
      let sYMD: string = '20' + asDateSplit[2] + sMonth + sDay;
      console.log ('sYMD', sYMD);

      let oResult: any = await sendRequest(`/removePrice?q=${oUser.Location}&${sYMD}`, {method: 'GET'}) as unknown as OUserData;
      console.log ('Remove result: ', oResult);

      if (oResult.n !== 1) {   // should never happen
        console.log ('oResult.n:', oResult.n);
        console.log ('removePrice returning false');
        return false;
      }
      else {
        sPriceToRemove.replace (' ', '');
//      this.props.history.push ("/charts");
        console.log ('To remove:', sPriceToRemove);
        for (let i = 0; i < asPricesDates.length; i++) {
          console.log ('asPricesDates[i]:', asPricesDates[i]);
          if (asPricesDates[i].replace(' ', '') === sPriceToRemove) {
            console.log ("Removing", asPricesDates[i]);
            asPricesDates.splice (i, 1);
            break;
          }
        }
        this.setState ({bPriceChosen: false, iPriceList: this.state.iPriceList + 1});
        return true;
      }
  }
  render() {
//        options.title = "Truck " + this.state.iTruckNum;
    return (<body><div> {this.presentPrices ({...this.state})} </div></body>);
  };

}

