import { Server } from "@hapi/hapi";
import { authRoute } from "./auth";
import { todoRoute } from "./todo";
import { eventRoute } from "./event";

export const getRoutes = (server: Server): void => {
    todoRoute(server);
    authRoute(server);
    eventRoute(server);
};
