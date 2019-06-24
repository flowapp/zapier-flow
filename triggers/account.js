const { FLOW_API_URL, HEADERS } = require('../utils/constants');

/*
 * Get a list of all accounts in a  workspace via the memberships endpoint
*/
const getAccounts = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/memberships`,
      params: {
        organization_id: bundle.authData.orgId,
        ...(bundle.inputData.workspace && { workspace_id: bundle.inputData.workspace }),
        include: 'accounts',
      },
      headers: HEADERS,
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => json.accounts);
};

module.exports = {
  key: 'account',
  noun: 'Account',

  display: {
    label: 'List of Accounts',
    description: 'This hidden trigger gets a list of accounts in a Team.',
    hidden: true,
  },
  operation: {
    perform: getAccounts,
  },
};
