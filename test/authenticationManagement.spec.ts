// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import {RequiredActionAlias} from '../src/defs/requiredActionProviderRepresentation';
const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentRealm?: string;
    requiredActionProvider?: Record<string, any>;
    authenticationFlowProvider?: Record<string, any>;
    authenticationExecutionProvider?: Record<string, any>;
  }
}

describe('Authentication management', function() {
  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);
    const realmName = faker.internet.userName().toLowerCase();
    await this.kcAdminClient.realms.create({
      id: realmName,
      realm: realmName,
      enabled: true,
    });
    this.currentRealm = realmName;
    this.kcAdminClient.setConfig({
      realmName,
    });
  });

  after(async () => {
    // delete test realm
    // await this.kcAdminClient.realms.del({realm: this.currentRealm});
    // const realm = await this.kcAdminClient.realms.findOne({
    //   realm: this.currentRealm,
    // });
    // expect(realm).to.be.null;
  });

  /**
   * Required Actions
   */
  describe('Required Actions', () => {
    it('should delete required action by alias', async () => {
      await this.kcAdminClient.authenticationManagement.deleteRequiredAction({
        alias: RequiredActionAlias.UPDATE_PROFILE,
      });
    });

    it('should get unregistered required actions', async () => {
      const unregisteredReqActions = await this.kcAdminClient.authenticationManagement.getUnregisteredRequiredActions();
      expect(unregisteredReqActions).to.be.an('array');
      expect(unregisteredReqActions.length).to.be.least(1);
      this.requiredActionProvider = unregisteredReqActions[0];
    });

    it('should register new required action', async () => {
      const requiredAction = await this.kcAdminClient.authenticationManagement.registerRequiredAction(
        {
          providerId: this.requiredActionProvider.providerId,
          name: this.requiredActionProvider.name,
        },
      );
      expect(requiredAction).to.be.empty;
    });

    it('should get required actions', async () => {
      const requiredActions = await this.kcAdminClient.authenticationManagement.getRequiredActions();
      expect(requiredActions).to.be.an('array');
    });

    it('should get required action by alias', async () => {
      const requiredAction = await this.kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: this.requiredActionProvider.providerId},
      );
      expect(requiredAction).to.be.ok;
    });

    it('should update required action by alias', async () => {
      const requiredAction = await this.kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: this.requiredActionProvider.providerId},
      );
      const response = await this.kcAdminClient.authenticationManagement.updateRequiredAction(
        {alias: this.requiredActionProvider.providerId},
        {
          ...requiredAction,
          enabled: true,
          priority: 10,
        },
      );
      expect(response).to.be.empty;
    });

    it('should lower required action priority', async () => {
      const requiredAction = await this.kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: this.requiredActionProvider.providerId},
      );
      const response = await this.kcAdminClient.authenticationManagement.lowerRequiredActionPriority(
        {alias: this.requiredActionProvider.providerId},
      );
      expect(response).to.be.empty;
      const requiredActionUpdated = await this.kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: this.requiredActionProvider.providerId},
      );
      expect(requiredActionUpdated.priority).to.be.greaterThan(
        requiredAction.priority,
      );
    });

    it('should raise required action priority', async () => {
      const requiredAction = await this.kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: this.requiredActionProvider.providerId},
      );
      const response = await this.kcAdminClient.authenticationManagement.raiseRequiredActionPriority(
        {alias: this.requiredActionProvider.providerId},
      );
      expect(response).to.be.empty;
      const requiredActionUpdated = await this.kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: this.requiredActionProvider.providerId},
      );
      expect(requiredActionUpdated.priority).to.be.lessThan(
        requiredAction.priority,
      );
    });
  });

  /**
   * Authentication flows
   */
   describe("Authentication flows", () => {
     it('should create new authentication flow', async () => {
       const alias = faker.internet.userName();
       const authenticationFlow = await this.kcAdminClient.authenticationManagement.createAuthenticationFlow(
             {
               alias: alias,
               builtIn: false,
               description: "",
               providerId: "basic-flow",
               topLevel: true
             },
         );
       expect(authenticationFlow).to.be.empty;
     });

     it('should get authentication flows', async () => {
       const authenticationFlows = await this.kcAdminClient.authenticationManagement.getAuthenticationFlows();
       expect(authenticationFlows).to.be.an('array');
       this.authenticationFlowProvider = authenticationFlows[authenticationFlows.length - 1];
     });

     it('should get authentication flow by id', async () => {
       const authenticationFlow = await this.kcAdminClient.authenticationManagement.getAuthenticationFlowForId(
           {id: this.authenticationFlowProvider.id},
       );
       expect(authenticationFlow).to.be.ok;
     });

     it('should update authentication flow', async () => {
       const authenticationFlow = await this.kcAdminClient.authenticationManagement.getAuthenticationFlowForId(
           {id: this.authenticationFlowProvider.id},
       );
       const response = await this.kcAdminClient.authenticationManagement.updateAuthenticationFlow(
           {id: this.authenticationFlowProvider.id},
           {
             ...authenticationFlow,
             builtIn: false,
             description: 'test'
           },
       );
       expect(response.description).to.be.equal("test");
     });

     it('should add execution to authentication flow', async () => {
       const response = await this.kcAdminClient.authenticationManagement.addAuthenticationExecutionToFlow(
           {flowAlias: this.authenticationFlowProvider.alias},
           {provider: "reset-password"}
       );
       await this.kcAdminClient.authenticationManagement.addAuthenticationExecutionToFlow(
           {flowAlias: this.authenticationFlowProvider.alias},
           {provider: "reset-credentials-choose-user"}
       );
       expect(response).to.be.empty;
     });

     it('should add execution', async () => {
       const response = await this.kcAdminClient.authenticationManagement.addAuthenticationExecution(
           {authenticator: "reset-password-additional-step",  autheticatorFlow:false, priority: 30, requirement: "REQUIRED", parentFlow: this.authenticationFlowProvider.id}
       );
       expect(response).to.be.empty;
     });

     it('should get single execution', async () => {
       const executions = await this.kcAdminClient.authenticationManagement.getAuthenticationExecutions({flowAlias: this.authenticationFlowProvider.alias});
       const execution = await this.kcAdminClient.authenticationManagement.getExecutionForId(
           {executionId: executions[0].id},
       );
       expect(execution.authenticator).to.be.equal("reset-password");
       this.authenticationExecutionProvider = execution;
     });

     it('should update execution of authentication flow', async () => {
       const response = await this.kcAdminClient.authenticationManagement.updateAuthenticationExecutions(
           {flowAlias: this.authenticationFlowProvider.alias},
           {
             configurable: false,
             displayName: "Reset Password",
             flowId: this.authenticationFlowProvider.id,
             id: this.authenticationExecutionProvider.id,
             index: 0,
             level: 0,
             providerId: "reset-password",
             requirement: "ALTERNATIVE",}
         );
       console.log('UPDATED', response);

       expect(response).to.be.empty;
     });

     it('should lower execution priority', async () => {
       const execution = await this.kcAdminClient.authenticationManagement.getExecutionForId(
           {executionId: this.authenticationExecutionProvider.id},
       );
       const response = await this.kcAdminClient.authenticationManagement.lowerExecutionPriority(
           {executionId: this.authenticationExecutionProvider.id},
       );
       expect(response).to.be.empty;
       const executionUpdated = await this.kcAdminClient.authenticationManagement.getExecutionForId(
           {executionId: this.authenticationExecutionProvider.id},
       );
       expect(executionUpdated.priority).to.be.greaterThan(
           execution.priority,
       );
     });

     it('should raise execution priority', async () => {
       const execution = await this.kcAdminClient.authenticationManagement.getExecutionForId(
           {executionId: this.authenticationExecutionProvider.id},
       );
       const response = await this.kcAdminClient.authenticationManagement.raiseExecutionPriority(
           {executionId: this.authenticationExecutionProvider.id},
       );
       expect(response).to.be.empty;
       const executionUpdated = await this.kcAdminClient.authenticationManagement.getExecutionForId(
           {executionId: this.authenticationExecutionProvider.id},
       );
       expect(executionUpdated.priority).to.be.lessThan(
           execution.priority,
       );
     });
     //
     // it('should delete execution', async () => {
     //   await this.kcAdminClient.authenticationManagement.deleteExecution({
     //     executionId: this.authenticationExecutionProvider.id,
     //   });
     //   const execution = await this.kcAdminClient.authenticationManagement.getExecutionForId({
     //     executionId: this.authenticationExecutionProvider.id,
     //   });
     //   expect(execution).to.be.null;
     // });
     //
     // it('should delete authentication flow by id', async () => {
     //   await this.kcAdminClient.authenticationManagement.deleteAuthenticationFlow({
     //     id: this.authenticationFlowProvider.id,
     //   });
     //   const authenticationFlow = await this.kcAdminClient.authenticationManagement.getAuthenticationFlowForId({
     //     id: this.authenticationFlowProvider.id,
     //   });
     //   expect(authenticationFlow).to.be.null;
     // });
   })
});
