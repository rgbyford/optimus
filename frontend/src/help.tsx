
import * as React from 'react';
import Header from './components/Header';
import {Chart} from 'react-google-charts';
import { getTruckData } from './public';
import { string } from 'prop-types';

let options = {
    title: "Truck data",
    hAxis: { title: "DoY", viewWindow: { min: 100, max: 220 } },
    vAxis: { title: "Amount", viewWindow: { min: 0, max: 500 } },
    legend: "none"
  };
 
  
let aoGraphData: [any][any] = [["date", "amount"]];

type ChartState = {
    loading: boolean,
    iTruckNum: number
};

const aMonthStarts: number[] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

let aiTrucks = [3011523, 3011521, 3011522, 3011524, 3011881, 3011878, 3, 2, 1];       // 3,2,1 are the ADMIN trucks

const textStyle = {
  textAlign: 'left' as 'left',
  marginLeft: '45%'
}

let sTruckSearch: any;
let bGoButton: boolean;
let bGoButtonDone: boolean;

export class Help extends React.Component<{}> {
    state: ChartState;
    
    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            iTruckNum: 0
        };
    }
    async componentDidMount() {
        bGoButtonDone = false;
        bGoButton = false;

        /*    
        let aoTruckData: [any] = await getTruckData(this.state.iTruckNum);
        console.log("aoTruckData[0]: ", aoTruckData[0]);
        //console.log('aoGD[0]:', aoGraphData[0]);
        for (let i = 0; i < aoTruckData.length; i++) {
            if (aoTruckData[i].TruckNum === this.state.iTruckNum) {
                // have to deal with leap years
                let pushArray: number[] = [];
                let iDayOfYear: number = aMonthStarts[parseInt(aoTruckData[i].DateTime.substring(5, 7)) - 1] +
                    parseInt(aoTruckData[i].DateTime.substring(8, 10));
                pushArray[0] = iDayOfYear;
                pushArray[1] = aoTruckData[i].Amount;
                aoGraphData.push(pushArray);
                //console.log ('aoGD[' + (i+ 1) + ']:' + aoGraphData[i + 1]);
            }
        }
        */
    }

    AddTruck = (e: React.ChangeEvent<HTMLSelectElement>) => {
        sTruckSearch = [].filter.call(e.target.options, (o: any) => o.selected).map((o: any) => o.value);
        bGoButton = true;
        console.log("Truck", sTruckSearch);
    }
    
    goButton = () => async () => {
        let iTruckNum: number = parseInt (sTruckSearch);
        let aoTruckData: [any] = await getTruckData (iTruckNum);
        console.log("aoTruckData[0]: ", aoTruckData[0]);
        //console.log('aoGD[0]:', aoGraphData[0]);
        for (let i = 0; i < aoTruckData.length; i++) {
            if (aoTruckData[i].TruckNum === iTruckNum) {
                // have to deal with leap years
                let pushArray: number[] = [];
                let iDayOfYear: number = aMonthStarts[parseInt(aoTruckData[i].DateTime.substring(5, 7)) - 1] +
                parseInt(aoTruckData[i].DateTime.substring(8, 10));
                pushArray[0] = iDayOfYear;
                pushArray[1] = aoTruckData[i].Amount;
                aoGraphData.push(pushArray);
            }
        }
        bGoButtonDone = true;
        this.setState ({iTruckNum: iTruckNum});
        return;
    }

    TruckChart(iTruckNum: number) {
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
                    {<div><p style={textStyle}>Select one:</p>
                     <select size={10} multiple={false}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.AddTruck(e)}>
                                    {aiTrucks.map((value2, index2) => <option key = {index2}> {value2} </option>)}
                    </select></div>
                    }
                    <div>{bGoButton ? <button onClick={this.goButton()}>Go</button> : ''}</div>

                    <br></br>
                    <div>{bGoButtonDone ? this.TruckChart (this.state.iTruckNum) : ''}</div>
                </strong>
            </div>
        )
    };


    render() {
        options.title = "Truck " + this.state.iTruckNum;
        return (<div> {this.presentTrucks ({...this.state})} </div>);
    };
}
