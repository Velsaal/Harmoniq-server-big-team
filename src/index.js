import dotenv from "dotenv";
import InitMongoConnection from "./db/InitMongoConnection.js";
import "./server.js";

dotenv.config();
await InitMongoConnection();

