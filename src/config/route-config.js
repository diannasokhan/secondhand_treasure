module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const userRoutes = require("../routes/users");
        const listingRoutes = require("../routes/listing");


        app.use(staticRoutes);
        app.use(userRoutes);
        app.use(listingRoutes);
    }
}