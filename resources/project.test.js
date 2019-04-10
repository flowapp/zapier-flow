const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');
const { FLOW_API_URL } = require('../utils/constants');

describe('Project', function () {
  let bundle;
  beforeEach(function () {
    // Mock request for getting a single project
    nock(FLOW_API_URL)
      .get('/lists/3')
      .query({
        organization_id: 1,
        workspace_id: 5,
      })
      .reply(200, {
        list: {
          id: 3,
          name: 'I am a list',
        },
      });

    // Mock request for getting a list of projects
    nock(FLOW_API_URL)
      .get('/lists')
      .query({
        organization_id: 1,
        workspace_id: 5,
        include: 'sections',
      })
      .reply(200, {
        lists: [{
          id: 1,
          name: 'List 1',
        },
        {
          id: 2,
          name: 'List 2',
        },
        {
          id: 3,
          name: 'List 3',
        },
        {
          id: 4,
          name: 'List 4',
        }],
      });

    bundle = {
      authData: {
        accessToken: 'fakeTestAccessToken',
        orgId: 1,
      },
      inputData: {
        workspace: 5,
      },
    };
  });

  describe('Get', function () {
    it('should get a single project', function (done) {
      bundle.inputData.id = 3;

      appTester(App.resources.project.get.operation.perform, bundle).then(function (results) {
        expect(results.id).toEqual(3);
        expect(results.name).toEqual('I am a list');
        done();
      });
    });
  });

  describe('List', function () {
    it('should load a list of projects', function (done) {
      appTester(App.resources.project.list.operation.perform, bundle).then(function (results) {
        expect(results.length).toEqual(4);
        expect(results[0].id).toEqual(1);
        expect(results[1].id).toEqual(2);
        expect(results[2].id).toEqual(3);
        expect(results[3].id).toEqual(4);
        done();
      });
    });
  });
});
