import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {Load} from './load';
import {Search} from './search';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

console.log ("Index!");

ReactDOM.render((
  <BrowserRouter>
  <Switch>
    <Route exact path='/' component={App}/>
    <Route path='/load' component={Load}/>
    <Route path='/search' component={Search}/>
  </Switch>
  </BrowserRouter>
), document.getElementById('root')
);

//    <App />

//const bodyStyle = {
//  backgroundImage: {bodyBkgd}
//};
//      {document.body.style.backgroundImage = bodyBkgd}

// function Body () {
//     return (
//       <div>
//         <App />
//       </div>
//     );
// }

// ReactDOM.render(
//   <Body />,
//   document.getElementById('root') as HTMLElement
// );

serviceWorker.unregister();
