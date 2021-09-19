const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-1' });

const BUCKET = 'uploaded-42';
const corsHeaders = {
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    }
};

module.exports.invoke = async (event) => {

    const { name } = event.queryStringParameters;
    const catalogPath = `uploaded/${name}`;
    const params = {
        Bucket: BUCKET,
        Key: catalogPath,
        ContentType: 'text/csv'
    };

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (err, url) => {
            if (err) reject(err);
            if (url) resolve({
                statusCode: 200,
                body: JSON.stringify(url),
                ...corsHeaders
            });
        })
    });
};