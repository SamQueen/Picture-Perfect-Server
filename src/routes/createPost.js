const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadFile2  } = require('../aws/s3');
const { createPost } = require('../db/postsQueries');

router.post('/createPost', upload.single('image'), async(req, res) => {
    const file = req.file;
    const userId = req.headers['user_id'];
    const caption = req.headers['caption'];
    
    // Validate inputs
    if (!userId || !file) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    let url = '';

    // save photo to s3 bucket and get publi url
    try {
        // upload new
        const result = await uploadFile2(file.buffer, file.originalname, file.mimetype);
        url = result.Location;
    } catch (err) {
        console.error('Error uploading to s3 bucket: ' + err);
        return res.status(500).json({ message: 'error uploading to bucket' });
    }

    // create post in database
    try {
        const databaseResponse = await createPost(userId, url, caption);

        if (databaseResponse.status === 'success')
            return res.status(200).json({ message: 'success', fileStream: url });
        
        return res.status(500).json({ message: 'error uploading to database' });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'error uploading to database' });
    }
});

module.exports = router;