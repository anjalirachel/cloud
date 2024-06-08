const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    let body;
    try {
        body=event;
        console.log("Parsed body:", body);
    } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ message: 'Invalid JSON input', error: jsonError.message }),
        };
    }

    const { name, patientId, allergies, doctor_name } = body;
    console.log("Extracted data - Name:", name, ", Patient ID:", patientId, ", Allergies:", allergies, ", Doctor Name:", doctor_name);

    const params = {
        TableName: 'patient',
        Item: {
            patientId: patientId,
            name: name,
            allergies: allergies,
            doctor_name: doctor_name,
        }
    };

    try {
        console.log("Putting item into DynamoDB with params:", JSON.stringify(params, null, 2));
        await dynamoDB.put(params).promise();
        console.log("Successfully stored patient data");

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({ message: 'Patient data stored successfully' }),
        };

        return response;
    } catch (error) {
        console.error('Error storing data:', error);

        const response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ message: 'Failed to store patient data', error: error.message }),
        };

        return response;
    }
};
