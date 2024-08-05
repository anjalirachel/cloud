const AWS = require("aws-sdk");
const sns = new AWS.SNS();
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const moment = require('moment-timezone');

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

const getAppointmentsForTomorrow = async () => {
  const now = moment(); // Current time in UTC
  const tomorrow = now.clone().add(1, 'days'); // Add one day to get tomorrow
  
  // Convert to Halifax time zone
  const formattedDate = tomorrow.tz('America/Halifax').format('YYYY-MM-DD');

  console.log(`Fetching appointments for: ${formattedDate}`);

  const params = {
    TableName: "PatientsTable",
    FilterExpression: "#appointmentDate = :formattedDate",
    ExpressionAttributeNames: {
      "#appointmentDate": "appointmentDate",
    },
    ExpressionAttributeValues: {
      ":formattedDate": formattedDate,
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    console.log(result);
    return result.Items || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Error fetching appointments");
  }
};

exports.handler = async () => {
  try {
    const appointments = await getAppointmentsForTomorrow();
    console.log("Appointments for tomorrow:", appointments);

    for (const appointment of appointments) {
      const { patientId, name, doctorId, appointmentDate, appointmentTime } =
        appointment;

      if (
        !patientId ||
        !name ||
        !doctorId ||
        !appointmentDate ||
        !appointmentTime
      ) {
        console.error("Missing required appointment details:", appointment);
        continue;
      }

      const doctorName = await getDoctorName(doctorId);

      const notificationMessage = `Hello ${name},\n\nThis is a reminder for your appointment with ${doctorName} on ${appointmentDate} at ${appointmentTime}.\n\nThank you.`;
      const snsParams = {
        Message: notificationMessage,
        Subject: "Appointment Reminder",
        TopicArn: "arn:aws:sns:us-east-1:137387558344:PatientNotifications",
      };

      await sns.publish(snsParams).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Reminder notifications sent successfully.",
      }),
    };
  } catch (error) {
    console.error("Error processing reminder notifications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
