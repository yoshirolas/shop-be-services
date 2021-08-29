'use strict';

const { getProductsList } = require('../products-data/utils');
const corsHeaders = {
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    }
};

module.exports.products = async (event) => {
    const products = await getProductsList();
    return {
      statusCode: 200,
      body: JSON.stringify(products),
      ...corsHeaders
    };
};