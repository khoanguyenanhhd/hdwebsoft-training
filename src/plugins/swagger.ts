import * as Hapi from "@hapi/hapi";
import * as HapiSwagger from "hapi-swagger";
import inert from "@hapi/inert";
import vision from "@hapi/vision";

const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
        title: "Todo Api",
        description: "Todo Api Documentation",
        version: "1.0",
    },
    tags: [
        {
            name: "todos",
            description: "Api todos.",
        },
    ],
    documentationPath: "/docs",
};

export const swaggerPlugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
    {
        plugin: inert,
    },
    {
        plugin: vision,
    },
    {
        plugin: HapiSwagger,
        options: swaggerOptions,
    },
];
