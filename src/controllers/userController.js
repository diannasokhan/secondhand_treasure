const userQueries = require("../db/queries.users.js");
const passport = require("passport");

function buildErrorList(err) {
    return err.errors.map(error => ({
      location: "body",
      param: error.path + ":",
      msg: error.message,
      value: ""
    }));
  }
module.exports = {
    signUp(req, res, next){
        res.render("users/sign_up");
    },
    create(req, res, next){
        let newUser = {
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", buildErrorList(err));
                res.redirect("/users/sign_up");
            }else{
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You have successfully logged in");
                    res.redirect("/")
                })
            }
        });
    },
    signInForm(req, res, body){
        res.render("users/sign_in");
    },
    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
            if(!req.user){
              req.flash("notice", "Sign in failed. Please try again.")
              res.redirect("/users/sign_in");
            } else {
              req.flash("notice", "You've successfully signed in!");
              res.redirect("/");
            }
          })
    },
    signOut(req, res, body){
        req.logout();
        req.flash("notice", "You have successfully signed out");
        res.redirect("/")
    }
}