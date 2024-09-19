var apiserver_hostname;

function isLocalHost(url) {
  return url.indexOf('localhost') !== -1 || url.indexOf('127.0.0.1') !== -1 || url.indexOf('192.') !== -1;
}

console.log("[GlobalProvider] process.env.NODE_ENV: " + process.env.NODE_ENV)

function isWebpackHotUpdate(){
  if (process.env.NODE_ENV === 'development') {
    return true;
  }else{
    return false;
  }
}

if (isWebpackHotUpdate() == true) {
  apiserver_hostname = "https://ecoprosvet-backend.onrender.com";
  console.log("[GlobalProvider] Serving trough LOCAL (DEV) backend all further requests...")
} else {
  apiserver_hostname = "https://ecoprosvet-backend.onrender.com";
  console.log("[GlobalProvider] Serving trough PRODUCTION backend all further requests...")
}

const data = {
  api: {
    hostname: apiserver_hostname
  },
  language: {
    currentlang: "ru"
  }
}

export default data;