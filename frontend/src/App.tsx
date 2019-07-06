import * as React from 'react';
import './App.css';
import Header from './components/Header';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-141951386-1');
ReactGA.pageview(window.location.pathname + window.location.search);

 export interface AppState {
   error: string;
 }

class App extends React.Component<{}, AppState> {
  public render() {
    return (
      <div>
            <Header/>
            <title>Optimus</title>
            <meta name="description" content="" />
          <h1>Optimus</h1>
        </div>
      );
  }
}

export default App;
