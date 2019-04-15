const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');
const { FLOW_API_URL } = require('../utils/constants');

describe('CompletedTask', function () {
  let bundle;
  beforeEach(function () {
    // Mock request for getting a list of completed tasks
    nock(FLOW_API_URL)
      .get('/tasks')
      .query((queryObject) => {
        if (!queryObject.completed_after) {
          return false;
        }

        if (!queryObject.organization_id) {
          return false;
        }

        if (!queryObject.order) {
          return false;
        }

        return true;
      })
      .reply(200, {
        tasks: [{
          id: 37,
          name: 'My test task one',
          completed: true,
        },
        {
          id: 32,
          name: 'My test task two',
          completed: true,
        },
        {
          id: 44,
          name: 'My test task three',
          completed: true,
        }],
      });

    bundle = {
      authData: {
        accessToken: 'fakeTestAccessToken',
        orgId: 1,
      },
    };
  });

  describe('List', function () {
    it('should load a list of completed tasks', function (done) {
      appTester(App.triggers.completedTask.operation.perform, bundle).then(function (results) {
        expect(results.length).toEqual(3);
        expect(results[0].id).toEqual(37);
        expect(results[0].completed).toBeTruthy();
        expect(results[1].id).toEqual(32);
        expect(results[1].completed).toBeTruthy();
        expect(results[2].id).toEqual(44);
        expect(results[2].completed).toBeTruthy();
        done();
      });
    });
  });
});
