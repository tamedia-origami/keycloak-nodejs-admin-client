import Resource from './resource';
import RequiredActionProviderRepresentation from '../defs/requiredActionProviderRepresentation';
import {KeycloakAdminClient} from '../client';
import AuthenticationExecutionInfoRepresentation from "../defs/authenticationExecutionInfoRepresentation";
import AuthenticationFlowRepresentation from "../defs/authenticationFlowRepresentation";

export class AuthenticationManagement extends Resource {
  /**
   * Authentication Management
   * https://www.keycloak.org/docs-api/8.0/rest-api/index.html#_authentication_management_resource
   */

  //   Register a new required action
  public registerRequiredAction = this.makeRequest<Record<string, any>>({
    method: 'POST',
    path: '/register-required-action',
  });

  // Get required actions. Returns a list of required actions.
  public getRequiredActions = this.makeRequest<void>({
    method: 'GET',
    path: '/required-actions',
  });

  // Get required action for alias
  public getRequiredActionForAlias = this.makeRequest<{
    alias: string;
  }>({
    method: 'GET',
    path: '/required-actions/{alias}',
    urlParamKeys: ['alias'],
    catchNotFound: true,
  });

  // Update required action
  public updateRequiredAction = this.makeUpdateRequest<
    {alias: string},
    RequiredActionProviderRepresentation,
    void
  >({
    method: 'PUT',
    path: '/required-actions/{alias}',
    urlParamKeys: ['alias'],
  });

  // Delete required action
  public deleteRequiredAction = this.makeRequest<{alias: string}, void>({
    method: 'DELETE',
    path: '/required-actions/{alias}',
    urlParamKeys: ['alias'],
  });

  // Lower required action’s priority
  public lowerRequiredActionPriority = this.makeRequest<{
    alias: string;
  }>({
    method: 'POST',
    path: '/required-actions/{alias}/lower-priority',
    urlParamKeys: ['alias'],
  });

  // Raise required action’s priority
  public raiseRequiredActionPriority = this.makeRequest<{
    alias: string;
  }>({
    method: 'POST',
    path: '/required-actions/{alias}/raise-priority',
    urlParamKeys: ['alias'],
  });

  // Get unregistered required actions Returns a list of unregistered required actions.
  public getUnregisteredRequiredActions = this.makeRequest<void>({
    method: 'GET',
    path: '/unregistered-required-actions',
  });

  /**
   * Authentication flows
   */

  // Copy existing authentication flow under a new name.
  // The new name is given as 'newName' attribute of the passed JSON object
  // public copyAuthenticationFlow = this.makeRequest<
  //     {flowAlias: string},
  //     Record<string, any>
  //     >({
  //   method: 'POST',
  //   path: '/flows/{flowAlias}/copy',
  //   urlParamKeys: ['flowAlias'],
  // });

  // Get authentication flows
  public getAuthenticationFlows = this.makeRequest<void>({
    method: 'GET',
    path: '/flows'
  });

  // Get authentication flow for id
  public getAuthenticationFlowForId = this.makeRequest<{
    id: string;
  }, AuthenticationFlowRepresentation>({
    method: 'GET',
    path: '/flows/{id}',
    urlParamKeys: ['id'],
    catchNotFound: true,
  });

  // Create a new authentication flow
  public createAuthenticationFlow = this.makeRequest<AuthenticationFlowRepresentation>({
    method: 'POST',
    path: '/flows'
  });

  // Update an authentication flow
  public updateAuthenticationFlow = this.makeUpdateRequest<
      {id: string},
      AuthenticationFlowRepresentation
      >({
    method: 'PUT',
    path: '/flows/{id}',
    urlParamKeys: ['id'],
  });

  // Delete authentication flow
  public deleteAuthenticationFlow = this.makeRequest<{id: string}>({
    method: 'DELETE',
    path: '/flows/{id}',
    urlParamKeys: ['id'],
  });

  // // Get authentication executions for the flow
  // public getAuthenticationExecutions = this.makeRequest<{flowAlias: string}>({
  //   method: 'GET',
  //   path: '/flows/{flowAlias}/executions',
  //   urlParamKeys: ['flowAlias'],
  // });
  //
  // // Update authentication executions of a flow
  // public updateAuthenticationExecutions = this.makeUpdateRequest<
  //     {flowAlias: string},
  //     AuthenticationExecutionInfoRepresentation,
  //     void
  //     >({
  //   method: 'PUT',
  //   path: '/flows/{flowAlias}/executions',
  //   urlParamKeys: ['flowAlias'],
  // });
  //
  // // Add new authentication execution to a flow
  // public addAuthenticationExecution = this.makeRequest<
  //     {flowAlias: string},
  //     Record<string, any>
  //     >({
  //   method: 'POST',
  //   path: '/flows/{flowAlias}/executions/execution',
  //   urlParamKeys: ['flowAlias'],
  // });


  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/authentication',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }
}
