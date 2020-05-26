/**
 * https://www.keycloak.org/docs-api/10.0/rest-api/index.html#_authenticationexecutionexportrepresentation
 */

export default interface AuthenticationExecutionExportRepresentation {
    authenticator?: string;
    authenticatorConfig?: string;
    authenticatorFlow?: boolean;
    autheticatorFlow?: boolean;
    flowAlias?: string;
    priority?: number;
    requirement?: string;
    userSetupAllowed?: boolean
}
