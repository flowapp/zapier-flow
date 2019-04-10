const { FLOW_API_URL } = require('../utils/constants');

const listWorkspaces = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/workspaces`,
      params: {
        organization_id: bundle.authData.orgId,
      },
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => json.workspaces);
};

const getWorkspace = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/workspaces/${bundle.inputData.id}`,
      params: {
        organization_id: bundle.authData.orgId,
      },
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => json.workspace);
};

module.exports = {
  key: 'workspace',
  noun: 'Team',

  list: {
    display: {
      label: 'New Team',
      description: 'Triggers when a new team is added.',
    },
    operation: {
      perform: listWorkspaces,
      sample: {
        id: 1,
        name: 'Test team A',
        default: false,
        locked: true,
        manually_clear_completed_tasks: false,
        members_cound: 0,
        organization_id: 1,
      },
    },
  },

  get: {
    display: {
      label: 'Get Team',
      description: 'Gets a single team from Flow',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getWorkspace,
    },
  },
};
