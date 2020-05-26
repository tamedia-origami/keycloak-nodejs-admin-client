/**
 * https://www.keycloak.org/docs-api/10.0/rest-api/index.html#_authenticationexecutioninforepresentation
 */

export default interface AuthenticationExecutionInfoRepresentation {
    alias?: string;
    authenticationConfig?: string;
    authenticationFlow?: boolean;
    configurable?: boolean;
    displayName?: string;
    flowId?: string;
    id?: string;
    index?: number;
    level?: number;
    providerId?: string;
    requirement?: string;
    requirementChoices?: string[];
}
