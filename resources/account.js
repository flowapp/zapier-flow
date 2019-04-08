const { FLOW_API_URL } = require('../utils/constants');

const listAccounts = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/memberships`,
      params: {
        organization_id: bundle.authData.orgId,
        ...(bundle.inputData.workspace && { workspace_id: bundle.inputData.workspace }),
        include: 'accounts',
      },
    })
    .then((response) => JSON.parse(response.content))
    .then((json) => json.accounts);
};

module.exports = {
  key: 'account',
  noun: 'Account',

  list: {
    display: {
      label: 'New Account',
      description: 'Trigger when a new account is added',
    },
    operation: {
      perform: listAccounts,
    },
  },
};
