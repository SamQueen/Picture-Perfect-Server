const express = require('express');
const { deletePost } = require('../db/postsQueries');
const router = express.Router();
const { deleteFile } = require('../aws/s3')

// login route
router.delete('/deletePost', async (req, res) => {
    const id = req.query.id;
    const oldPhotoPath = req.query.imgPath;
    
    try {
        // remove old photo from s3 bucket
        deleteFile(oldPhotoPath);

        const result = await deletePost(id);

        if (result.status === 'error') {
            console.log(result.message)
            return res.status(500).json({ message:'Internal error' });
        }

        return res.status(200).json({ message:'success' });
    } catch (error) {
        console.error('Error deleting post: ', error);
        return res.status(500).json({ message:'Internal error' });
    }
});

module.exports = router;