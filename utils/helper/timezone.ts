import axios from "axios";
import HttpsProxyAgent from "https-proxy-agent";

function timezone(proxy: string): Promise<string> {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: "https://lumtest.com/myip.json",
      httpsAgent: new (HttpsProxyAgent as any)(proxy),
    })
      .then((res: any) => {
        console.log(res.data?.geo?.tz);
        resolve(res.data?.geo?.tz);
      })
      .catch((err: any) => {
        console.log(err.message);
        reject(err.message);
      });
  });
}

const helper = {
  timezone,
};

export default helper;
