const _baseUrl = 'https://api.getflow.com/v2'

const listWorkspaces = (z, bundle) => {
  return z
    .request({
      url: `${_baseUrl}/workspaces`,
      params: {
        organization_id: bundle.authData.orgId,
      },
    })
    .then(response => JSON.parse(response.content))
    .then(json => json.workspaces)
}

const getWorkspace = (z, bundle) => {
  return z
    .request({
      url: `${_baseUrl}/workspaces/${bundle.inputData.id}`,
      params: {
        organization_id: bundle.authData.orgId,
      },
    })
    .then(response => JSON.parse(response.content))
    .then(json => json.workspace)
}

module.exports = {
  key: 'workspace',
  noun: 'Workspace',

  list: {
    display: {
      label: 'New Workspace',
      description: 'Trigger when a new workspace is added',
    },
    operation: {
      perform: listWorkspaces,
    },
  },

  get: {
    display: {
      label: 'Get Workspace',
      description: 'Gets a workspace',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getWorkspace,
    },
  },
}
