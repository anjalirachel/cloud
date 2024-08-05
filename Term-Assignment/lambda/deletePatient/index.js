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
        await dynamoDb.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Patient deleted successfully." }),
            headers: { "Content-Type": "application/json" },
        };
    } catch (error) {
        console.error("Error deleting patient:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: { "Content-Type": "application/json" },
        };
    }
};
