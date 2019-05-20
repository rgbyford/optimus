import * as React from 'react';
import './App.css';
import Header from './components/Header';

 export interface AppState {
   error: string;
 }

class App extends React.Component<{}, AppState> {
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
}

export default App;
