const _baseUrl = 'https://api.getflow.com/v2'

const getSections = (z, bundle) => {
  return z
    .request({
      url: `${_baseUrl}/lists/${bundle.inputData.list}`,
      params: {
        organization_id: bundle.authData.orgId,
        workspace_id: bundle.inputData.workspace,
        include: 'sections',
      },
    })
    .then(response => JSON.parse(response.content))
    .then(json => json.sections)
}

module.exports = {
  key: 'section',
  noun: 'Section',

  display: {
    label: 'List of Sections',
    description: 'This hidden trigger gets a list of sections from a project.',
    hidden: true,
  },

  operation: {
    perform: getSections,
  },
}
