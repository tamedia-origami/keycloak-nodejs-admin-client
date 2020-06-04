/**
 * https://www.keycloak.org/docs-api/10.0/rest-api/index.html#_authenticatorconfigrepresentation
 */

export default interface AuthenticatorConfigRepresentation {
    alias?: string;
    config?: Record<string, any>;
    id?: string;
}
