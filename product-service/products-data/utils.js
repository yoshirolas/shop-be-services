const { products } = require('./products');

const getProductsList = async () => {
    return await products;
};

const getProductById = async (id) => {
    return await products.find(p => p.id === id);
};

module.exports = {getProductsList, getProductById};