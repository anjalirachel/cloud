const AWS = require("aws-sdk");
const sns = new AWS.SNS();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getDoctorName = async (doctorId) => {
  const params = {
    TableName: "DoctorsTable",
    Key: { doctorId },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    return result.Item ? result.Item.name : "Unknown Doctor";
  } catch (error) {
    console.error("Error fetching doctor name:", error);
    throw new Error("Error fetching doctor name");
  }
};

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Extracting data from EventBridge event
  const { detail, "detail-type": detailType } = event;

  let notificationMessage;
  let snsParams;

  try {
    if (detailType === "PatientCreated") {
      // Ensure all required fields are present for PatientCreated
      const { patientId, name, doctorId, appointmentDate, appointmentTime } =
        detail;
      if (
        !patientId ||
        !name ||
        !doctorId ||
        !appointmentDate ||
        !appointmentTime
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required booking details" }),
          headers: { "Content-Type": "application/json" },
        };
      }

      const doctorName = await getDoctorName(doctorId);

      notificationMessage = `Hello ${name},\n\nYou have an appointment with ${doctorName} on ${appointmentDate} at ${appointmentTime}.\n\nThank you.`;
      snsParams = {
        Message: notificationMessage,
        Subject: "Appointment Confirmation",
        TopicArn: "arn:aws:sns:us-east-1:137387558344:PatientNotifications",
      };
    } else if (detailType === "PatientUpdated") {
      // Ensure all required fields are present for PatientUpdated
      const { patientId, name } = detail;
      if (!patientId || !name) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required update details" }),
          headers: { "Content-Type": "application/json" },
        };
      }

      notificationMessage = `Hello ${name},\n\nYour data has been updated successfully.\n\nThank you.`;
      snsParams = {
        Message: notificationMessage,
        Subject: "Data Update Confirmation",
        TopicArn: "arn:aws:sns:us-east-1:137387558344:PatientNotifications",
      };
    } else {
      throw new Error("Unknown event type");
    }

    await sns.publish(snsParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${
          detailType === "PatientCreated"
            ? "Appointment confirmation"
            : "Update confirmation"
        } notification processed successfully.`,
      }),
    };
  } catch (error) {
    console.error("Error processing notification:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
