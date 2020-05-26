/**
 * https://www.keycloak.org/docs-api/10.0/rest-api/index.html#_authenticationflowrepresentation
 */
import AuthenticationExecutionExportRepresentation from "./authenticationExecutionExportRepresentation";

export default interface AuthenticationFlowRepresentation {
    alias?: string;
    authenticationExecutions?: AuthenticationExecutionExportRepresentation [];
    builtIn?: boolean;
    description?: string;
    id?: string;
    providerId?: string;
    topLevel?: boolean
}
