const { products } = require('../products-data/products');
const handler = require('../handlers/getProductsList');

describe('getProductsList endpoint handler test', () => {
    test('returns proper response data', async () => {
        const expectedResponce = {
            statusCode: 200,
            body: JSON.stringify(products)
        };
        const response = await handler.products();
        expect(response).toMatchObject(expectedResponce);
    });
});