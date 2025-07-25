import dotenv from "dotenv";
import setupServer from "./server.js";
import InitMongoConnection from "./db/InitMongoConnection.js";

const startServer = async () => {
    await InitMongoConnection();
    await setupServer();
};

startServer();