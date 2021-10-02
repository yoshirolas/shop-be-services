const { validateProductData } = require('../utils/productDataValidation');
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
        const { Records } = event;
        for (const record of Records) {

            const product = JSON.parse(record.body)
            console.log('product', product);
            //TODO: validate data
            // const { error, value } = validateProductData(product);
            // if (error) throw new Error('Not valid data');

            const { rows } = await client.query(
                `insert into products (title, description, price) values ('${product.title}', '${product.description}', ${product.price}) RETURNING id`
            );
            const product_id = rows[0].id;
            
            await client.query(
                `insert into stocks (product_id, count) values ('${product_id}', ${product.count})`
            );

            console.log('Product were added into DB')
        }

    } catch (error) {
        console.log(error)
    } finally {
        client.end()
    }
};