const { products } = require('../products-data/products');
const handler = require('../handlers/getProductById');

describe('getProductById endpoint handler test', () => {
    const mockEvent = {
        pathParameters: {
            productId: null
        }
    };
    const notExistProductId = 'notExistId';
    const existProduct = products[0];
    const existProductId = existProduct.id;
    const expectedResponce = {
        statusCode: 200,
        body: JSON.stringify(existProduct)
    };

    test('returns status 400 on wrong path', async () => {
        const response = await handler.product(mockEvent);
        expect(response.statusCode).toBe(400);  
    });

    test('returns status 404 for not exist productId', async () => {
        mockEvent.pathParameters.productId = notExistProductId;
        const response = await handler.product(mockEvent);
        expect(response.statusCode).toBe(404);  
    });

    test('returns proper response data', async () => {
        mockEvent.pathParameters.productId = existProductId;
        const response = await handler.product(mockEvent);
        expect(response).toMatchObject(expectedResponce);  
    });
});