
const AWS =  require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

exports.handler = async (event)  => {
    console.log(event);
    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        bbody: JSON.stringify({
            message: ""
        })
    };

    try{
        const params = {
            Bucket: BUCKET_NAME,
            Key: decodeURIComponent(event.pathParameters.fileKey),
        }

        const deleteObject= await s3.deleteObject(params).promise();

        response.body = JSON.stringify({message: "Successfully deleted file froms3 bucket ", deleteObject})

    }catch(err){
        console.log(err);
        response.body = JSON.stringify({message: "Failed deleted file from s3 bucket ", err});
        response.statusCode = 500;
     
    }

    return response;

}
