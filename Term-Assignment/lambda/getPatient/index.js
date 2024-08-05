const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { patientId } = event;

    if (!patientId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Patient ID is required." }),
            headers: { "Content-Type": "application/json" },
        };
    }

    const params = {
        TableName: "PatientsTable",
        Key: { patientId },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Patient not found." }),
                headers: { "Content-Type": "application/json" },
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
            headers: { "Content-Type": "application/json" },
        };
    } catch (error) {
        console.error("Error getting patient:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: { "Content-Type": "application/json" },
        };
    }
};
