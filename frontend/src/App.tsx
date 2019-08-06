import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import ReactGA from 'react-ga';
//import {Button} from '@material-ui/core';
import { sendRequest, getTruckList, getUserList, getBioPrices } from './public';
import './App.css';
import './static/style.css';
import './static/index.css';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import  Col from 'react-bootstrap/Col';

ReactGA.initialize('UA-141951386-1');
ReactGA.pageview(window.location.pathname + window.location.search);

// this from the database
export type OUserData = {
    _id: string;
    Email: string;
    Location: string;
    Password: string;
    Hash: string;
};

const textStyle = {
  textAlign: 'left' as 'left',
  marginLeft: '5%'
};

const inputStyle = {
  width: '200px'
};
//  float: 'right' as 'right'

const headingStyle = {
  fontWeight: 700
};

const h2Style = {
  fontSize: '25px',
  fontWeight: 700
};

const headingInlineBlockStyle = {
  fontWeight: 700,
  display: 'inline-block'
};

const buttonStyle = {
  marginLeft: '1%'
};

const leftMargin = {
 marginLeft: "10%"
};

const leftMarginButton = {
  width: '80px',
  marginLeft: "10px"
};

export var oUser: OUserData;

 export interface AppState {
   error: string;
   bLoggedIn: boolean;
   bChangedPassword: boolean;
   bSuperUser: boolean;
   iUserList: number;       // 0 don't draw, 1 create, 2 redraw
   bUserChosen: boolean;
   bAddUser: boolean;
   bChangePasswordButton: boolean;
//   refEmail: any;
//   refPassword: any;
 };

//const Charts =  (props: any) => <Link to="/charts" {...props} />
let asUserEmail: string[];
let sUserToRemove: any;

export var aiTruckList: number[];

class App extends React.Component<RouteComponentProps, AppState> {
  state: AppState;

  constructor(props: any) {
    super(props);
    this.loginFormSubmit = this.loginFormSubmit.bind(this);
    this.state = {
      error: '',
      bLoggedIn: false,
      bChangedPassword: false,
      bSuperUser: false,
      iUserList: 0,
      bUserChosen: false,
      bAddUser: false,
      bChangePasswordButton: false,
//      refEmail: React.createRef(),
//      refPassword: React.createRef()
    }
  }

  loginFormSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
//    let sQuery: any = this.state.refEmail;
    let sQuery: any = this.refs.refEmail;
    let sPassword: any = this.refs.refPassword;
    sQuery = sQuery.value;
    sPassword = sPassword.value;
    console.log ('sQuery sPassword: ', sQuery.value, sPassword.value);
    if (!sQuery || !sPassword) {
      return false;
    }
    sQuery += '&';
    sQuery += sPassword;
    oUser = await sendRequest(`/login?q=${sQuery}`, {method: 'GET'}) as unknown as OUserData;
    console.log ('Login result: ', oUser);
    if ((oUser.Email === undefined) || (oUser.Email === "")) {   // just to be sure!
      return false;
    }
    else {
//      this.props.history.push ("/charts");
      let oTruckList = await getTruckList (oUser.Location) as unknown as {aoFound: number[]};
      aiTruckList = oTruckList.aoFound; // ao because that's what sendRequest gets
      console.log ('aiTruckList:', aiTruckList);
      let bSU = oUser.Location === 'any' ? true : false;  // can't figure how to do ternary in setState
      this.setState ({bSuperUser: bSU, bLoggedIn: true});
      console.log ('After setState');
      return true;
    }
  };

//        <Header />  just after the first div
/*
//                <input type="text" name="logemail" ref={this.state.refEmail} placeholder="E-mail" required={true}></input>
// </div><div>{oSrch.bNext ? <button onClick={this.nextButton(index1)}>Select</button> : ''}</div>
*/

  changePassword = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let sQuery: string;
    let sNewPass1: any = this.refs.refNewPass1;
    sNewPass1 = sNewPass1.value;
    let sNewPass2: any = this.refs.refNewPass2;
    sNewPass2 = sNewPass2.value;

    if (sNewPass2 === sNewPass1) {
      sQuery = oUser.Email;
      sQuery += '&';
      sQuery += sNewPass1;
      let sEmail: string = await sendRequest(`/newPassword?q=${sQuery}`, {method: 'GET'}) as unknown as string;
      console.log ('Change password result: ', sEmail);
      if (sEmail === undefined || sEmail === '') {   // just to be sure!
        console.log ("cP result undefined or empty!")
        return false;
      }
      else {
        console.log ('setting bCP true');
//      this.props.history.push ("/charts");
        this.setState ({bChangedPassword:true});
        return true;
      }
    }
    else {
      window.confirm ("Passwords must be the same");
    }

  }
