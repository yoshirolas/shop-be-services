'use strict';

// const { getProductsList } = require('../products-data/utils');
const ApiError = require('../utils/apiError');
const corsHeaders = {
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    }
};

const { Client } = require('pg');
const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env;
const dbOption = {
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
};

module.exports.products = async (event) => {
    const client = new Client(dbOption); 
    client.connect();

    try {
      const { rows: products } = await client.query('select * from products left join stocks on products.id = stocks.product_id');
      if (!products.length) throw new ApiError(400, `There are no products in DB`);
      return {
        statusCode: 200,
        body: JSON.stringify(products),
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