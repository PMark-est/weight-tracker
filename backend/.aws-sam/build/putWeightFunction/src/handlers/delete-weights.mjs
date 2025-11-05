import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.SAMPLE_TABLE;

export const deleteWeightsHandler = async (event) => {
    if (event.httpMethod !== "DELETE") {
        throw new Error(
            `deleteWeightHandler only accepts DELETE method, you tried: ${event.httpMethod}`
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

    const params = {
        TableName: tableName,
        Key: { id },
    };

    try {
        await ddbDocClient.send(new DeleteCommand(params));
        console.info(`Deleted item with id: ${id}`);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "DELETE,OPTIONS"
            },
            body: JSON.stringify({ message: `Item with id ${id} deleted` }),
        };

    } catch (err) {
        console.error("Error deleting item:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not delete item" }),
        };
    }
};
