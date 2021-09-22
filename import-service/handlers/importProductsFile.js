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
    try {
        const { name } = event.queryStringParameters;
        const catalogPath = `uploaded/${name}`;
        const params = {
            Bucket: BUCKET,
            Key: catalogPath,
            ContentType: 'text/csv'
        };
    
        const url = await s3.getSignedUrlPromise('putObject', params);
        
        if (!url) throw new Error();

        return {
            statusCode: 200,
            body: JSON.stringify(url),
            ...corsHeaders
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error),
            ...corsHeaders
        }
    }
};