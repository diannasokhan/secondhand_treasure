
const listingQueries = require("../db/queries.listings.js");

module.exports = {
    index(req, res, next){
        res.render("static/index")
    }
}