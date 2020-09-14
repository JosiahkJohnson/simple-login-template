//library imports
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");

//from other files
const initializePassport = require("./passport-config");

//temp array to store our users
const users = [];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));

//home page for the application
//get the index page
app.get("/", (req, res) => {
    res.render("index.ejs", { name: "Josiah" });
});

//login page for the application
//and related routes
//get the login page
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

//post a login request route
app.post("/login", (req, res) => {

});

//register page for application
//and related routes
//get the register page
app.get("/register", (req, res) => {
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
            email: req.body.password,
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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
