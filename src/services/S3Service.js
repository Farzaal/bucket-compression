const AWS = require('aws-sdk');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const config = require('../config/app');

const s3 = new AWS.S3({ accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey });

module.exports = {

    async getImageFromBucket(bucket, filename) {
        console.log("Fetching Image");
        const s3Response = await s3.getObject({ Bucket: bucket, Key: filename }).promise();
        console.log("Image: ", s3Response);
        return s3Response.Body;
    },

    async compressImage(buffer) {
        const compressedImageBuffer = await imagemin.buffer(buffer, {
            plugins: [imageminMozjpeg({ quality: '50' }), imageminPngquant({ quality: '65-80' })],
        });
        return compressedImageBuffer;
    },

    async uploadToS3(buffer, filename) {
        const s3Upload = await s3.upload({
            Bucket: config.destination_bucket,
            Key: filename,
            Body: buffer,
            ContentType: 'image/png',
            ACL: 'public-read'
        }).promise();
        return s3Upload;
    }
}