import googleSheets from "./googleSheets";

googleSheets
  .connect()
  .then((res) => console.log("google sheet is connected..."))
  .catch((err) => console.log(err.message));
