const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    count: Joi.number().min(0).required(),
    price: Joi.number().min(0).required()
});

const validateProductData = (productData) => schema.validate(productData);

module.exports = { schema, validateProductData};