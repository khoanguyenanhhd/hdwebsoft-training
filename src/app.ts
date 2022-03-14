import { Server } from "@hapi/hapi";
import "dotenv/config";
import { connectDB } from "./db/connect";
import { swaggerPlugins } from "./plugins/swagger";
import { initAgenda } from "./cron-job/agenda";
import { authStrategyOptions } from "./plugins/jwt-auth";
import { getRoutes } from "./routes";

const server: Server = new Server({
    port: process.env.PORT,
    host: "localhost",
});

const start = async (): Promise<void> => {
    try {
        await connectDB(process.env.MONGO_URL || "").then((db) => {
            console.log("Database is connected");
        });

        await server.register(require("hapi-auth-jwt2"));
        server.auth.strategy("jwt", "jwt", authStrategyOptions);
        server.auth.default("jwt");

        await server.register(swaggerPlugins);

        getRoutes(server);

        await server.start();

        console.log(`Server is running on ${server.info.uri}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();

// initAgenda();
