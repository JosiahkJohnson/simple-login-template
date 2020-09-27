//lets define what a user is in our program here, and save it to a directory
//this program will hash the user's password using bcrypt
const bcrypt = require("bcrypt");

//module exports the user model
module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define("User", {
        
        //each user needs a name on the program
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        
        //each user needs to register by their email address, and only one account per email address
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true
            }
          },
        
          //each user needs a password to login
          password: {
              type: DataTypes.STRING,
              allowNull: false
          }
    });

    //here are the custom functions to store as a user in our database, most important is the valid password checker
    //valid password checker
    User.prototype.validPassword =async function(password) {
        //error catching
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            console.log("Unable to compare passwords: ", error);
        }
    };
}