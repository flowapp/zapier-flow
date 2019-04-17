const { FLOW_API_URL } = require('./constants');

const getListName = function (z, bundle) {
  return z.request({
    url: `${FLOW_API_URL}/lists/${bundle.inputData.id}`,
    params: {
      organization_id: bundle.authData.orgId,
      workspace_id: bundle.inputData.workspace_id,
      include: 'sections',
    },
  })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => (json.list && json.list.name) || '');
};

const getSectionName = function (z, bundle) {
  return z.request({
    url: `${FLOW_API_URL}/lists/${bundle.inputData.list_id}`,
    params: {
      organization_id: bundle.authData.orgId,
      workspace_id: bundle.inputData.workspace_id,
      include: 'sections',
    },
  })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => {
      let section = (json.sections || []).find((item) => {
        return item.id === bundle.inputData.id;
      });

      return section ? section.name : '';
    });
};

const getAccountName = function (z, bundle) {
  return z.request({
    url: `${FLOW_API_URL}/memberships`,
    params: {
      organization_id: bundle.authData.orgId,
      workspace_id: bundle.inputData.workspace_id,
      include: 'accounts',
    },
  })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => {
      let account = (json.accounts || []).find((item) => {
        return item.id === bundle.inputData.id;
      });

      return account ? account.name : '';
    });
};

const getAccountNames = function (z, bundle) {
  return z.request({
    url: `${FLOW_API_URL}/memberships`,
    params: {
      organization_id: bundle.authData.orgId,
      workspace_id: bundle.inputData.workspace_id,
      include: 'accounts',
    },
  })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => {
      let accountNames = [];
      (json.accounts || []).forEach((account) => {
        if (bundle.inputData.ids.includes(account.id)) {
          accountNames.push(account.name);
        }
      });

      return accountNames;
    });
};

const getWorkspaceName = function (z, bundle) {
  return z.request({
    url: `${FLOW_API_URL}/workspaces/${bundle.inputData.id}`,
    params: {
      organization_id: bundle.authData.orgId,
    },
  })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => (json.workspace && json.workspace.name) || '');
};

module.exports = {
  getListName,
  getWorkspaceName,
  getSectionName,
  getAccountName,
  getAccountNames,
};
