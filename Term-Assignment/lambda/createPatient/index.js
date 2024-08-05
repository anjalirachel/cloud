const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");
const eventBridge = new AWS.EventBridge();

const getAvailableDoctor = async () => {
  const params = {
    TableName: "DoctorsTable",
    FilterExpression: "isAvailable = :true",
    ExpressionAttributeValues: {
      ":true": true,
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    const availableDoctors = result.Items;
    if (availableDoctors.length === 0) throw new Error("No available doctors");
    const selectedDoctor =
      availableDoctors[Math.floor(Math.random() * availableDoctors.length)];
    return selectedDoctor.doctorId;
  } catch (error) {
    console.error("Error fetching available doctor:", error);
    throw new Error("Error fetching available doctor");
  }
};

const generateRandomFutureDate = () => {
  const today = new Date();
  const futureDate = new Date(today);
  const randomDays = Math.floor(Math.random() * 30) + 1; // Random day between 1 and 30
  futureDate.setDate(today.getDate() + randomDays);
  return futureDate.toISOString().split("T")[0]; // Return date in YYYY-MM-DD format
};

const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 9) + 9; // Random hour between 9 and 17
  const minutes = Math.floor(Math.random() * 60); // Random minute between 0 and 59
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 || 12;
  return `${formattedHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

exports.handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request body is missing." }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins or specify your domain
      },
    };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON format." }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins or specify your domain
      },
    };
  }

  const {
    name,
    age,
    issue,
    phoneNumber,
    email,
    address,
    allergies,
    emergencyContactName,
    emergencyContactPhone,
  } = requestBody;

  try {
    const doctorId = await getAvailableDoctor();
    const appointmentDate = generateRandomFutureDate();
    const appointmentTime = generateRandomTime();
    const patientId = uuid.v4();
    const params = {
      TableName: "PatientsTable",
      Item: {
        patientId,
        name,
        age,
        createdAt: new Date().toISOString(),
        issue: issue || "No issue specified",
        phoneNumber: phoneNumber || "",
        email: email || "",
        address: address || "",
        doctorId,
        allergies: allergies || "",
        emergencyContactName: emergencyContactName || "",
        emergencyContactPhone: emergencyContactPhone || "",
        appointmentDate,
        appointmentTime,
      },
    };

    await dynamoDb.put(params).promise();

    // Publish event to EventBridge
    const eventParams = {
      Entries: [
        {
          Source: "com.termproject.patient",
          DetailType: "PatientCreated",
          Detail: JSON.stringify({
            patientId,
            name,
            doctorId,
            appointmentDate,
            appointmentTime,
          }),
          EventBusName: "default", // Change if you are using a custom event bus
        },
      ],
    };

    await eventBridge.putEvents(eventParams).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Patient created and event published to EventBridge!",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins or specify your domain
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins or specify your domain
      },
    };
  }
};
