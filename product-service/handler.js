'use strict';

const { products } = require('./product-mock-data/products')
const corsHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  }
}

module.exports.products = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
    ...corsHeaders
  };
};

module.exports.product = async (event) => {
  const { productId } = event.pathParameters;

  if (!productId) {
    return {
      statusCode: 400,
      body: 'Error! Please use the following path structure: /product/{id}'
    };
  }
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return {
      statusCode: 404,
      body: `Error! Couldn't find product with id ${productId}`
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      product
    ),
  };
};
