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
      let sectionName = '';
      (json.sections || []).find((section) => {
        if (section.id === bundle.inputData.id) {
          sectionName = section.name;
          return true;
        }

        return false;
      });

      return sectionName;
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
      let accountName = '';
      (json.accounts || []).find((account) => {
        if (account.id === bundle.inputData.id) {
          accountName = account.name;
          return true;
        }

        return false;
      });

      return accountName;
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
