const _baseUrl = 'https://api.getflow.com/v2'

const listAccounts = (z, bundle) => {
  return z
    .request({
      url: `${_baseUrl}/memberships`,
      params: {
        organization_id: bundle.authData.orgId,
        workspace_id: bundle.inputData.workspace,
        include: 'accounts',
      },
    })
    .then(response => JSON.parse(response.content))
    .then(json => json.accounts)
}

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
}
