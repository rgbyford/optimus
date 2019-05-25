import 'isomorphic-fetch';

const dev = false;
//const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3600;
const ROOT_URL = dev ? `http://localhost:${port}` : 'http://tobycontacts.ddns.net';
//const ROOT_URL = `http://localhost:${port}`;
//const ROOT_URL = '';
console.log (`NODE_ENV: ${process.env.NODE_ENV} dev: ${dev}`);

async function sendRequest(path: string, options = {}) {
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

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }
  console.log("sR got data: ", data);
  return data;
}

export async function getList () {
  console.log ("getList: /categories");
  return await sendRequest('/categories', {
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