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
    authenticationFlowProvider?: string;
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
       this.authenticationFlowProvider = alias;
     });

     it('should get authentication flows', async () => {
       const authenticationFlows = await this.kcAdminClient.authenticationManagement.getAuthenticationFlows();
       expect(authenticationFlows).to.be.an('array');
     });

     it('should get authentication flow by id', async () => {
       const authenticationFlows = await this.kcAdminClient.authenticationManagement.getAuthenticationFlows();
       const authenticationFlowToGet = authenticationFlows.filter(flow => {
         return flow.alias === this.authenticationFlowProvider;
       });

       const authenticationFlow = await this.kcAdminClient.authenticationManagement.getAuthenticationFlowForId(
           {id: authenticationFlowToGet.id},
       );
       expect(authenticationFlow).to.be.ok;
     });
     //
     // it('should update authentication flow', async () => {
     //   const authenticationFlow = await this.kcAdminClient.authenticationManagement.getAuthenticationFlowForId(
     //       {id: this.authenticationFlowProvider.id},
     //   );
     //   const response = await this.kcAdminClient.authenticationManagement.updateAuthenticationFlow(
     //       {id: this.authenticationFlowProvider.id},
     //       {
     //         ...authenticationFlow,
     //         builtIn: false,
     //         description: 'test',
     //       },
     //   );
     //   expect(response).to.be.empty;
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
