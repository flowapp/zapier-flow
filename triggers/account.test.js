const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');

describe('Account', function () {
  let bundle;
  beforeEach(function () {
    // Mock request for getting a list of accounts
    nock('https://api.getflow.com')
      .get('/v2/memberships')
      .query({
        organization_id: 1,
        workspace_id: 8,
        include: 'accounts',
      })
      .reply(200, {
        memberships: [{
          id: 99,
          account_id: 7,
          workspace_id: 8,
          name: 'I am a membership',
        },
        {
          id: 87,
          account_id: 22,
          workspace_id: 8,
          name: 'I am another membership',
        }],
        accounts: [{
          id: 7,
          name: 'I am an account',
        },
        {
          id: 22,
          name: 'I am another account',
        }],
      });

    bundle = {
      authData: {
        accessToken: 'fakeTestAccessToken',
        orgId: 1,
      },
      inputData: {
        workspace: 8,
      },
    };
  });

  describe('List', function () {
    it('should load a list of accounts', function (done) {
      appTester(App.triggers.account.operation.perform, bundle).then(function (results) {
        expect(results.length).toEqual(2);
        expect(results[0].id).toEqual(7);
        expect(results[1].id).toEqual(22);
        done();
      });
    });
  });
});
