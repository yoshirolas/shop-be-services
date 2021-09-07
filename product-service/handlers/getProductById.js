'use strict';

const { getProductById } = require('../products-data/utils');
const ApiError = require('../utils/apiError');

// const corsHeaders = {
//     headers: {
//       'Access-Control-Allow-Origin': '*', // Required for CORS support to work
//       'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
//     }
// };

module.exports.product = async (event) => {
    try {
        const { productId } = event.pathParameters;
        if (!productId) throw new ApiError(400, 'Error! Please use the following path structure: /product/{id}');

        const product = await getProductById(productId);
        if (!product) throw new ApiError(404, `Error! Couldn't find product with id ${productId}`);

        return {
            statusCode: 200,
            body: JSON.stringify(
              product
            ),
          };
        
    } catch (error) {
        return {
            statusCode: error.statusCode,
            body: error.message
        }; 
    }
};