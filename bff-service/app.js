const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const axios = require('axios').default;

const services = [
    {
        serviceName: 'product-service',
        servicePathIdentificator: 'products',
        serviceUrl: 'https://ujhvl08zyb.execute-api.eu-west-1.amazonaws.com/dev'
    }
];

const CACHE_LIVE_TIME_MS = 2 * 60 * 1000; //2 minutes

class Cache {
    constructor() {
        this.expiredDate = null;
        this.data = null;
    }

    isActual = () => this.expiredDate && Date.now() <= this.expiredDate;

    getData = () => {
        return this.isActual() && this.data ? this : {};
    };

    setData = (data) => {
        this.data = data;
        this.expiredDate = Date.now() + CACHE_LIVE_TIME_MS
    };
};
const cachedQuery = {
    method: 'GET',
    path: '/products'
};
const isCachedQuery = (method, path) => method === cachedQuery.method && path === cachedQuery.path;

const productsCahce = new Cache();

app.use(express.json());

app.all('*', async (req, res) => {
    try {
        const { method, path, body } = req;
        // console.log(method)
        // console.log(path)
        // console.log(body)
        const recipientService = services.find(service => service.servicePathIdentificator === path.split('/')[1]);
        if (!recipientService) throw new Error();

        const getUrl = () => `${recipientService.serviceUrl}${path}`;

        const serviceResponse = isCachedQuery(method, path) && productsCahce.isActual()
            ? productsCahce.getData()
            : await axios({
                method: method,
                url: getUrl(),
                data: Object.keys(body).length > 0 ? body : null
            });

        if (isCachedQuery(method, path) && !productsCahce.isActual()) {
            productsCahce.setData(serviceResponse.data);
        }

        res.send(JSON.stringify(serviceResponse.data));

    } catch (error) {
        const errorStatus = error.status || 502;
        const errorMessage = error.message || 'Cannot process request';
        res.status(errorStatus).send(errorMessage);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})