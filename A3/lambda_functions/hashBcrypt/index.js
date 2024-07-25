const { hash } = require('bcryptjs');
const axios = require('axios');

exports.handler = async (event) => {
    try {
        const { value } = event;

        if (!value) {
            throw new Error('Value is missing in the event object');
        }

        // Ensure the value is encoded in UTF-8
        const utf8Value = Buffer.from(value, 'utf-8').toString();

        // Use 12 rounds of salt (cost factor)
        const hashedValue = await hash(utf8Value, 12);

        const response = {
            'banner': "B00943351",
            'result': hashedValue,
            'arn': 'arn:aws:lambda:us-east-1:137387558344:function:hashBcrypt',
            'action': 'bcrypt',
            'value': utf8Value
        };

        await axios.post('http://129.173.67.234:8080/serverless/end', response);
        console.log('Response sent successfully.');

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
