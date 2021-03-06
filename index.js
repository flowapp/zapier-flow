const auth = require('./auth');

const includeApiKeyHeader = (request, z, bundle) => {
  if (bundle.authData.accessToken) {
    request.headers.Authorization = `Bearer ${bundle.authData.accessToken}`;
    request.params.organization_id = bundle.authData.orgId;
  }
  return request;
};

const Task = require('./resources/task');
const List = require('./resources/list');
const Workspace = require('./resources/workspace');
const Account = require('./triggers/account');
const Section = require('./triggers/section');
const CompletedTask = require('./triggers/completedTask');
const hydrators = require('./utils/hydrators');

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
    [List.key]: List,
    [Workspace.key]: Workspace,
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [Section.key]: Section,
    [Account.key]: Account,
    [CompletedTask.key]: CompletedTask,
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {},

  hydrators,
};

// Finally, export the app.
module.exports = App;
