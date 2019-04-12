const { FLOW_API_URL } = require('../utils/constants');

/*
  * Method to convert API workspace response to trim down unneeded values
  * When Zapier populates the action part of the form it grabs all items from the workspace response
  * without any discrimination. Many of the items are poorly labelled and not likely to be needed for any integration.
  *
  * In order to help clean up the noise, this method cherry-picks the values that seem important to expose to Zapier.
  *
  * @param {Object} Workspace
  * @return {Object} Workspace
*/
function parseWorkspace(workspace) {
  return {
    id: workspace.id,
    name: workspace.name,
    created_at: workspace.created_at,
    updated_at: workspace.updated_at,
    default: workspace.default,
    locked: workspace.locked,
    manually_clear_completed_tasks: workspace.manually_clear_completed_tasks,
    members_count: workspace.members_count,
    organization_id: workspace.organization_id,
  };
}

/*
 * Get all workspaces that the current user is a member of
*/
const getWorkspaces = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/workspaces`,
      params: {
        organization_id: bundle.authData.orgId,
        view: 'member',
      },
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => json.workspaces.map(parseWorkspace));
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
    .then((json) => parseWorkspace(json.workspace));
};

module.exports = {
  key: 'workspace',
  noun: 'Team',

  list: {
    display: {
      label: 'New Team',
      description: 'This hidden trigger is used to populate workspace dropdowns.',
      hidden: true,
    },
    operation: {
      perform: getWorkspaces,
      sample: {
        id: 1,
        name: 'Test team A',
        default: false,
        locked: true,
        manually_clear_completed_tasks: false,
        members_count: 0,
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
