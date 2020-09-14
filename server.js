//library imports
const express = require("express");
const app = express();

app.set("view-engine", "ejs");

//home page for the application
app.get("/", (req, res) => {
    res.render("index.ejs", { name: "Josiah" });
});

//login page for the application
//and related routes
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

//register page for application
//and related routes
app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
