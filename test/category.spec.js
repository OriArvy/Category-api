let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let expect = require('chai').expect;
const Category = require('../models/Category');

chai.should();

chai.use(chaiHttp);

after(async() => {
    await Category.findOneAndDelete({title: "TestCategory"})
})

describe('Categories API', () => {

    describe("GET /categories", () => {
        it("It should GET all the categories", (done) => {
            chai.request(server)
                .get("/categories")
                .end((err, response) => {
                    response.should.have.status(200);
                    expect(response.body).to.exist
                    expect(response.body).to.be.an('object')
                    expect(response.body.message).to.eq('You are viewing all categories');
                    expect(response.body.categories).to.have.lengthOf.at.least(2)
                done();
                });
        });

        it("It should NOT GET all the categories if path is incorrect", (done) => {
            chai.request(server)
                .get("/categor")
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                });
        });
    });

    describe("GET /categories/:id", () => {
        it("It should GET a category by ID", (done) => {
            const categoryId = '604cc092cc91d92f9037e140'
            chai.request(server)                
                .get("/categories/" + categoryId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id');
                    response.body.should.have.property('title');
                    response.body.should.have.property('price');
                    response.body.should.have.property('numberOfItemsSold');
                    response.body.should.have.property('parent')
                    response.body.should.have.property('ancestors')
                    response.body.should.have.property('_id').eq(categoryId);
                done();
                });
        });

        it("It should NOT GET a category if we provide non-existing ID", (done) => {
            const badCategoryId = 123;
            chai.request(server)                
                .get("/categories/" + badCategoryId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.message.should.be.eq("The category with the provided ID does not exist");
                done();
                });
        });

    });


    describe("POST /categories", () => {
        it("It should POST a new category", (done) => {
            const categories = {
                title: "TestCategory",
            };
            chai.request(server)                
                .post("/categories")
                .send(categories)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.response.should.include('_id')
                    response.body.response.should.include('title')
                    response.body.response.should.include("TestCategory");
                    response.body.response.should.include('parent')
                    categories.delete
                done();
                });
        });

        it("It should NOT POST a new category without the title property", (done) => {
            const categories = {
                price: 21
            };
            chai.request(server)                
                .post("/categories")
                .send(categories)
                .end((err, response) => {
                    response.should.have.status(500);
                    response.text.should.include("Path `title` is required");
                done();
                });
        });

        it("It should NOT POST a new category if the parent category has set price", (done) => {
            const categories = {
                title: "Blueberries",
                parent: "604cc0d3cc91d92f9037e142"
            };
            chai.request(server)                
                .post("/categories")
                .send(categories)
                .end((err, response) => {
                    response.should.have.status(500);
                    response.text.should.include("Category cannot have a sub category if the price was set");
                done();
                });
        });

    });


})
