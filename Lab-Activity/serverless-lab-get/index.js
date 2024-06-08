const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const params = {
        TableName: 'patient'
    };

    try {
        console.log("Scanning table with params:", JSON.stringify(params, null, 2));
        const data = await dynamoDB.scan(params).promise();
        console.log("Successfully retrieved data:", JSON.stringify(data, null, 2));

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify(data.Items),
        };

        return response;
    } catch (error) {
        console.error('Error retrieving data:', error);

        const response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ message: 'Failed to retrieve data', error: error.message }),
        };

        return response;
    }
};
