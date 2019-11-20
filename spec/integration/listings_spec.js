const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/listings";
const sequelize = require("../../src/db/models/index").sequelize;
const Listing = require("../../src/db/models").Listing;
const User = require("../../src/db/models").User

describe("routes : listings", () => {


    beforeEach((done) => {
        this.listing;
        this.user;
        sequelize.sync({force: true}).then((res) => {
            User.create({
                email: "diannaS@gmail.com",
                password: "hello123",
                role: "admin"
            }).then((user) => {
                this.user = user;

                request.get({
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        role: user.role,
                        id: user.id,
                        email: user.email
                    }
                });

                Listing.create({
                    title: "yellow shirt",
                    type: "shirt",
                    size: "medium",
                    color: "yellow",
                    description: "NWT",
                    picture: "bbb.jpg",
                    userId: this.user.id 
                }).then((listing) => {
                    this.listing = listing;
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });
    
        describe("GET /listings/index", () => {
            it("should list all listings", (done) => {
                request.get(`${base}/index`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Listings");
                    expect(body).toContain("yellow shirt");
                    expect(this.listing.userId).toBe(this.user.id);
                    done();
                });
            });
        });
        describe("POST /listings/:id/destroy", () => {
            it("should delete the listing with the associated ID", (done) => {
                Listing.findAll()
                .then((listings) => {
                    console.log(this.listing.id)
                    const listingCountBeforeDelete = listings.length;
                    expect(listingCountBeforeDelete).toBe(1);
     
                    request.post(`${base}/${this.listing.id}/destroy`, (err, res, body) => {
                        Listing.findAll()
                        .then((listings) => {
                         expect(err).toBeNull();
                         expect(listings.length).toBe(listingCountBeforeDelete - 1);
                         done();
                        })
                    });
                });
            });
        });
        describe("GET /listings/new", () => {
            it("should render a new listings form", (done) => {
                request.get(`${base}/new`, (err, res ,body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Listing");
                    done();
                });
            });
        });
        describe("GET /listings/:id/edit", () => {
            it("should render a view with an edit listing form", (done) => {
                request.get(`${base}/${this.listing.id}/edit`, (err, res, body) => {
                  expect(err).toBeNull();
                  expect(body).toContain("Edit Listing");
                  expect(body).toContain("yellow shirt");
                  done();
                });
            });
         });
         describe("POST /listings/:id/update", () => {
             it("should update the listing with the given value", (done) => {
                 const options = {
                     url: `${base}/${this.listing.id}/update`,
                     form: {
                         title: "yellow cashmere sweater",
                         type: "sweater",
                         size: "medium",
                         color: "yellow",
                         description: "very gently used sweater"
                     }
                 };
                 request.post(options, (err, res, body) => {
                     expect(err).toBeNull();
                     
                     Listing.findOne({
                         where: {id: this.listing.id}
                     }).then((listing) => {
                         expect(listing.title).toBe("yellow cashmere sweater");
                         expect(listing.description).toBe("very gently used sweater");
                         done();
                     });
                 });
             });
         });
})