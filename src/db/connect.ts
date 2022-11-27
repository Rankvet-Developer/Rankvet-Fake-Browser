import { connect } from "mongoose";

connect(process.env.MONGO_URL as string)
  .then((_) => console.log("database connected"))
  .catch((err) => err.message);
