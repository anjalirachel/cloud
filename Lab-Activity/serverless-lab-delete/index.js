const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    let body;
    try {
        body = event;
        console.log("Parsed body:", body);
    } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,DELETE",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ message: 'Invalid JSON input', error: jsonError.message }),
        };
    }

    const { patientId } = body;
    console.log("Extracted patientId:", patientId);

    const params = {
        TableName: 'patient',
        Key: {
            patientId: patientId,
        }
    };

    try {
        console.log("Deleting item from DynamoDB with params:", JSON.stringify(params, null, 2));
        await dynamoDB.delete(params).promise();
        console.log("Successfully deleted patient data");

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,DELETE",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ message: 'Patient data deleted successfully' }),
        };

        return response;
    } catch (error) {
        console.error('Error deleting data:', error);

        const response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,DELETE",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ message: 'Failed to delete patient data', error: error.message }),
        };

        return response;
    }
};
