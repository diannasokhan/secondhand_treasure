const Listing = require("./models").Listing;
const Authorizer = require("../policies/application.js");


module.exports = {
    addListing(newListing, callback){
        return Listing.create({
                title: newListing.title,
                type: newListing.type,
                size: newListing.size,
                color: newListing.color,
                description: newListing.description,
                picture: newListing.picture,
                userId: newListing.userId,
        }).then((listing) => {
            callback(null, listing);
        }).catch((err) => {
            callback(err);
        })
    },
    getAllListings(callback){
        return Listing.findAll()
        .then((listings) => {
            callback(null, listings)
        }).catch((err) => {
            callback(err);
        });
    },
    getListing(id, callback){
        return Listing.findByPk(id)
        .then((listing) => {
            callback(null, listing);
        }).catch((err) => {
            callback(err);
        });
    },
    deleteListing(req, callback){
        return Listing.findByPk(req.params.id)

        .then((listing) => {
            const authorized = new Authorizer(req.user, listing).destroy();

            if(authorized){
                listing.destroy()
                .then((res) => {
                    callback(null, listing);
                });
            } else{
                req.flash("notice", "You are not authorized to do that.");
                callback(401);
            }
        }).catch((err) => {
            callback(err);
        });

    },
    updateListing(req, updatedListing, callback){
        return Listing.findByPk(req.params.id)
        .then((listing) => {
            if(!listing){
                return callback("Listing not found");
            }

            const authorized = new Authorizer(req.user, listing).update();

            if(authorized){
                listing.update(updatedListing, {
                    fields: Object.keys(updatedListing)
                }).then(() => {
                    callback(null, listing);
                }).catch((err) => {
                    callback(err);
                });
            } else{
                req.flash("notice", "You are not authorized to do that.");
                callback("Forbidden");
            }
        });
    }
}