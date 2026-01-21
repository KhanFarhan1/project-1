const mongoose = require("mongoose");
const Mong_URL = "mongodb://127.0.0.1:27017/Project_1";
const listening = require("../model/listening.js");
const initdata = require("./data.js");
main()
  .then(() => {
    console.log("Database is working");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(Mong_URL);
}

const initdbs = async () => {
  await listening.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "695ec309c34aadc5f477f7ac",
  }));
  await listening.insertMany(initdata.data);
  console.log("Done");
};

initdbs();
