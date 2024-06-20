require('dotenv').config();
const { parse } = require('url');
const url = require('url');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
    s3ForcePathStyle: true
});

// uplpoads file to s3
function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);
    
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    }

    return s3.upload(uploadParams).promise();
}

function uploadFile2(fileBuffer, filename, fileType) {
    const uniqueFileName = filename + Date.now();
    
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: uniqueFileName,
        ContentType: fileType,
    }

    return s3.upload(uploadParams).promise();
}

async function deleteFile(url) {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/');
    const key = pathParts.slice(1).join('/');
    
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        await s3.deleteObject(params).promise();
        console.log("File deleted from s3 bucket")
    } catch(err) {
        console.error("Error deleteing file from s3 bucket: ", err);
    }
}


// downloads file from s3
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    }

    return s3.getObject(downloadParams).createReadStream();
}


module.exports ={
    uploadFile,
    uploadFile2,
    getFileStream,
    deleteFile,
}