//              <button onClick={this.removeUsersButton() as any}>Remove user</button> : ''}</div>
//              <form onSubmit={this.removeUsersButton}>
//                <input type='submit'>Remove user</input>
//              </form>
  changePasswordButton: any = async (thisParam: any) => {
    this.setState ({bChangePasswordButton: true});
  }

  // --------------------- USER ----------------------------------
    addUserButton: any = async (thisParam: any) => {
    this.setState ({bAddUser: true});
  }

  addUserSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
//    let sQuery: any = this.state.refEmail;
    let sQuery: any = this.refs.refEmailAdd;
    let sPassword: any = this.refs.refPasswordAdd;
    let sLocation: any = this.refs.refLocationAdd;
    sQuery = sQuery.value;
    sPassword = sPassword.value;
    sLocation = sLocation.value;
    console.log ('sQuery sPassword sLocation: ', sQuery.value, sPassword.value, sLocation.value);
    if (!sQuery || !sPassword || !sLocation) {
      return false;
    }
    sQuery += '&';
    sQuery += sPassword;
    sQuery += '&';
    sQuery += sLocation;
    let oResult: OUserData = await sendRequest(`/addUser?q=${sQuery}`, {method: 'GET'}) as unknown as OUserData;
    console.log ('Add user result: ', oResult); 
    return true;
  };

  removeUsersButton: any = async (thisParam: any) => {
//    event.preventDefault();
    asUserEmail = [];
    let oUsers: any = await getUserList ();
    console.log ('Users:', oUsers.aoFound);
    for(let i = 0; i < oUsers.aoFound.length; i++) {
      asUserEmail[i] = oUsers.aoFound[i].Email;
    }
    this.setState ({iUserList: 1});
  }

  removeUser: any = async (event:React.FormEvent<HTMLFormElement>) => {
      let sQuery: string = sUserToRemove;
      let oResult: any = await sendRequest(`/removeUser?q=${sQuery}`, {method: 'GET'}) as unknown as OUserData;
      console.log ('Remove result: ', oResult);

      if (oResult.ok !== 1) {   // should never happen
        console.log ('oResult.ok:', oResult.ok);
        console.log ('removeUser returning false');
        return false;
      }
      else {
//      this.props.history.push ("/charts");
        console.log ('To remove:', sUserToRemove);
        for (let i = 0; i < asUserEmail.length; i++) {
          console.log ('asUserEmail[i]:', asUserEmail[i]);
          if (asUserEmail[i] === sUserToRemove) {
            console.log ("Removing", asUserEmail[i]);
            asUserEmail.splice (i, 1);
            break;
          }
        }
        this.setState ({bUserChosen: false, iUserList: 2});   // 2 means redraw
        return true;
      }
  }

  presentUsers(state: any) {
    return (
      <div style={{ textAlign: 'center', margin: '0 20px' }}>
        <strong>
          {<div><h3 style={headingStyle}>Remove user:</h3><br />
            <select size={10} multiple={false}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.ChooseUser(e)}>
              {asUserEmail.map((value2, index2) => <option key={index2}> {value2} </option>)}
            </select></div>
          }
          <br></br>
        </strong>
        <div>{this.state.bUserChosen ? <button onClick={() => this.removeUser(this)}>Remove</button> : ''}</div>
      </div>
    )
    };

  ChooseUser = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    let asUsers: string[] = [].filter.call(e.target.options, (o: any) => o.selected).map((o: any) => o.value);
    sUserToRemove = asUsers[0];
    console.log("User", sUserToRemove);
    this.setState ({bUserChosen: true, iUserList: 1});
  }


  refreshPage: any = ()=> {
    console.log ('Refreshing page');
      this.setState ({
      error: '',
      bLoggedIn: true,
      bChangedPassword: false,
      bSuperUser: false,
      iUserList: 0,
      bUserChosen: false,
      bAddUser: false,
      bChangePasswordButton: false
//      refEmail: React.createRef(),
//      refPassword: React.createRef()
    });

//    window.location.reload ();
  }

  public render() {
    return (
      <div>
        <title>Optimus</title>
        <meta name="description" content="" />
        <h1>Optimus</h1>
        <div style={leftMargin}>
          <div id='signin-form profile'>
            <div>{!this.state.bLoggedIn ?
            <div>
              <h2 style={h2Style}>Login</h2>
              <form onSubmit={this.loginFormSubmit}>
                <br />
                <div id='label-style'>E-mail: </div>
                <input style={inputStyle} type="text" name="logemail" ref="refEmail" placeholder="E-mail" required={true}></input>
                <br />
                <div id='label-style'>Password: </div>
                <input style={inputStyle} type="password" name="logpassword" ref='refPassword' placeholder="Password" required={true}></input>
                <br />
                <div id='tp'>
                  <input style={buttonStyle} type="submit" value="Login"></input>
                </div>
              </form></div>
              : ''}
            </div>
            <Container>
              <Row>
                <Col sm={3} md={2} lg={2}>
                  <div>{this.state.bLoggedIn && !this.state.bChangedPassword &&
                    this.state.bChangePasswordButton && this.state.iUserList === 0 ?
                    <form onSubmit={this.changePassword}>
                      <h2 style={h2Style}>Change password:</h2>
                      <br />
                      <div>
                        <div id='label-style'>New password:</div>
                        <input type="password" name='newPass1' ref='refNewPass1' placeholder='New password' required={true}></input>
                        <div id='label-style'>Confirm:</div>
                        <input type="password" name='newPass2' ref='refNewPass2' placeholder='Confirm' required={true}></input>
                        <input type='submit'></input>
                      </div>
                    </form>
                    : ''}
                  </div>
                </Col>
              </Row>
            </Container>
            <div>{this.state.bLoggedIn && !this.state.bAddUser &&
             !this.state.bChangePasswordButton && this.state.iUserList === 0 ?
              <div><button onClick={() => this.changePasswordButton(this)}>Change password</button>
              </div>
              : ''}
            </div>
            <div>{this.state.bLoggedIn && !this.state.bAddUser && !this.state.bChangePasswordButton && this.state.bSuperUser && this.state.iUserList === 0 ?
              <div><button onClick={() => this.removeUsersButton(this)}>Remove user</button>
                <button onClick={() => this.addUserButton(this)}>Add user</button></div>
              : ''}</div>
            <div>{this.state.bAddUser ?
              <form onSubmit={this.addUserSubmit}>
              <h2 style={headingStyle}>Add user:</h2>
                <div id='label-style'>E-mail:</div>
                <input type="text" name="logemail" ref="refEmailAdd" placeholder="E-mail" required={true}></input>
                <div id='label-style'>Location:</div>
                <input type="text" name="loglocation" ref="refLocationAdd" placeholder="Location" required={true}></input>
                <div id='label-style'>Password:</div>
                <input type="password" name="logpassword" ref='refPasswordAdd' placeholder="Password" required={true}></input>
                <div id='tp'>
                  <input type="submit" value="Add user"></input>
                </div>
              </form>
              : ''}
            </div>
            <br />
            <div>{this.state.bLoggedIn ?
              <div>
                <LinkContainer to="/charts">
                  <Button>Charts</Button>
                </LinkContainer>
                <LinkContainer to="/prices">
                  <Button>Bio prices</Button>
                </LinkContainer>
                {'   '}
                {this.state.iUserList > 0 || this.state.bChangePasswordButton ?
                    <Button onClick={() => this.refreshPage()}>Back</Button>
                 : ''}
              </div>
              : ''}
            </div>
          </div>
          <div> {this.state.iUserList > 0 ? this.presentUsers({ ...this.state }) : ''} </div>
        </div>
      </div>
      );
  }
}

              // <div>{this.state.bLoggedIn && !this.state.bSuperUser && this.state.iPriceList === 0 ?
              // <div><button onClick={() => this.bioPricesButton(this)}>Bio prices</button></div>
              // : ''}</div>


//               <Button component={Charts} variant='contained'>Charts</Button>
export default App;
