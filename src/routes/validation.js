module.exports = {
    validateUsers(req, res, next) {
        if(req.method === "POST") {
          req.checkBody("email", "email must be valid").isEmail();
          req.checkBody("password", "password must be at least 6 characters in length").isLength({min: 6})
          req.checkBody("passwordConfirmation", "password confirmation must match password provided").optional().matches(req.body.password);
        }
        const errors = req.validationErrors();
   
        if (errors) {
          req.flash("error", errors);
          return res.redirect(req.headers.referer);
        } else {
          return next();
        }
      },
      validateListings(req, res, next){
        if(req.method === "POST"){
          req.checkBody("title", "must be at least 2 characters in length").isLength({min: 2});
          req.checkBody("type", "must be at least 2 characters in length").isLength({min: 2});
          req.checkBody("size", "must be at least 1 character in length").isLength({min: 1});
          req.checkBody("color", "must be at least 4 characters in length").isLength({min: 4});
          req.checkBody("description", "must be at least 10 characters in length").isLength({min: 10});
        }
        const errors = req.validationErrors();

        if(errors){
          req.flash("error", errors);
          return res.redirect(303, req.headers.referer);
        }else{
          return next();
        }
      }
  }