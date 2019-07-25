import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import ReactGA from 'react-ga';
import {Button} from '@material-ui/core';
import { sendRequest, getTruckList } from './public';
import './App.css';
import './static/style.css';

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

export var oUser: OUserData;

 export interface AppState {
   error: string;
   bLoggedIn: boolean;
   bChangedPassword: boolean;
//   refEmail: any;
//   refPassword: any;
 };

const Charts =  (props: any) => <Link to="/charts" {...props} />

export var aiTruckList: number[];

class App extends React.Component<RouteComponentProps, AppState> {
  state: AppState;

  constructor(props: any) {
    super(props);
    this.loginFormSubmit = this.loginFormSubmit.bind(this);
    this.state = {
      error: '',
      bLoggedIn: false,
      bChangedPassword: false
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
      this.setState ({bLoggedIn:true});
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
      oUser = await sendRequest(`/newPassword?q=${sQuery}`, {method: 'GET'}) as unknown as OUserData;
      console.log ('Login result: ', oUser);
      if ((oUser.Email === undefined) || (oUser.Email === "")) {   // just to be sure!
        return false;
      }
      else {
//      this.props.history.push ("/charts");
        this.setState ({bChangedPassword:true});
        return true;
      }
    }
    else {
      window.confirm ("Passwords must be the same");
    }

  }
  
  public render() {
    return (
      <div>
        <title>Optimus</title>
        <meta name="description" content="" />
        <h1>Optimus</h1>
        <div id='w3'>
          <div id='signin-form profile'>
            <h3>Login</h3>
            <div id='login-form'>
              <form onSubmit={this.loginFormSubmit}>
                <input type="text" name="logemail" ref="refEmail" placeholder="E-mail" required={true}></input>
                  <input type="password" name="logpassword" ref='refPassword' placeholder="Password" required={true}></input>
                    <div id='tp'>
                      <input type="submit" value="LOGIN NOW"></input>
						        </div>
					    </form>
              <div>{this.state.bLoggedIn  && !this.state.bChangedPassword ?
                 <form onSubmit={this.changePassword}>
                 <h4>Change password:</h4>
                   <div>
                   <input type="password" name='newPass1' ref='refNewPass1' placeholder='New password' required={true}></input>
                   <input type="password" name='newPass2' ref='refNewPass2' placeholder='Confirm' required={true}></input>
                   <input type= 'submit'></input>
                   </div>
                </form>
                : ''}
              </div>
              <div>{this.state.bLoggedIn ? 
                <Button component = {Charts} variant='contained'>Charts</Button>
                : ''}
              </div>
              </div>
				    </div>
			    </div>
        </div>
      );
  }
}


export default App;
