const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

exports.handler = async () => {
    try{
        const date = new Date();
        const params = {
            BackupName : `${date.getFullYear()}-${date.getMonth() =1}- ${date.getDay()}`,
            TableName : process.env.DYNAMODB_TABLE_NAME,
        }
        const backupRes = await dynamodb.createBackup(params).promise();
        console.log({backupRes})
    }catch(err){
        console.log(err);
    }

    return
}