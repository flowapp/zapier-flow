const { FLOW_API_URL } = require('./constants');

const TaskOutputFields = [
  {
    key: 'workspace_id',
    label: 'Team ID',
  },

  {
    key: 'list_id',
    label: 'Project ID',
  },

  {
    key: 'account_id',
    label: 'Creater ID',
  },

  {
    key: 'owner_id',
    label: 'Assignee ID',
  },

  {
    key: 'due_on',
    label: 'Due Date',
  },

  {
    key: 'starts_on',
    label: 'Start Date',
  },

  {
    key: 'updated_at',
    label: 'Last Updated At',
  },
];

/*
  * Method to convert API task response to trim down unneeded values
  * When Zapier populates the action part of the form it grabs all items from the task response
  * without any discrimination. Many of the items are poorly labelled and not likely to be needed for any integration.
  *
  * In order to help clean up the noise, this method cherry-picks the values that seem important to expose to Zapier.
  *
  * @param {Object} Task
  * @return {Object} Task
*/
function parseTask(task) {
  return {
    id: task.id,
    name: task.name,
    workspace_id: task.workspace_id,
    list_id: task.list_id,
    section_id: task.section_id,
    account_id: task.account_id,
    owner_id: task.owner_id,
    due_on: task.due_on,
    starts_on: task.starts_on,
    created_at: task.created_at,
    updated_at: task.updated_at,
    tags: task.tags,
    completed: task.completed,
    completed_at: task.completed_at,
  };
}

const getTask = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/tasks/${bundle.inputData.id}`,
      params: {
        organization_id: bundle.authData.orgId,
      },
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => {
      return parseTask(json.task);
    });
};

/*
 * Create task sample object.
 * as it is shared between new and recently complted tasks, it takes a
 * completed param and has slightly different output for these two cases.
 *
 * @param {Bool} completed
 * @return {Object} Task
*/
const generateTaskSample = function (completed) {
  return {
    id: 1,
    name: 'Test task A',
    workspace_id: 2,
    list_id: 10,
    section_id: 5,
    account_id: 10,
    owner_id: 10,
    due_on: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    completed_at: completed ? new Date() : null,
    completed: !!completed,
    tags: ['tag1'],
  };
};

module.exports = {
  parseTask,
  TaskOutputFields,
  getTask,
  generateTaskSample,
};
