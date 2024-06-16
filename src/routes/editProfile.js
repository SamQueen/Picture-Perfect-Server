const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadFile2  } = require('../aws/s3');
const { updateProfilePhoto } = require('../db/userQueries');

// login route
router.post('/updateProfilePhoto', upload.single('image'), async (req, res) => {
    const file = req.file;
    const userId = req.headers['user_id'];
    let url = '';
    
    if (!file) {
        return res.status(400).json({ message:'No file uploaded' });
    }

    // uppload to s3 bucket and get url
    try {
        const result = await uploadFile2(file.buffer, file.originalname, file.mimetype);
        url = result.Location;
    } catch (err) {
        console.error('Error uploading to s3 bucket: ' + err);
        return res.status(500).json({ message: 'error uploading to bucket' });
    }

    // store url in database
    try {
        const databaseResponse = await updateProfilePhoto(userId, url);

        if (databaseResponse.status === 'success')
            return res.status(200).json({ message: 'success', fileStream: url });
        
        return res.status(500).json({ message: 'error uploading to database' });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'error uploading to database' });
    }
});

module.exports = router;