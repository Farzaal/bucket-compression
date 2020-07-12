const _ = require('lodash');

module.exports = {

    async compressImage(req, res) {
        return res.status(200).json({ message: 'Route added' });
    }

}