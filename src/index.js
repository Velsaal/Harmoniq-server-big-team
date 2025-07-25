import dotenv from "dotenv";
import setupServer from "./server.js";
import InitMongoConnection from "./db/InitMongoConnection.js";

dotenv.config();

const startServer = async () => {
    await InitMongoConnection();
    await setupServer();
};

startServer();