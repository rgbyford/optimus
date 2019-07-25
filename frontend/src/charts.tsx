
import * as React from 'react';
import Header from './components/Header';
import {Chart} from 'react-google-charts';
import { getTruckData } from './public';
import { string } from 'prop-types';
import './static/index.css';
import {OUserData, oUser, aiTruckList} from './App';

let options = {
    title: "Truck data",
//    hAxis: { title: "DoY", viewWindow: { min: 100, max: 225 } },
    hAxis: {format: 'MMM'},
    vAxis: { title: "Amount", viewWindow: { min: 0, max: 600 } },
    legend: "none"
  };
  
let aoGraphData: [any][any] = [["date", "amount"]];

type ChartState = {
    loading: boolean,
    iTruckNum: number,
    bGoButton: boolean,
    iRcds: number
};

const aMonthStarts: number[] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

//let aiTrucks = [3011523, 3011521, 3011522, 3011524, 3011881, 3011878, 3, 2, 1];       // 3,2,1 are the ADMIN trucks

const textStyle = {
  textAlign: 'left' as 'left',
  marginLeft: '45%'
}

let sTruckSearch: any;
let bGoButtonDone: boolean;

export class ChartsPage extends React.Component<{}> {
    state: ChartState;
    
    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            iTruckNum: 0,
            bGoButton: false,
            iRcds: -1   // init to non-zero
        };
    }
    async componentDidMount() {
        bGoButtonDone = false;
    }

    ChooseTruck = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        sTruckSearch = [].filter.call(e.target.options, (o: any) => o.selected).map((o: any) => o.value);
//        this.setState ({bGoButton: true});
        console.log("Truck", sTruckSearch);
//        this.goButton ();       // Did away with the button, so no separate routine
//    }
    
//    goButton = () => async () => {
//    async goButton () {
        let iRcds: number = 0;
        let iTruckNum: number = parseInt (sTruckSearch);
        let aoTruckData: [any] = await getTruckData (iTruckNum);
        console.log("aoTruckData[0]: ", aoTruckData[0]);
        aoGraphData = [["date", "amount"]];
        //console.log('aoGD[0]:', aoGraphData[0]);
        for (let i = 0; i < aoTruckData.length; i++) {
            if (aoTruckData[i].TruckNum === iTruckNum) {    // always will be, except if none found
                let pushArray: any[] = [];
                // have to deal with leap years
//                let iDayOfYear: number = aMonthStarts[parseInt(aoTruckData[i].DateTime.substring(5, 7)) - 1] +
//                parseInt(aoTruckData[i].DateTime.substring(8, 10));
                let sToFormat = aoTruckData[i].DateTime;
                console.log ('YYYY MM DD', sToFormat.substring(0,4), sToFormat.substring(5,7), sToFormat.substring(8,10));
                pushArray[0] = new Date (parseInt (sToFormat.substring(0,4)),
                                         parseInt (sToFormat.substring(5,7)) - 1,
                                         parseInt (sToFormat.substring(8,10)));
//                pushArray[0] = iDayOfYear;
                pushArray[1] = aoTruckData[i].Amount;
                aoGraphData.push(pushArray);
                iRcds++;
                //console.log ('pushArray, iRcds:', pushArray, iRcds);
            }
            // iRcds won't get incrmented if record TruckNum is "None found"
        }
//        if (iRcds > 0) {     // "set" the bar width!
//            for (iRcds; iRcds < 25; iRcds++) {
//                aoGraphData.push ([225 + iRcds, 0]);    // add a "don't show" record
//            }
//        }
        bGoButtonDone = true;
        this.setState({ iTruckNum: iTruckNum, iRcds: iRcds });
        return;
    }

    TruckChart(iTruckNum: number) {
        //console.log ("TruckChart aoGD:", aoGraphData);
        return (
            <Chart
                chartType="ColumnChart"
                data={aoGraphData}
                options={options}
                width="100%"
                height="400px"
                legendToggle
            />
    )};

    presentTrucks(state: any) {
        return (
            <div style={{ textAlign: 'center', margin: '0 20px' }}>
                <strong>
                    {<div><br /><br /><p style={textStyle}>Location: {oUser.Location}</p><br /><br />
                     <select size={10} multiple={false}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.ChooseTruck(e)}>
                                    {aiTruckList.map((value2, index2) => <option key = {index2}> {value2} </option>)}
                    </select></div>
                    }
                    <br></br>
                    <div>{bGoButtonDone && this.state.iRcds > 0 ?
                         this.TruckChart (this.state.iTruckNum) : this.state.iRcds === 0 ?
                          'No data' : ''}</div>
                </strong>
            </div>
        )
    };

//      <div>{this.state.bGoButton ? <button onClick={this.goButton()}>Go</button> : ''}</div>


    render() {
        options.title = "Truck " + this.state.iTruckNum;
        return (<body><div> {this.presentTrucks ({...this.state})} </div></body>);
    };
}
