const testAuth = (z) => {
  const promise = z.request({
    url: 'https://api.getflow.com/v2/tasks'
  })

  return promise.then((response) => {
    if (response.status === 401) {
      throw new Error('The access token you supplied is invalid.')
    }
    return response
  })
}

module.exports = {
  type: 'custom',
  connectionLabel: 'Flow',
  fields: [
    { key: 'accessToken', label: 'Access Token', required: true, type: 'string' },
    { key: 'orgId', label: 'Organization ID', required: true, type: 'string' }
  ],
  test: testAuth
}
