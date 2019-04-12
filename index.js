const auth = require('./auth');

const includeApiKeyHeader = (request, z, bundle) => {
  if (bundle.authData.accessToken) {
    request.headers.Authorization = `Bearer ${bundle.authData.accessToken}`;
    request.params.organization_id = bundle.authData.orgId;
  }
  return request;
};

const Task = require('./resources/task');
const CompletedTask = require('./resources/completedTask');
const List = require('./resources/list');
const Workspace = require('./resources/workspace');
const Account = require('./triggers/account');
const Section = require('./triggers/section');

// Now we can roll up all our behavios in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: auth,

  beforeRequest: [includeApiKeyHeader],

  afterResponse: [],

  // If you want your resource to show up, you better include it here!
  resources: {
    [Task.key]: Task,
    [CompletedTask.key]: CompletedTask,
    [List.key]: List,
    [Workspace.key]: Workspace,
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [Section.key]: Section,
    [Account.key]: Account,
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {},
};

// Finally, export the app.
module.exports = App;
