const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_db = "mongodb://127.0.0.1:27017/wonderlust";

async function main() {
    await mongoose.connect(mongo_db);
    console.log("connected to db");
}

main().catch(err => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "68f910a4a222ac3c93c7528e" }));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
};

initDB();