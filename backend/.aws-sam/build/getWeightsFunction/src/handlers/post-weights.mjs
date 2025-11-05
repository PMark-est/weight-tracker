// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from "uuid";
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const postWeightsHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const id = uuidv4();
    const weight = body.weight;
    const timestamp = new Date().toISOString();

    if (typeof weight !== "number" || isNaN(weight)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Weight must be a number" }),
        };
    }

    if (weight < 25 || weight > 250) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Weight must be between 25 and 250 kg" }),
        };
    }

    const newItem = { id, weight, timestamp }

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName: tableName,
        Item: newItem
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added", data);
    } catch (err) {
        console.log("Error", err.stack);
    }

    const response = {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
        body: JSON.stringify(newItem)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
