const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');
const { FLOW_API_URL } = require('../utils/constants');

describe('Section', function () {
  let bundle;
  beforeEach(function () {
    // Mock request for getting a list of sections
    nock(FLOW_API_URL)
      .get('/lists/100')
      .query({
        organization_id: 1,
        workspace_id: 8,
        include: 'sections',
      })
      .reply(200, {
        list: {
          id: 100,
          name: 'I am a list',
        },
        sections: [{
          id: 7,
          name: 'I am a section',
        },
        {
          id: 22,
          name: 'I am another section',
        },
        {
          id: 45,
          name: 'I am a third section',
        }],
      });

    bundle = {
      authData: {
        accessToken: 'fakeTestAccessToken',
        orgId: 1,
      },
      inputData: {
        list: 100,
        workspace: 8,
      },
    };
  });

  describe('Section', function () {
    it('should load a list of sections', function (done) {
      appTester(App.triggers.section.operation.perform, bundle).then(function (results) {
        expect(results.length).toEqual(3);
        expect(results[0].id).toEqual(7);
        expect(results[1].id).toEqual(22);
        expect(results[2].id).toEqual(45);
        done();
      });
    });
  });
});
