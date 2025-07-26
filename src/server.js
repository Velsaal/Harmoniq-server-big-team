import express from 'express';
import cors from 'cors';
import pino from 'pino';
import articleRouter from './routers/articleRouters.js';

const logger = pino({
    transport: {
        target: "pino-pretty",
    },
});

const app = express();

app.use(cors());
app.use(express.json());
// app.use('/authors');
app.use('/articles', articleRouter);

app.use((req, res) => {
    res.status(404).json({
        message: 'Not Found',
    });
});

const PORT = process.env.PORT || 3000;

const setupServer = async () => {
return new Promise((resolve) => {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
        resolve(app);
    });
});
};

export default setupServer;