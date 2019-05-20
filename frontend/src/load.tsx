import React, {createRef} from 'react';
//import socketIOClient from 'socket.io-client';
import io from 'socket.io-client';
//import {Table, Thead, Th, Tr,Td} from 'reactable';
import { getLoadDate } from './public';
import Header from './components/Header';
import ReactDataGrid from 'react-data-grid';

let aoCats: {} = [];
let timerId: number;

type OMod = {
  id: number,
  GivenName: string,
  FamilyName: string,
  "E-mail1-Value": string
};

export function getCats () {
  return (aoCats);
}
const columns = [
  { key: 'GivenName', name: 'GivenName' },
  { key: 'FamilyName', name: 'FamilyName'}
];

/*
interface Props {
  tableData: OMod[];
}
*/

function DupsTable (tableData: { GivenName: string, FamilyName: string }[]) {
    //console.log("Hello World");
    return (<ReactDataGrid
      minWidth = {500}
      columns={columns}
      rowGetter={i => tableData[i]}
      rowsCount={tableData.length}
      enableCellSelect={false}
      minHeight={420} />);
  }
  
//function MyTable (tableData: {GivenName: string, FamilyName: string} []) {
//class MyTable extends React.Component<{tableData: OMod[]}> {
//  render() {
//  console.log ('MyTable length', tableData.length);
//  console.log ('First name: ', tableData[0].GivenName, ' ', tableData[0].FamilyName);
//    return (

      // <Table className = "table">
    //        <Thead>
    //       <Th column="firstName">
    //         <strong className="name-header">First Name</strong>
    //       </Th>
    //       <Th column="lastName">
    //         <strong className="name-header">Last Name</strong>
    //       </Th>
    //     </Thead>
    //     {tableData.map(x=><Tr> <Td column="firstName">{x.GivenName}</Td> <Td column="lastName">{x.FamilyName}</Td></Tr>)}
    //   </Table>
//    );
//  }
//}

type FIProps = {
  bClearDB: boolean,
  bClearCats: boolean
}
type FIState = {
  timeCounter: number,
  response: boolean
}

type MyData = {
  something: string;
}

type LoadProgress = {
  progress: string;
}
type myJson = {
  GivenName: string,
  FamilyName: string
}

let fileName = createRef <HTMLInputElement>();
const tableStyle = {
  margin: 20,
  verticalAlign: 'top',
  display: 'inline-block'
};
let sProgress: string;

class FileInput extends React.Component<FIProps, FIState> {
//  fileInput: any;
  timeCounter: number;
  names: OMod[];
  state: FIState;

  constructor(props: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setState = this.setState.bind(this);
    this.timeCounter = 0;
    this.names = [];
    this.state = {
      timeCounter: 0,
      response: false
    }
   }

  async componentDidMount() {
    console.log("getting socket");
    //    const socket = socketIOClient();
    const socket = io('http://localhost:9900');
    socket.on('news', (data: MyData) => {
      console.log("something received: ", data);
      let jsonRcvd: myJson[] = JSON.parse(data.something);
      //  this.setState (names: []});
      //this.state.names = [];
      for (let i = 0; i < jsonRcvd.length; i++) {
        let oName = {} as OMod;
        oName.id = i;
        oName.GivenName = jsonRcvd[i].GivenName;
        oName.FamilyName = jsonRcvd[i].FamilyName;
        this.names.push(oName);
      }
      //this.state.names = JSON.parse (data.something);
      //console.log ("state.names[1]: ", this.state.names[1]);
      socket.close();
      window.clearInterval(timerId);

      this.setState(prevState => ({
        ...prevState,
        response: true
      }))

      //this.setState({ response: true });
    });

    socket.on ('progress', (value: LoadProgress) => {
      sProgress = value.progress;
      //console.log ('Value: ', value.progress);
    })
  }


  handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileName !== null && fileName.current !== null && fileName.current.files !== null) {
      console.log("load button");
      console.log("props: ", this.props);
      console.log("state: ", this.state);
      let formData = new FormData();
      //let fname_old = this.fileInput.current.files[0].name;
      let file = fileName.current.files[0];
      //let fname: any = fileName.current.files.v[0];
      console.log('fileName: ', fileName);
      console.log('fname: ', file);

      //formData.append("avatar", this.fileInput.current.files[0]);
      formData.append("avatar", file);
      formData.append("clearDB", this.props.bClearDB.toString());
      formData.append("clearCats", this.props.bClearCats.toString());
      if (fileName !== null && fileName.current !== null) {
        formData.append("csv", fileName.current.name.indexOf("csv") > 0 ? 'true' : 'false');
      }
      else {
        formData.append("csv", 'false');
      }

      console.log("formdata: ", formData);

      //initSocket();

      timerId = window.setInterval(() => {
        // function called
        this.timeCounter++;
        this.setState({ timeCounter: this.timeCounter });
      }, 1000);

      var opts = {
        method: "PUT",
        body: formData
      };
      fetch("/contacts/import", opts).then(function (response) {
        return (response.text());
      }).then(function (string) {
        console.log("res: ", string);
        //        $("body").html(string);
        //location.reload(); // essential to refresh the page
      });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input style={{width: "100%"}} accept=".csv, .CSV, .vcf, .VCF" type="file" ref={fileName}/>
        </label>
        <br /><br />
        <button type="submit"><strong>Submit</strong></button>
        <div>
        {this.state.response
          ? <div><p>Loading done.</p>
            <p>Near-duplicates:</p>
            <div style={tableStyle}>{this.names.length > 0 ? DupsTable  (this.names) : ''}</div>
            </div>
          : <p>Loading: {sProgress}%</p>
        }</div>
      </form>
    );
  }
}

export class Load extends React.Component<{}, {bClearDB: boolean, bClearCats: boolean, date: string}> {
  constructor(props: any) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      bClearCats: false,
      bClearDB: false,
      date: ''
    };

//    this.handleClearDB = this.handleClearDB.bind(this);
//    this.handleClearCats = this.handleClearCats.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // static async getInitialProps() {
  // }

  // handleClearDB () {
  //   console.log ("clear DB");
  //   this.setState ({bClearDB: !bClearDB});
  // }

  // handleClearCats () {
  //   console.log ("clear cats");
  //   this.setState ({bClearCats: !bClearCats});
  // }
  async componentDidMount () {
   try {
      console.log ("CDM before gLD call");
      const date = await getLoadDate();
      console.log("CDM:", date);
      this.setState({ // eslint-disable-line
        date: date
      });
      //bCatSelected = false;
    } catch (err) {
//      this.setState({error: err.message || err.toString() }); // eslint-disable-line
    }
  }
  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log ("Input change", event.target.name, event.target.type, event.target.checked);
    this.setState(prevState => ({
      ...prevState,
      [event.target.name]: event.target.checked
    }))
  }
  
  //handleInputChange(event) {
    //    const target = event.target;
    //    const value = target.type === 'checkbox' ? target.checked : target.value;
    //    let name: string = event.target.name;
    //    let bChecked: boolean = event.target.checked;
            //this.setState({
              //  [name]: bChecked
              //});

  render() {
    //const { list } = this.props;
    let buttonStyle = {width: "16px", height: "16px"};

    return (
      <strong>
      <div style={{  margin: '0 20px' }}>
        {Header ()}
        <style>{`
      body {
        background-image: url("/static/media/oriental.png");
      }
      `}</style>
        <br /><br />
        <h2 style={{ textAlign: 'left' }}>Load contacts (last loaded {this.state.date})</h2>
        <form>
         <label>Empty the database before loading: <input
            style={buttonStyle}
            name="bClearDB"
            type="checkbox"
            checked={this.state.bClearDB}
            onChange={this.handleInputChange} />
         </label>
         <br /><br />
         <label>Rebuild the categories file: <input
            style={buttonStyle}
            name="bClearCats"
            type="checkbox"
            checked={this.state.bClearCats}
            onChange={this.handleInputChange} />
         </label>
         <br /><br />
        </form>
        <FileInput bClearDB={this.state.bClearDB} bClearCats={this.state.bClearCats} />
        </div>
        </strong>
    );
  }
}

// export {LoadPage, getCats;
