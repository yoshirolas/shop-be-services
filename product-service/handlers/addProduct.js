'use strict';

const ApiError = require('../utils/apiError');
const corsHeaders = {
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    }
};

const { validateProductData } = require('../products-data/productDataValidation');

const { Client } = require('pg');
const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env;
const dbOption = {
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
};

module.exports.invoke = async (event) => {

    const client = new Client(dbOption); 
    client.connect();

    try {
        const { body } = event;
        if (!body) throw new ApiError(400, 'Not valid data');

        const { title, description, count, price } = JSON.parse(body);
        const product = {
            title, 
            description, 
            count,
            price
        };

        const { error, value } = validateProductData(product);
        if (error) throw new ApiError(400, 'Not valid data');

        const { rows } = await client.query(
            `insert into products (title, description, price) values ('${product.title}', '${product.description}', ${product.price}) RETURNING id`
        );
        const product_id = rows[0].id;
        
        await client.query(
            `insert into stocks (product_id, count) values ('${product_id}', ${product.count})`
        );

        return {
            statusCode: 200,
            body: JSON.stringify(product),
            ...corsHeaders
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