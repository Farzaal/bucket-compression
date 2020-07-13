const Joi = require('@hapi/joi');
const S3Service = require('../services/S3Service');
const _ = require('lodash');

module.exports = {

    async compressImage(req, res) {
        try {
            const _schema = Joi.object({
                bucket_name: Joi.string().required(),
                file_name: Joi.string().required(),
            });
            const { error, value } = await _schema.validate(req.body);
    
            if (!_.isNil(error)) 
                return res.status(722).json({ success: false, error });

            console.log(value);
            const img_buffer = await S3Service.getImageFromBucket(value.bucket_name, value.file_name);
            const compressed_buffer = await S3Service.compressImage(img_buffer);
            const s3_object = await S3Service.uploadToS3(compressed_buffer, value.file_name);
            return res.status(200).json({ success: true, message: 'Image Compressed And Uploaded Successfully', data: s3_object });
        } catch (e) {
            console.log("CompressionController > compressImage ", e.message);
            return res.status(400).json({ message: 'Something Went Wrong' });
        }
    }

}