const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
const Transaction = require("./models/transaction");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const { urlencoded } = require("express");
const { parse } = require("path");

const MongoStore = require("connect-mongo");

const mongoUrl =
    "mongodb+srv://banking:bMdmS8GOJiiPBfE3@cluster0.fmh2r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const mongoLocalUrl = "mongodb://localhost:27017/bankingDb";

// mongodb://localhost:27017/bankingDb
// bMdmS8GOJiiPBfE3

// https://afternoon-tundra-78433.herokuapp.com/ | https://git.heroku.com/afternoon-tundra-78433.git

// https://fast-fjord-48882.herokuapp.com/ | https://git.heroku.com/fast-fjord-48882.git

mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Error!!", err);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const store = MongoStore.create({
    mongoUrl: mongoUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: "bankingsession",
    },
});

store.on("error", function (err) {
    console.log("Session Store Error", err);
});

const sessionConfig = {
    store,
    name: "session",
    secret: "bankingsession",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionConfig));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.send("Hello");
});

app.get("/banking", (req, res) => {
    res.render("index");
});

app.get("/banking/show", async (req, res) => {
    const users = await User.find({});
    res.render("show", { users, message: req.flash("success") });
});

app.patch("/banking/:id", async (req, res) => {
    const { id } = req.params;
    const { transferID, transferBalance } = req.body;
    let userAcc = await User.findById(id);
    let transferAcc = await User.findById(transferID);
    if (userAcc.balance < transferBalance) {
        req.flash("error", "Not Enough Money to Transfer!");
        res.redirect(`/banking/${id}`);
    } else {
        userAcc = await User.findByIdAndUpdate(
            id,
            { balance: parseInt(userAcc.balance) - parseInt(transferBalance) },
            { new: true, runValidators: true }
        );

        transferAcc = await User.findById(transferID);
        transferAcc = await User.findByIdAndUpdate(
            transferID,
            {
                balance:
                    parseInt(transferAcc.balance) + parseInt(transferBalance),
            },
            { new: true, runValidators: true }
        );

        const transaction = new Transaction({
            userID: id,
            transferID,
            balance: transferBalance,
        });

        await transaction.save();
        req.flash("success", "Successfull Transaction!");
        res.redirect("/banking/show");
    }
});

app.get("/banking/transaction", async (req, res) => {
    const transactions = await Transaction.find({});
    res.render("transaction", { transactions });
});

app.get("/banking/:id", async (req, res) => {
    const { id } = req.params;
    const users = await User.findById(id);
    res.render("user", { users });
});

const port = process.env.PORT || 80; //default for heroku

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
