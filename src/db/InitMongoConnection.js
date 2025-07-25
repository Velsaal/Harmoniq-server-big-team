import mongoose from "mongoose";
import pino from "pino";

const logger = pino({
    transport: {
        target: "pino-pretty",
    },
});

const InitMongoConnection = async () => {
    try {
        const {MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB} = process.env;
        const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=HarmoniqDB`;
        logger.info("Connection to MongoDB established");
    } catch (error) {
        logger.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};

export default InitMongoConnection; 