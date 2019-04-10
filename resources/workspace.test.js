const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');
const { FLOW_API_URL } = require('../utils/constants');

describe('Workspace', function () {
  let bundle;
  beforeEach(function () {
    // Mock request for getting a single workspace
    nock(FLOW_API_URL)
      .get('/workspaces/99')
      .query({
        organization_id: 1,
      })
      .reply(200, {
        workspace: {
          id: 99,
          name: 'I am a workspace',
        },
      });

    // Mock request for getting a list of workspaces
    nock(FLOW_API_URL)
      .get('/workspaces')
      .query({
        organization_id: 1,
      })
      .reply(200, {
        workspaces: [{
          id: 1,
          name: 'Workspace 1',
        },
        {
          id: 2,
          name: 'Workspace 2',
        }],
      });

    bundle = {
      authData: {
        accessToken: 'fakeTestAccessToken',
        orgId: 1,
      },
    };
  });

  describe('Get', function () {
    it('should get a single workspace', function (done) {
      bundle.inputData = {
        id: 99,
      };

      appTester(App.resources.workspace.get.operation.perform, bundle).then(function (results) {
        expect(results.id).toEqual(99);
        expect(results.name).toEqual('I am a workspace');
        done();
      });
    });
  });

  describe('List', function () {
    it('should load a list of workspaces', function (done) {
      appTester(App.resources.workspace.list.operation.perform, bundle).then(function (results) {
        expect(results.length).toEqual(2);
        expect(results[0].id).toEqual(1);
        expect(results[1].id).toEqual(2);
        done();
      });
    });
  });
});
