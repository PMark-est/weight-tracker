import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.SAMPLE_TABLE;

export const putWeightsHandler = async (event) => {
    if (event.httpMethod !== "PUT") {
        throw new Error(
            `putWeightsHandler only accepts PUT method, you tried: ${event.httpMethod}`
        );
    }

    console.info("Received event:", event);

    const id = event.pathParameters?.id;
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing id in path" }),
        };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON in request body" }),
        };
    }

    if (body.weight === undefined) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing weight in request body" }),
        };
    }

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

    const params = {
        TableName: tableName,
        Key: { id },
        UpdateExpression: "SET #w = :w",
        ExpressionAttributeNames: { "#w": "weight" },
        ExpressionAttributeValues: { ":w": body.weight },
        ReturnValues: "ALL_NEW"
    };

    try {
        const data = await ddbDocClient.send(new UpdateCommand(params));
        console.info(`Updated item: ${JSON.stringify(data.Attributes)}`);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "PUT,OPTIONS"
            },
            body: JSON.stringify(data.Attributes),
        };

    } catch (err) {
        console.error("Error updating item:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not update item" }),
        };
    }
};
