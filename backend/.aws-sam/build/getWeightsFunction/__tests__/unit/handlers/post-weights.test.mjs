import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { postWeightsHandler } from '../../../src/handlers/post-weights.mjs';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('postWeightsHandler', () => {
    beforeEach(() => {
        ddbMock.reset();
        process.env.SAMPLE_TABLE = 'TestTable';
    });

    it('should successfully create a weight entry', async () => {
        ddbMock.on(PutCommand).resolves({});

        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                weight: 75.5,
            })
        };

        const result = await postWeightsHandler(event);

        expect(result.statusCode).toBe(201);
    });
});
