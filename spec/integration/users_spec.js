const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes: users", () => {
    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        }).catch((err) => {
            console.log(err);
            done();
        });
    });
    describe("GET /users/sign_up", () => {
        it("should render a view with a sign up form", (done) => {
            request.get(`${base}/sign_up`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign up");
                done();
            })
        })
    })
    describe("POST /user/signup", () => {
        it("should create a new user with valid values and redirect", (done) => {
            const options = {
                url: "http://localhost:3000/user/signup",
                form: {
                    email: "diannaG@gmail.com",
                    password: "hello12",
                    passwordConfirmation: "hello12"
                }
            }
            request.post(options, (err, res, body) => {
                User.findOne({where: {email: "diannaG@gmail.com"}})
                .then((user) => {
                    console.log(user)
                    expect(user).not.toBeNull();
                    expect(user.email).toBe("diannaG@gmail.com");
                    expect(user.id).toBe(1);
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
        it("should not create a new user with invalid attributes and redirect", () => {
            const options = {
                url:"http://localhost:3000/user/signup",
                form: {
                    email: "hihi",
                    password: "hellohello"
                }
            }
            request.post(options, (err, res, body) => {
                User.findOne({where: {email: "hihi"}})
                .then((user) => {
                    expect(user).toBeNull();
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    })
})