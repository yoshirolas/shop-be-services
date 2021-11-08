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
        const serviceResponse = await axios({
            method: method,
            url: getUrl(),
            data: Object.keys(body).length > 0 ? body : null
        });

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