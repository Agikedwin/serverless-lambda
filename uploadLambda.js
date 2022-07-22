const AWS  = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

exports.handler = async (event)  => {
    console.log(event);

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({
            message: "Successfully uploaded the file to S3 bucket"
        })
    }

    try{
        const parseBody = JSON.parse(event.body);
        const base64File = parsedBody.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/,""), "base64");
        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${new Date().toISOString()}.*`,
            Body: decodedFile,
            ContentType: "image/jpeg"
        };

        const uploadResult = await s3.upload(params).promise();
        response.body = JSON.stringify({message: "Successfully uploaded the file to S3 bucket", uploadResult});


    }catch(err){
        console.log(err);
        response.body = JSON.stringify({
            message: "File failed to upload ",
            errorMessage: err
        });
        response.statusCode =500;

    }

}
