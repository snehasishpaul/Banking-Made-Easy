const mongoose = require("mongoose");
const User = require("./models/user");
const Transaction = require("./models/transaction");
const mongoURL =
    "mongodb+srv://banking:bMdmS8GOJiiPBfE3@cluster0.fmh2r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// mongodb://localhost:27017/bankingDb
// bMdmS8GOJiiPBfE3

mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Error!!");
    });

const data = [
    {
        name: "Ramesh",
        email: "ramesh@gmail.com",
        balance: 10000,
    },
    {
        name: "Suresh",
        email: "suresh@gmail.com",
        balance: 20000,
    },
    {
        name: "Kamlesh",
        email: "kamlesh@gmail.com",
        balance: 30000,
    },
    {
        name: "Rupesh",
        email: "rupesh@gmail.com",
        balance: 25000,
    },
    {
        name: "Dharmesh",
        email: "dharmesh@gmail.com",
        balance: 45000,
    },
    {
        name: "Akhilesh",
        email: "akhilesh@gmail.com",
        balance: 50000,
    },
    {
        name: "Rubius",
        email: "rubius@gmail.com",
        balance: 15000,
    },
    {
        name: "Severus",
        email: "severus@gmail.com",
        balance: 70000,
    },
    {
        name: "Albus",
        email: "albus@gmail.com",
        balance: 33000,
    },
    {
        name: "Harry",
        email: "harry@gmail.com",
        balance: 55000,
    },
];

// const transData = [
//     {
//         userID: "asda2d13213dasdawdd",
//         transferID: "dw1231231wgh3g13jhg3",
//         balance: 50000,
//     },
//     {
//         userID: "asda265hyrrt3dasdawdd",
//         transferID: "dw123123rterg13jhg3",
//         balance: 25000,
//     },
// ];

const seeds = async function () {
    try {
        await User.deleteMany({});
        await Transaction.deleteMany({});
        await User.insertMany(data);
        // await Transaction.insertMany(transData);
        console.log("Inserted Successfully");
    } catch (error) {
        console.log("Error!!", error);
    }
};

seeds().then(() => {
    mongoose.connection.close();
});
