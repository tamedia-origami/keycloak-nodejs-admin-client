/**
 * https://www.keycloak.org/docs-api/10.0/rest-api/index.html#_authenticationexecutionrepresentation
 */
export default interface AuthenticationExecutionRepresentation {
    authenticator?: string;
    authenticatorConfig?: string;
    authenticatorFlow?: boolean;
    autheticatorFlow?: boolean;
    flowId?: string;
    id?: string;
    parentFlow?: string;
    priority?: number;
    requirement?: string;
}
