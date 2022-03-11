import { Server } from "@hapi/hapi";
import "dotenv/config";
import { connectDB } from "./db/connect";
import { swaggerPlugins } from "./plugins/swagger";
import { todoRoute } from "./routes/todo";
import { initAgenda } from "./cron-job/agenda";

const server: Server = new Server({
    port: process.env.PORT,
    host: "localhost",
});

todoRoute(server);

const start = async (): Promise<void> => {
    try {
        await connectDB(process.env.MONGO_URL || "").then((db) => {
            console.log("Database is connected");
        });

        await server.register(swaggerPlugins);

        await server.start();

        console.log(`Server is running on ${server.info.uri}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();

initAgenda();
