const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log(event);
    // const { patientId } = event.body;

  let patientId;

  // Check if event.body is present and parse it
  if (event.body) {
    try {
     // Parse the JSON string

      patientId = event.body.patientId; // Extract patientId
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request body format." }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
  }

    if (!patientId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Patient ID is required." }),
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", 
                // "Access-Control-Allow-Headers": "*", 
                // "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
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
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*", 
                    // "Access-Control-Allow-Headers": "*", 
                    // "Access-Control-Allow-Methods": "GET,OPTIONS"
                },
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", 
                // "Access-Control-Allow-Headers": "*", 
                // "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
        };
    } catch (error) {
        console.error("Error getting patient:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", 
                // "Access-Control-Allow-Headers": "*", 
                // "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
        };
    }
};
