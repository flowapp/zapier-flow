const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');

describe('Task', function () {
  let bundle;
  beforeEach(function () {
    // Mock request for getting a single task
    nock('https://api.getflow.com')
      .get('/v2/tasks/87')
      .query({
        organization_id: 1,
      })
      .reply(200, {
        task: {
          id: 87,
          name: 'You got it',
        },
      });

    // Mock request for getting a list of tasks
    nock('https://api.getflow.com')
      .get('/v2/tasks')
      .query({
        order: 'created_at',
        organization_id: 1,
      })
      .reply(200, {
        tasks: [{
          id: 37,
          name: 'My test task one',
        },
        {
          id: 32,
          name: 'My test task two',
        },
        {
          id: 44,
          name: 'My test task three',
        }],
      });

    // Mock request for creating a task
    nock('https://api.getflow.com')
      .post('/v2/tasks', {
        task: {
          workspace_id: 8,
          name: 'Creating a new task',
          owner_id: 9,
          list_id: 10,
          note_mime_type: 'text/x-markdown',
        },
      })
      .query({
        organization_id: 1,
      })
      .reply(200, {
        task: {
          id: 77,
          name: 'hey',
        },
      });

    bundle = {
      authData: {
        accessToken: 'fakeTestAccessToken',
        orgId: 1,
      },
    };
  });

  describe('Get', function () {
    it('should get a single task', function (done) {
      bundle.inputData = {
        id: 87,
      };

      appTester(App.resources.task.get.operation.perform, bundle).then(function (results) {
        expect(results.id).toEqual(87);
        expect(results.name).toEqual('You got it');
        done();
      });
    });
  });

  describe('List', function () {
    it('should load a list of tasks', function (done) {
      appTester(App.resources.task.list.operation.perform, bundle).then(function (results) {
        expect(results.length).toEqual(3);
        expect(results[0].id).toEqual(37);
        expect(results[1].id).toEqual(32);
        expect(results[2].id).toEqual(44);
        done();
      });
    });
  });

  describe('Create', function () {
    it('should create a task', function (done) {
      bundle.inputData = {
        workspace: 8,
        title: 'Creating a new task',
        assignee: 9,
        list: 10,
      };

      appTester(App.resources.task.create.operation.perform, bundle).then(function (results) {
        expect(results.id).toEqual(77);
        done();
      });
    });
  });
});
