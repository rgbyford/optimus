import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {ChartsPage} from './charts';
import {PricesPage} from './Prices';
import './static/index.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

console.log ("Index!");

const handleSaveToPC = (jsonData: any) => {
  const fileData = JSON.stringify(jsonData);
  const blob = new Blob([fileData], {type: "text/plain"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'filename.json';
  link.href = url;
  link.click();
}

//handleSaveToPC ("text");

ReactDOM.render((
  <BrowserRouter>
   <Switch>
    <Route path='/optimus' component={App}/>
    <Route path='/charts' component={ChartsPage}/>
    <Route path='/prices' component={PricesPage}/>
  </Switch>
  </BrowserRouter>
), document.getElementById('root')
);

serviceWorker.unregister();
