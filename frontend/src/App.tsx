//import axios from "axios";
import * as React from 'react';
import './App.css';
import * as session from './session';
//import logo from './logo.svg';
import Header from './components/Header';
//import bodyBkgd from './oriental.png';

export interface AppState {
  email: string;
  password: string;
  isRequesting: boolean;
  isLoggedIn: boolean;
  //data: App.Item[];
  error: string;
}

class App extends React.Component<{}, AppState> {
  public state = {
    email: "",
    password: "",
    isRequesting: false,
    isLoggedIn: false,
    //data: [],
    error: ""
  };

  public componentDidMount() {
    this.setState({ isLoggedIn: session.isSessionValid() });
  }

//      <div className="App">
//      <div style={{ padding: '10px 45px' }}>

  public render() {
    return (
      <div>
            <Header/>
            <title>Prodigium</title>
            <meta name="description" content="" />
          <h1>Prodigium Contact Search</h1>
        </div>
      );
  }

  private notUsed() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-error">{this.state.error}</div>
        {this.state.isLoggedIn ? (
          <div className="App-private">
            <div>
              Server test data:
            </div>
            <button disabled={this.state.isRequesting} onClick={this.getTestData}>Get test data</button>
            <button disabled={this.state.isRequesting} onClick={this.logout}>Log out</button>
          </div>
        ) : (
          <div className="App-login">
            (try the credentials: testuser@email.com / my-password)
            <input
              disabled={this.state.isRequesting}
              placeholder="email"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: e.target.value })}
            />
            <input
              disabled={this.state.isRequesting}
              placeholder="password"
              type="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: e.target.value })}
            />
            <button disabled={this.state.isRequesting} onClick={this.handleLogin}>Log in</button>
          </div>
        )}
      </div>
    );
  }

//  const response = await axios.post<{ token: string; expiry: string }>("/api/users/login", { email, password });
//  const { token, expiry } = response.data;
//  session.setSession(token, expiry);

  private handleLogin = async (): Promise<void> => {
    //const { email, password } = this.state;
    try {
      this.setState({ error: "" });
      this.setState({ isRequesting: true });
      this.setState({ isLoggedIn: true });
    } catch (error) {
      this.setState({ error: "Something went wrong" });
    } finally {
      this.setState({ isRequesting: false });
    }
  };

  private logout = (): void => {
    session.clearSession();
    this.setState({ isLoggedIn: false });
  };

  private getTestData = async (): Promise<void> => {
    try {
      this.setState({ error: "" });
    } catch (error) {
      this.setState({ error: "Something went wrong" });
    } finally {
      this.setState({ isRequesting: false });
    }
  }
}

export default App;
