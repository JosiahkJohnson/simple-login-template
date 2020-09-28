//this section allows the server to recognize if it's running under development or production enviornment
//loading this library is not needed when under production
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
};

//library imports
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

//temp array to store our users
const users = [];

//from other files
const initializePassport = require("./config/passport-config");
initializePassport(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);


//our javaScript that can contain html features
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//home page for the application
//get the index page
app.get("/", isAuthenticated, (req, res) => {
    res.render("index.ejs", { name: req.user.name });
});

//login page for the application
//and related routes
//get the login page
app.get("/login", notAuthenticated, (req, res) => {
    res.render("login.ejs");
});

//post a login request route
app.post("/login", notAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    successMessage: "login successful",
    failureRedirect: "/login",
    failureFlash: true
})
);

//register page for application
//and related routes
//get the register page
app.get("/register", notAuthenticated, (req, res) => {
    res.render("register.ejs");
});

//post a register request route
app.post("/register", async (req, res) => {
    try {
        //create a new hashed password using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //try to add the new user to the database
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        //afterwards go to the login page so that the new user can log in
        res.redirect("/login");
    } catch {
        console.log("Error registering, something went wrong.")
        //send back to this page to try again
        res.redirect("/register");
    }
    console.log(users);
});

//this middleware function will lock unauthenticated users out of the system by simply redirecting them to the login page when they
//try to go anywhere
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } 
    //force the user to log in, and authenitcate themselves
    console.log("redirecting user to login, not authenticated");
    res.redirect("/login");
};

//this function will do the opposite, if the user is already logged in, it won't let them log in again until they are logged out
function notAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        //get the user off of the login page, since they don't need to log in
        //(and register page too)
        console.log("redirecting user to home, already logged in");
        return res.redirect("/");
    }
    next();
};

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
