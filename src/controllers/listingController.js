
const listingQueries = require("../db/queries.listings.js");
const Authorizer = require("../policies/application.js");

function buildErrorList(err) {
    return err.errors.map(error => ({
      location: "body",
      param: error.path + ":",
      msg: error.message,
      value: ""
    }));
  }
module.exports = {
    index(req, res, next){
        listingQueries.getAllListings((err, listings) => {
            if(err){
                res.redirect(500, "/");
            }else{
                res.render("listings/index", {listings});
            }
        });
    },
    new(req, res, next){
        const authorized = new Authorizer(req.user).new()
        if(authorized){
            res.render("listings/new");
        }else{
            req.flash("notice", "You are not authorized to do that, please sign in.");
            res.redirect("/listings/index");
        }
    },
    create(req, res, next){

        const authorized = new Authorizer(req.user).create()
        if(authorized){
           if(req.file){
            let newListing = {
                title: req.body.title,
                type: req.body.type,
                size: req.body.size,
                color: req.body.color,
                description: req.body.description,
                picture:req.file.key,
                userId: req.user.id
           };
           listingQueries.addListing(newListing, (err, listing) =>{
               if(err){
                   console.log(err)
                   req.flash("error", buildErrorList(err));
                   res.redirect("/listings/new");
                   
               }else{
                   req.flash("notice", "Listing created");
                   res.redirect("/listings/index");
                   
               }
           });
          }else{
              req.flash("notice", "Listing not created");
              res.redirect("/listings/new")
          }
        }else{
            req.flash("notice", "You must sign in or sign up to start listing");
            res.redirect("/listings/new");
        }
    },
    show(req, res, next){
        listingQueries.getListing(req.params.id, (err, listing) => {
            if(err || listing == null){
                res.redirect(404, "/");
            }else{
                res.render("listings/show", {listing});
            }
        });
    },
    destroy(req, res, next){
        listingQueries.deleteListing(req, (err, listing) => {
          
            if(err){
                res.redirect(500, `/listings/${req.params.id}`)
            }else{
                req.flash("notice", "Listing deleted!")
                res.redirect(303, "/listings/index")
            }
       })
   },
    edit(req, res, next){

            listingQueries.getListing(req.params.id, (err, listing) => {
                if(err || null){
                    res.redirect(404, "/");
                }else {

                    const authorized = new Authorizer(req.user, listing).edit();

                    if(authorized){
                        res.render("listings/edit", {listing});
                    } else{
                        req.flash("You are not authorized to do that.");
                        res.redirect(`/listings/${req.params.id}`)
                    }       
                }
            });
    },
    update(req, res, next){
        listingQueries.updateListing(req, req.body, (err, listing) => {
            if(err || listing == null){
                res.redirect(404, `/listings/${req.params.id}/edit`);
            }else{
                res.redirect(`/listings/${listing.id}`);
            }
        });
    }
}