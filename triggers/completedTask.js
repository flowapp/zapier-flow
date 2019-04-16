const { FLOW_API_URL } = require('../utils/constants');
const { TaskOutputFields, parseTask, generateTaskSample, setupTaskDehydrators } = require('../utils/sharedTaskResources');

/*
 * Get all tasks that have been completed in the last hour in an organization.
 * workspace can also optionally be specified for a more granular response.
*/
const getRecentlyCompletedTasks = (z, bundle) => {
  let params = {
    order: 'completed_at',
    completed: true,
    organization_id: bundle.authData.orgId,
    ...(bundle.inputData.workspace && { workspace_id: bundle.inputData.workspace }),
  };

  // We only want to pass created_after if it is running for real,
  // otherwise potentially sample data will not be populated if a user hasn't recently created any tasks.
  if (!bundle.meta || !bundle.meta.isLoadingSample) {
    let completedAfter = new Date();
    completedAfter.setHours(completedAfter.getHours() - 1);
    params.completed_after = completedAfter.toISOString();
  }

  return z
    .request({
      url: `${FLOW_API_URL}/tasks`,
      params,
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => {
      json.tasks = json.tasks.map((task) => setupTaskDehydrators(z, task));
      return json;
    })
    .then((json) => json.tasks.map(parseTask));
};

module.exports = {
  key: 'completedTask',
  noun: 'Completed Task',
  display: {
    label: 'Completed Task',
    description: 'Triggers when a task is completed.',
  },

  operation: {
    inputFields: [
      {
        key: 'workspace',
        type: 'string',
        helpText: 'Team for Task',
        dynamic: 'workspace.id.name',
        altersDynamicFields: true,
      },
    ],
    outputFields: TaskOutputFields,
    perform: getRecentlyCompletedTasks,
    sample: generateTaskSample(true),
  },
};
