import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {Load} from './load';
import {Search} from './search';
import {Help} from './help';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

console.log ("Index!");

ReactDOM.render((
  <BrowserRouter>
   <Switch>
    <Route exact path='/optimus' component={App}/>
    <Route path='/load' component={Load}/>
    <Route path='/search' component={Search}/>
    <Route path='/help' component={Help}/>
  </Switch>
  </BrowserRouter>
), document.getElementById('root')
);

serviceWorker.unregister();
