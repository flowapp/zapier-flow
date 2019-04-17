const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');
const { FLOW_API_URL } = require('../utils/constants');

describe('Hydrators', function () {
  let bundle;
  beforeEach(function () {
    bundle = {
      authData: {
        accessToken: 'fakeTestAccessToken',
        orgId: 1,
      },
    };
  });

  describe('getListName', function () {
    beforeEach(function () {
      bundle.inputData = {
        workspace_id: 1,
        id: 50,
      };

      nock(FLOW_API_URL)
        .get('/lists/50')
        .query({
          organization_id: 1,
          workspace_id: 1,
          include: 'sections',
        })
        .reply(200, {
          list: {
            id: 3,
            name: 'I am a list',
          },
        });
    });

    it('should return a list name', function (done) {
      appTester(App.hydrators.getListName, bundle).then(function (result) {
        expect(result).toEqual('I am a list');
        done();
      });
    });
  });

  describe('getSectionName', function () {
    beforeEach(function () {
      bundle.inputData = {
        workspace_id: 1,
        list_id: 50,
        id: 107,
      };

      nock(FLOW_API_URL)
        .get('/lists/50')
        .query({
          organization_id: 1,
          workspace_id: 1,
          include: 'sections',
        })
        .reply(200, {
          list: {
            id: 3,
            name: 'I am a list',
          },

          sections: [
            {
              id: 88,
              name: 'not the section you are looking for',
            },
            {
              id: 107,
              name: 'I am a section',
            },
            {
              id: 67,
              name: 'if this is what you are seeing, the test failed',
            },
          ],
        });
    });

    it('should return a section name', function (done) {
      appTester(App.hydrators.getSectionName, bundle).then(function (result) {
        expect(result).toEqual('I am a section');
        done();
      });
    });
  });

  describe('getAccountName', function () {
    beforeEach(function () {
      bundle.inputData = {
        workspace_id: 1,
        id: 42,
      };

      nock(FLOW_API_URL)
        .get('/memberships')
        .query({
          organization_id: 1,
          workspace_id: 1,
          include: 'accounts',
        })
        .reply(200, {
          memberships: [],

          accounts: [
            {
              id: 42,
              name: 'Jon Snow',
            },
            {
              id: 11,
              name: 'Arya Stark',
            },
            {
              id: 13,
              name: 'Sansa Stark',
            },
          ],
        });
    });

    it('should return an account name', function (done) {
      appTester(App.hydrators.getAccountName, bundle).then(function (result) {
        expect(result).toEqual('Jon Snow');
        done();
      });
    });
  });

  describe('getAccountNames', function () {
    beforeEach(function () {
      bundle.inputData = {
        workspace_id: 1,
        ids: [42, 13],
      };

      nock(FLOW_API_URL)
        .get('/memberships')
        .query({
          organization_id: 1,
          workspace_id: 1,
          include: 'accounts',
        })
        .reply(200, {
          memberships: [],

          accounts: [
            {
              id: 42,
              name: 'Jon Snow',
            },
            {
              id: 11,
              name: 'Arya Stark',
            },
            {
              id: 13,
              name: 'Sansa Stark',
            },
          ],
        });
    });

    it('should return a list of accont names', function (done) {
      appTester(App.hydrators.getAccountNames, bundle).then(function (result) {
        expect(result).toEqual(['Jon Snow', 'Sansa Stark']);
        done();
      });
    });
  });

  describe('getWorkspaceName', function () {
    beforeEach(function () {
      bundle.inputData = {
        id: 1,
      };

      nock(FLOW_API_URL)
        .get('/workspaces/1')
        .query({
          organization_id: 1,
        })
        .reply(200, {
          workspace: {
            id: 3,
            name: 'I am a workspace',
          },
        });
    });

    it('should return a workspace name', function (done) {
      appTester(App.hydrators.getWorkspaceName, bundle).then(function (result) {
        expect(result).toEqual('I am a workspace');
        done();
      });
    });
  });
});
