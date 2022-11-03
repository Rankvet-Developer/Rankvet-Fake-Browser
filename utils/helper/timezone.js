const HttpsProxyAgent = require("https-proxy-agent");
const axios = require("axios");

function timezone(proxy){
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: "https://lumtest.com/myip.json",
        httpsAgent:  new HttpsProxyAgent(proxy),
      })
        .then((res) => {
          console.log(res.data?.geo?.tz);
          resolve(res.data?.geo?.tz);
        })
        .catch((err) => {
          console.log(err.message);
          reject(err.message);
        });
    });
}

const helper = {
    timezone
}

module.exports = helper;