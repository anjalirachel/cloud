const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const { patientId, fileName, fileContent, fileType } = JSON.parse(event.body);

        const params = {
            Bucket: 'anjalipatientreport',
            Key: `${patientId}/${fileName}`,
            Body: Buffer.from(fileContent, 'base64'),
            ContentType: fileType
        };

        await s3.putObject(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully!' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }
        };
    } catch (error) {
        console.error('Error uploading file: ', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error uploading file' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }
        };
    }
};
