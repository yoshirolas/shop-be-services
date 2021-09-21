const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-1' });
const csv = require('csv-parser')
const BUCKET = 'uploaded-42';


module.exports.invoke = async (event) => {

    const { Records } = event;

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
                })
                .on('end', async () => {
                    console.log('On end');
                    console.log(`Copy from: ${BUCKET}/${record.s3.object.key}`);
                    await s3.copyObject({
                        Bucket: BUCKET,
                        CopySource: `${BUCKET}/${record.s3.object.key}`,
                        Key: record.s3.object.key.replace('uploaded', 'parsed')
                    }).promise();
                    console.log(`Copy to: ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`);
                    res();
                })
                .on('error', (data) => {
                    console.log('On error: ', data);
                    rej(data);
                })
                .on('close', (data) => {
                    console.log('On close', data);
                });
        });
    }
};