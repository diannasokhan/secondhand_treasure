
const listingQueries = require("../db/queries.listings.js");


module.exports = {
    index(req, res, next){
        listingQueries.getAllListings((err, listings) => {
            if(err){
                res.redirect(500, "/")
            }else{
                res.render("listings/index", {listings})
            }
        })
    },
    new(req, res){
        res.render("listings/new")
    },
    create(req, res){
        if(req.file){
           let newListing = {
                title: req.body.title,
                type: req.body.type,
                size: req.body.size,
                color: req.body.color,
                description: req.body.description,
                picture:req.file.key
           };
           listingQueries.addListing(newListing, (err, listing) =>{
               if(err){
                   req.flash("error", err);
                   res.redirect("/listings/new");
                   
               }else{
                   req.flash("notice", "Listing created");
                   res.redirect("/listings/index");
                   
               }
           });
        }else{
            req.flash("notice", "Listing not created");
            res.redirect("/listings/new");
        }
    },
    show(req, res, next){
        listingQueries.getListing(req.params.id, (err, listing) => {
            if(err || listing == null){
                res.redirect(404, "/");
            }else{
                res.render("listings/show", {listing})
            }
        })
    }
}