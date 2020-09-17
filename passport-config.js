//libraries
const LocalStratagey = require("passport-local").Strategy;
const brcypt = require("bcrypt");

//our main function we are going to export to be used in our server
//needs some construction though before it will work
function initialize(passport, getUserByEmail, getUserById) {
    //done is returned as a user if authentication succeeds, returns false if authentication fails
    const authenticate = async (email, password, done) => {
        //check the email with our saved emails
        console.log("looking for email: ", email);
        const user = getUserByEmail(email);
        console.log("Found user: ", user);
        //if no user is found in our database/array
        //will end the function if this case is true
        if(user == null) {
            console.log("login failure incorrect email");
            return done(null, false, { message: "There is no saved user with that email" });
        }

        //use a try catch to make sure this function doesn't hang on us, it shouldn't but you never know
        try {
            //use a built-in bcrypt function to compare the password inserted, with the hashed password on the database/storage
            if(await brcypt.compare(password, user.password)) {
                console.log("login success");
                return done(null, user);
            } else {
                console.log("login failure, incorrect password");
                return done(null, false, { message: "password incorrect"});
            }
        } catch(error) {
            //this catch handles a potential falure with our async function, returns information about failure
            return done(error);
        }
    };

    //setting our passport strategy to use the email field on our database as the username field in the library
    passport.use(new LocalStratagey({ usernameField: "email" }, authenticate));

    //this section will be used to keep a user logged in.
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
};

module.exports = initialize;
