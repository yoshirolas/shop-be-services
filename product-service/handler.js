'use strict';
const {products} = require('./product-mock-data/products')

module.exports.products = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products)
  };
};

module.exports.product = async (event) => {
  const { id } = event.pathParameters;

  if (!id) {
    return {
      statusCode: 400,
      body: 'Error! Please use the following path structure: /product/{id}'
    };
  }
  
  const product = products.find(p => p.id === id);
  if (!product) {
    return {
      statusCode: 404,
      body: `Error! Couldn't find product with id ${id}`
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      product
    ),
  };
};
