const { validateProductData } = require('../utils/productDataValidation');
const { Client } = require('pg');
const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT, SNS_ARN } = process.env;
const dbOption = {
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
};
const AWS = require('aws-sdk');

module.exports.invoke = async (event) => {

    const client = new Client(dbOption); 
    client.connect();

    try {
        const { Records } = event;     
        for (const record of Records) {
            const product = JSON.parse(record.body)
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

            console.log('Product were added into DB');
        }

        return new Promise((resolve, reject) => {
            const sns = new AWS.SNS({ region: 'eu-west-1' });
            sns.publish({
                Subject: 'catalog batch upload',
                Message: 'New products were uploaded into DB',
                TopicArn: SNS_ARN
            }, (error, data) => {
                if (error) reject();
                console.log('Email has been sent');
                resolve();
            });
        })

    } catch (error) {
        console.log(error)
    } finally {
        client.end()
    }
};