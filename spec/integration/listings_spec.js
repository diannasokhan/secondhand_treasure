const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/listings";
const sequelize = require("../../src/db/models/index").sequelize;
const Listing = require("../../src/db/models").Listing;

describe("routes : listings", () => {

    beforeEach((done) => {
        this.listing;
        sequelize.sync({force: true}).then((res) => {
            Listing.create({
                title: "yellow shirt",
                type: "shirt",
                size: "medium",
                color: "yellow",
                description: "NWT",
                picture: "bbb.jpg" 
            }).then((listing) => {
                this.listing = listing;
                done();
            }).catch((err) => {
                console.log(err);
                done();
            })
        })
    })
    describe("GET /listings/index", () => [
        it("should list all listings", (done) => {
            request.get(`${base}/index`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Listings");
                expect(body).toContain("yellow shirt");
                done();
            })
        })
    ])

   describe("GET /listings/new", () => {
       it("should render a new listings form", (done) => {
           request.get(`${base}/new`, (err, res ,body) => {
               expect(err).toBeNull();
               expect(body).toContain("New Listing");
               done();
           });
       });
   });
   describe("POST /listings/new", () => {
       
       it("should create a listing", (done) => {

        const options = {

            url: `${base}/new`,
            form: {
             title: "black sweater",
             type: "outerwear",
             size: "medium",
             color: "black",
             description: "gently used black sweater",
             
            }
       };
           request.post(options, (err, res, body) => {
                Listing.findOne({where: {id: 2}})
            
                .then((listing) => {
                   console.log(listing)
                    expect(err).toBeNull();
                    expect(listing.type).toBe("outerwear");
                    expect(listing.size).toBe("medium");
                    expect(listing.color).toBe("black");
                    expect(listing.description).toBe("gently used black sweater");
                    expect(listing.picture).toBe("aaa.jpg");
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });
           });
       });
   });
   describe("GET /listings/:id", () => {
       it("should render a view with the selected listing", () => {
           request.get(`${base}/listings/${this.listing.id}`, (err, res, body) => {
               expect(err).toBeNull();
               expect(body).toContain("yellow shirt");
               done();
           });
       });
   });
})