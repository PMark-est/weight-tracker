import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { deleteWeightsHandler } from '../../../src/handlers/delete-weights.mjs';


const ddbMock = mockClient(DynamoDBDocumentClient);

describe('deleteWeightsHandler', () => {
    beforeEach(() => {
        ddbMock.reset();
        process.env.SAMPLE_TABLE = 'TestTable';
    });

    it('should successfully delete a weight entry', async () => {
        ddbMock.on(DeleteCommand).resolves({});

        const event = {
            httpMethod: 'DELETE',
            pathParameters: {
                id: '63b97392-639d-451b-8813-ab7c0602db13'
            }
        };

        const result = await deleteWeightsHandler(event);

        expect(result.statusCode).toBe(200);
    });

    it('should return 400 when id is missing', async () => {
        const event = {
            httpMethod: 'DELETE',
            pathParameters: {}
        };

        const result = await deleteWeightsHandler(event);

        expect(result.statusCode).toBe(400);
    });
});
