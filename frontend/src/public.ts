import 'isomorphic-fetch';
import { OUserData } from './App';

const dev = false;
//const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3600;
const ROOT_URL = dev ? `http://localhost:${port}` : 'http://tobycontacts.ddns.net/optimus';
//const ROOT_URL = `http://localhost:${port}`;
//const ROOT_URL = '';
console.log (`NODE_ENV: ${process.env.NODE_ENV} dev: ${dev}`);
/*
export async function sendLoginRequest(path: string) {
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
  };

  console.log (`sLR: ${ROOT_URL}${path}`);
  const response = await fetch(
    encodeURI (`${ROOT_URL}${path}`),
    Object.assign({
      method: 'POST',
      credentials: 'include'
    }, {
      headers
    }, {method: 'GET'})
  );
  console.log ('sLR: ', response);
  return response.ok;   // true = good login

}
*/

export async function sendRequest(path: string, options = {}) {
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
  };

  console.log (`sR: ${ROOT_URL}${path}`);
  const response = await fetch(
    encodeURI (`${ROOT_URL}${path}`),
    Object.assign({
      method: 'POST',
      credentials: 'include'
    }, {
      headers
    }, options)
  );
  let oData: {};
  console.log ('sR response: ', response);
  if (response.status === 200) {
    oData = await response.json();
    console.log("sR got data: ", oData);
  }
  else {
    oData = {};
  }
  console.log('sR returning data');
  return oData;
}

export async function getTruckList (sLocation: string) {
  console.log ('getTruckList');
  return await sendRequest(`/listTrucks?q=${sLocation}`, {
    method: 'GET',
  });
}

export async function getLoadDate () {
  console.log ("getLoadDate");
  return await sendRequest('/loadDate', {
    method: 'GET',
  });
}

export async function getContacts (asSearchStrings: string[]) {
  console.log ("getContacts: /contacts");
  let sQuery = '';
  let i;
  console.log ('asSS: ', asSearchStrings);
  for (i = 0; i < asSearchStrings.length - 1; i++) {
    console.log ('string build: ', i, asSearchStrings[i]);
    sQuery += asSearchStrings[i];
    sQuery += '@';
  }
  sQuery += asSearchStrings[i];
  console.log ('string finish: ', i, asSearchStrings[i]);
  
  return await sendRequest(`/contacts?q=${sQuery}`, {
//    body: JSON.stringify ({'search': asSearchStrings}),
    method: 'GET'
  });
}

export async function getTruckData(iTruckNum: number) {
  console.log("getTruckData: /truck");
  let sQuery = '';
  console.log('iTN: ', iTruckNum);
  sQuery += iTruckNum.toString();
  //  console.log ('string finish: ', iTruckNum);

  const dbData: any = await sendRequest(`/truck?q=${sQuery}`, {
    //    body: JSON.stringify ({'search': asSearchStrings}),
    method: 'GET'
  });
  //console.log('dbData:', dbData);
  return (dbData.aoFound);    // aoFound object name set by backend
}