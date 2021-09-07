'use strict';

// const { getProductById } = require('../products-data/utils');
const ApiError = require('../utils/apiError');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const { Client } = require('pg');
const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env;
const dbOption = {
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
};

module.exports.product = async (event) => {
    const client = new Client(dbOption); 
    client.connect();

    try {
        const { productId } = event.pathParameters;
        if (!productId) throw new ApiError(400, 'Error! Please use the following path structure: /product/{id}');
        if (!productId.match(uuidRegex)) throw new ApiError(400, 'Wrong product id format');

        const { rows } = await client.query(
            `select * from products p left join stocks s on p.id = s.product_id where p.id = '${productId}'`
        );
        if (rows.length !== 1) throw new ApiError(500, 'Wrong DB response format');

        const product = rows[0];
        if (!product) throw new ApiError(404, `Couldn't find product with id ${productId}`);

        return {
            statusCode: 200,
            body: JSON.stringify(
              product
            ),
          };
        
    } catch (error) {
        return {
            statusCode: error.statusCode || 500,
            body: error.message
        }; 
    } finally {
        client.end()
    }
};