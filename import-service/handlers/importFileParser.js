const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-1' });
const csv = require('csv-parser')
const BUCKET = 'uploaded-42';


module.exports.invoke = async (event) => {

    const { Records } = event;
    const sqs = new AWS.SQS();

    for (const record of Records) {
        return new Promise((res, rej) => {
            const fileStream = s3
                .getObject({
                    Bucket: BUCKET,
                    Key: record.s3.object.key
                })
                .createReadStream();

            fileStream
                .pipe(csv())
                .on('data', (data) => {
                    console.log('On data', data);
                    sqs.sendMessage({
                        QueueUrl: process.env.SQS_URL,
                        MessageBody: JSON.stringify(data)
                    }, (error, data) => {
                        console.log('Send Message');
                        if (error) console.log(error);
                        if (data ) console.log(data);
                    });
                })
                .on('end', async (data) => {
                    console.log('On end');
                    console.log(`Copy from: ${BUCKET}/${record.s3.object.key}`);
                    await s3.copyObject({
                        Bucket: BUCKET,
                        CopySource: `${BUCKET}/${record.s3.object.key}`,
                        Key: record.s3.object.key.replace('uploaded', 'parsed')
                    }).promise();
                    console.log(`Copy to: ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`);

                    await s3.deleteObject({
                        Bucket: BUCKET,
                        Key: record.s3.object.key
                    }).promise();
                    console.log(`File has been permanently deleted: ${record.s3.object.key}`);
                    res(200);
                })
                .on('error', (data) => {
                    console.log('On error: ', data);
                    rej(500);
                })
                .on('close', (data) => {
                    console.log('On close', data);
                });
        });
    }
};