const Listing = require("./models").Listing;

module.exports = {
    addListing(newListing, callback){
        return Listing.create({
                title: newListing.title,
                type: newListing.type,
                size: newListing.size,
                color: newListing.color,
                description: newListing.description,
                picture: newListing.picture
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
        })
    }
}