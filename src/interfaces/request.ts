import * as Hapi from "@hapi/hapi";

export interface CredentialInterface extends Hapi.AuthCredentials {
    id: string;
}

export interface RequestAuthInterface extends Hapi.RequestAuth {
    credentials: CredentialInterface;
}

export interface RequestInterface extends Hapi.Request {
    auth: RequestAuthInterface;
}

export interface LoginInterface extends RequestInterface {
    payload: {
        username: string;
        email: string;
        password: string;
    };
}
