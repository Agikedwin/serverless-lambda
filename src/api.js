const db = require("./db");
const { GetItemCommand,
        PutItemCommand,
        DeleteBackupCommand,
        ScanCommand,
        UpdateItemCommand, 
        DeleteItemCommand} = require("@aws-sdk/client-dynamodb");

const { marshall,
    unmarshall} = require("@aws-sdk/util-dynamodb");


    const getPost = async (event) => {
        const response ={
            statusCode: 200
        }

        try {
            const params = {
                TableName: process.env.DYNAMODB_TABLE_NAME,
                Key: marshall({postId: event.pathParameters.postId}),               

            };
            const { Items } = await db.send(new GetItemCommand(params));
            console.log({Items});

            response.body = JSON.stringify({
                message: "Successfully retrieved posts",
                data: (Items) ? unmarshall(Items) : {},
                rawData: Items
            });


        }catch (e) {
            console.log(e);
            response.body = JSON.stringify({
                message: "Failed to retrieve posts",
                errMessage: e.message,
                errStack: e.stack,
            });

        }
        return response;
    };



    const createPost = async (event) => {
        const response ={
            statusCode: 200
        }

        try {
            const body = JSON.parse(event.body);
            const params = {
                TableName: process.env.DYNAMODB_TABLE_NAME,
                Item: marshall(body || {}),               

            };
            const createResults = await db.send(new PutItemCommand(params));

            response.body = JSON.stringify({
                message: "Successfully created posts",
                createResults
            });


        }catch (e) {
            console.log(e);
            response.body = JSON.stringify({
                message: "Failed to create posts",
                errMessage: e.message,
                errStack: e.stack,
            });

        }
        return response;
    };
    
    
    
    const updatePost = async (event) => {
        const response ={
            statusCode: 200
        }

        try {
            const body = JSON.parse(event.body);
            const objKeys = Object.keys(body);
            const params = {
                TableName: process.env.DYNAMODB_TABLE_NAME,
                keys: marshall({postId: event.pathParameters.postId}),
                UpdateExpression: `SET ${objKeys.map((_, index) => `#key{index} = :value${index}`)}`,
                ExpressionAttributeNames: objKeys.reduce((acc,key,index) => ({
                    ...acc,
                    [`#key${index}`]: key,
                }), {}),
                ExpressionAttributeValues: marshall(objKeys.reduce((acc,key,index) => ({
                    ...acc, 
                    [`:value${index}`]: body[key],
                }), {}))
            };

            const updateResults = await db.send(new UpdateItemCommand(params));


            response.body = JSON.stringify({
                message: "Successfully updated posts",
                createResults
            });


        }catch (e) {
            console.log(e);
            response.body = JSON.stringify({
                message: "Failed to update posts",
                errMessage: e.message,
                errStack: e.stack,
            });

        }
        return response;
    };
    
    

    const deletePost = async (event) => {
        const response ={
            statusCode: 200
        }

        try {
           
            const params = {
                TableName: process.env.DYNAMODB_TABLE_NAME,
                keys: marshall({postId: event.pathParameters.postId}),          
            };

            const deleteResults = await db.send(new DeleteItemCommand(params));

            response.body = JSON.stringify({
                message: "Successfully deleted posts",
                deleteResults
            });


        }catch (e) {
            console.log(e);
            response.body = JSON.stringify({
                message: "Failed to delete posts",
                errMessage: e.message,
                errStack: e.stack,
            });

        }
        return response;
    };
    

    const getAllPosts = async (event) => {
        const response ={
            statusCode: 200
        }

        try {
           
            const {Items} = await db.send(new ScanCommand({
                TableName: process.env.DYNAMODB_TABLE_NAME
            }));

            response.body = JSON.stringify({
                message: "Successfully retrieved posts",
                data: Items.map((item) => unmarshall(item)),
                Items
            });


        }catch (e) {
            console.log(e);
            response.body = JSON.stringify({
                message: "Failed to retrieve posts",
                errMessage: e.message,
                errStack: e.stack,
            });

        }
        return response;
    };
    
module.exports = {
    getPost,
    createPost,
    updatePost,
    deletePost,
    getAllPosts

}
    