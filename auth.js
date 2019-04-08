const testAuth = (z) => {
  const promise = z.request({
    url: 'https://api.getflow.com/v2/tasks',
  });

  return promise.then((response) => {
    if (response.status === 401) {
      throw new Error('The access token you supplied appears to be invalid.');
    }
    return response;
  });
};

module.exports = {
  type: 'custom',
  connectionLabel: 'Flow',
  fields: [
    {
      key: 'accessToken',
      label: 'Access Token',
      required: true,
      type: 'string',
      helpText: 'Visit your [Account Preferences](https://app.getflow.com/preferences) to obtain your Personal Access Token. [Learn more…](https://developer.getflow.com/#getting-started)',
    },
    {
      key: 'orgId',
      label: 'Organization ID',
      required: true,
      type: 'string',
      helpText: 'Once you have created your Personal Access Token in [Account Preferences](https://app.getflow.com/preferences), the Organization ID should be listed next to the token itself.',
    },
  ],
  test: testAuth,
};
