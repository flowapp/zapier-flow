const { FLOW_API_URL } = require('../utils/constants');

const listProjects = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/lists`,
      params: {
        organization_id: bundle.authData.orgId,
        workspace_id: bundle.inputData.workspace,
        include: 'sections',
      },
    })
    .then((response) => JSON.parse(response.content))
    .then((json) => json.lists);
};

const getProject = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/lists/${bundle.inputData.id}`,
      params: {
        organization_id: bundle.authData.orgId,
        workspace_id: bundle.inputData.workspace,
      },
    })
    .then((response) => JSON.parse(response.content))
    .then((json) => json.list);
};

module.exports = {
  key: 'project',
  noun: 'Project',

  list: {
    display: {
      label: 'New Project',
      description: 'Trigger when a new project is added.',
    },
    operation: {
      perform: listProjects,
    },
  },

  get: {
    display: {
      label: 'Get Project',
      description: 'Gets a single project.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getProject,
    },
  },
};
