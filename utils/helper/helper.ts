import "dotenv/config";

import axios from "axios";
import * as fs from "fs";
import HttpsProxyAgent from "https-proxy-agent";
import * as path from "path";

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isIDValid(username: string) {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: `https://old.reddit.com/user/${username}`,
      httpsAgent: new (HttpsProxyAgent as any)({
        host: process.env.PROXY_HOST,
        port: 20000,
        auth: `${process.env.PROXY_USERNAME}:${process.env.PROXY_PASSWORD}`,
      }),
    })
      .then((res) => {
        resolve("valid");
      })
      .catch((err) => {
        reject(err.message);
      });
  });
}

function getUserName(proxy: string): Promise<string> {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: "https://www.reddit.com/api/v1/generate_username.json",
      httpsAgent: new (HttpsProxyAgent as any)(proxy),
    })
      .then((res) => {
        const rIndex = randomNumber(0, res.data?.usernames?.length - 1);
        resolve(res.data?.usernames[rIndex]);
      })
      .catch((err: any) => reject(err.message));
  });
}

function passGen(): string {
  const passName = fs
    .readFileSync(path.resolve(__dirname, "./pass.txt"))
    .toString()
    .split("\n");

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const rIndex = randomNumber(0, passName?.length - 1);
  const d = new Date();

  const rPassName = passName[rIndex].replace(/ /g, "-");

  let password = "";

  if (rIndex % 2 === 0) {
    password = `${rPassName}@@${month[d.getMonth()]}-${d.getDate()}`;
  } else {
    password = `${rPassName}##${month[d.getMonth()]}-${d.getDate()}`;
  }

  if (password.length < 8) {
    password += "69";
  }

  return password;
}

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

export const helper = {
  getUserName,
  timezone,
  passGen,
  randomNumber,
  isIDValid,
  sleep,
};
