import dotenv from 'dotenv';
import express from 'express';
import axios, { HttpStatusCode } from 'axios';
import { CustomLogger } from './services/customLogger';

dotenv.config()
const app = express();
const PORT = +process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {
    const recepient = req.originalUrl.split('/')[1];
    const recepientURL = process.env[recepient];

    if (recepientURL) {
        const axiosConfig = {
            method: req.method,
            url: `${recepientURL}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
        }
    
        axios(axiosConfig)
            .then((response) => {
                res.json(response.data)
            })
            .catch((err) => {
                CustomLogger.logError(`Error: ${err.message}. Code: ${err.code || err.statusCode || 'unknown'}`)
                if (err.response) {
                    const { status, data } = err.response;
                    res.status(status).json(data);
                } else {
                    res.status(HttpStatusCode.InternalServerError).json({ error: err.message });
                }
            })
    } else {
        res.status(502).json({ error: 'Cann\'t process request' });
    }
});

app.listen(PORT, () => {
    CustomLogger.log(`App listening at port ${PORT}`);
})