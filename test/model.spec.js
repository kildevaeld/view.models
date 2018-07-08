const Model = require('../lib/model').Model,
    types = require('../lib/types');



describe('Model', () => {


    it('should instantiate', () => {

        const model = new Model();
        model.should.be.instanceOf(Model);


    });

    it('should have a default generated id', () => {
        const model = new Model();
        console.log(model)
        model.id.should.not.be.null(model);
        model.id.should.be.instanceof(String);
    })

    it('should instantiate with properties', () => {});

    it('should set property', () => {});

    it('should get property', () => {});

    it('should unset property', () => {});

});