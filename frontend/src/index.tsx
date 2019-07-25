import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {ChartsPage} from './charts';
import './static/index.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

console.log ("Index!");

ReactDOM.render((
  <BrowserRouter>
   <Switch>
    <Route exact path='/optimus' component={App}/>
    <Route path='/charts' component={ChartsPage}/>
  </Switch>
  </BrowserRouter>
), document.getElementById('root')
);

serviceWorker.unregister();
