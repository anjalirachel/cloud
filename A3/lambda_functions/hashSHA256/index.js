const { createHash } = require('crypto');
const axios = require('axios');

exports.handler = async (event) => {
    // Check if 'value' is present in the event object
    if (!event.value) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Value is missing in the event object' })
        };
    }

    const { value } = event;
    const hashedValue = createHash('sha256').update(value).digest('hex');

    const response = {
        banner: "B00943351",
        result: hashedValue,
        arn: "arn:aws:lambda:us-east-1:137387558344:function:hashSHA256",
        action: 'sha256',
        value: value
    };

    try {
        await axios.post('http://129.173.67.234:8080/serverless/end', response);
        console.log('Response sent successfully.');
    } catch (error) {
        console.error('Error sending response:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error sending response' })
        };
    }

    return response;
}