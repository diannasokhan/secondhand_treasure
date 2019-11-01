const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Listing = require("../../src/db/models").Listing

describe("User", () => {
    beforeEach((done) => {
        this.listing;
        this.user;
        sequelize.sync({force: true}).then((res) => {
            User.create({
                email: "example@gmail.com",
                password: "hello12"
            }).then((user) => {
                this.user = user;

                Listing.create({
                    title: "vintage black button down shirt",
                    type: "shirt",
                    size: "medium",
                    color: "black",
                    description: "gently used shirt in great condition",
                    picture: "aaa.jpg",
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
    
    describe("#create()", () => {
        it("should create a User object with a valid email and password", (done) => {
            User.create({
                email: "user@example.com",
                password: "hello12"
            }).then((user) => {
                expect(user.email).toBe("user@example.com");
                expect(user.id).toBe(2);
                done();
            }).catch((err) => {
                console.log(err);
                done();
            });
        } );
        it("should not create a user with invalid email or password", (done) => {
            User.create({
                email: "hola hola",
                password: "heeeeeythere"
            }).then((user) => {
                done();
            }).catch((err) => {
                expect(err.message).toContain("Validation error: must be a valid email");
                done();
            });
        });
        it("should not create a user with an email already taken", (done) => {
            User.create({
                email: "user@example.com",
                password: "hello12"
            }).then((user) => {
                User.create({
                    email: "user@example.com",
                    password: "heyheyheyeh"
                }).then((user) => {
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });
    describe("#setUser", () => {
        it("should associate a listing and a user together", (done) => {
            User.create({
                email: "ds@gmail.com",
                password: "hello12"
            }).then((newUser) => {
                expect(this.listing.userId).toBe(this.user.id);

                this.listing.setUser(newUser)
                .then((listing) => {
                    expect(this.listing.userId).toBe(newUser.id);
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });
    describe("#getUser", () => {
        it("should return the associated user", (done) => {
            this.listing.getUser()
            .then((associatedUser) => {
                expect(associatedUser.email).toBe("example@gmail.com");
                done();
            })
        } )
    })
})