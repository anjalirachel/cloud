const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const eventBridge = new AWS.EventBridge();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  let body;
  if (typeof event.body === "string") {
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      console.error("Error parsing body:", error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON format in body." }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        //   "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        },
      };
    }
  } else {
    body = event.body;
  }

  const {
    patientId,
    name,
    age,
    issue,
    phoneNumber,
    email,
    address,
    allergies,
    emergencyContactName,
    emergencyContactPhone,
    appointmentDate,
    appointmentTime,
  } = body;

  if (!patientId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Patient ID is required." }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
    };
  }

  const updateExpression = [];
  const expressionAttributeValues = {};
  const expressionAttributeNames = {};

  if (name) {
    updateExpression.push("#name = :name");
    expressionAttributeValues[":name"] = name;
    expressionAttributeNames["#name"] = "name";
  }
  if (age) {
    updateExpression.push("#age = :age");
    expressionAttributeValues[":age"] = age;
    expressionAttributeNames["#age"] = "age";
  }
  if (issue) {
    updateExpression.push("#issue = :issue");
    expressionAttributeValues[":issue"] = issue;
    expressionAttributeNames["#issue"] = "issue";
  }
  if (phoneNumber) {
    updateExpression.push("#phoneNumber = :phoneNumber");
    expressionAttributeValues[":phoneNumber"] = phoneNumber;
    expressionAttributeNames["#phoneNumber"] = "phoneNumber";
  }
  if (email) {
    updateExpression.push("#email = :email");
    expressionAttributeValues[":email"] = email;
    expressionAttributeNames["#email"] = "email";
  }
  if (address) {
    updateExpression.push("#address = :address");
    expressionAttributeValues[":address"] = address;
    expressionAttributeNames["#address"] = "address";
  }
  if (allergies) {
    updateExpression.push("#allergies = :allergies");
    expressionAttributeValues[":allergies"] = allergies;
    expressionAttributeNames["#allergies"] = "allergies";
  }
  if (emergencyContactName) {
    updateExpression.push("#emergencyContactName = :emergencyContactName");
    expressionAttributeValues[":emergencyContactName"] = emergencyContactName;
    expressionAttributeNames["#emergencyContactName"] = "emergencyContactName";
  }
  if (emergencyContactPhone) {
    updateExpression.push("#emergencyContactPhone = :emergencyContactPhone");
    expressionAttributeValues[":emergencyContactPhone"] = emergencyContactPhone;
    expressionAttributeNames["#emergencyContactPhone"] =
      "emergencyContactPhone";
  }
  if (appointmentDate) {
    updateExpression.push("#appointmentDate = :appointmentDate");
    expressionAttributeValues[":appointmentDate"] = appointmentDate;
    expressionAttributeNames["#appointmentDate"] = "appointmentDate";
  }
  if (appointmentTime) {
    updateExpression.push("#appointmentTime = :appointmentTime");
    expressionAttributeValues[":appointmentTime"] = appointmentTime;
    expressionAttributeNames["#appointmentTime"] = "appointmentTime";
  }

  if (updateExpression.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No update values provided." }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
    };
  }

  const params = {
    TableName: "PatientsTable",
    Key: { patientId },
    UpdateExpression: `SET ${updateExpression.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDb.update(params).promise();

    const eventParams = {
      Entries: [
        {
          Source: "com.termproject.patient",
          DetailType: "PatientUpdated",
          Detail: JSON.stringify({
            patientId,
            name,
            age,
            issue,
            phoneNumber,
            email,
            address,
            allergies,
            emergencyContactName,
            emergencyContactPhone,
            appointmentDate,
            appointmentTime,
          }),
          EventBusName: "default",
        },
      ],
    };

    await eventBridge.putEvents(eventParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        // "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
    };
  } catch (error) {
    console.error("Error updating patient:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        // "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
    };
  }
};
