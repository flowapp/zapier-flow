const { FLOW_API_URL } = require('./constants');
const { getListName, getWorkspaceName, getSectionName, getAccountName, getAccountNames } = require('./hydrators');

const TaskOutputFields = [
  {
    key: 'workspace_id',
    label: 'Team ID',
  },

  {
    key: 'workspace_name',
    label: 'Team Name',
  },

  {
    key: 'list_id',
    label: 'Project ID',
  },

  {
    key: 'list_name',
    label: 'Project Name',
  },

  {
    key: 'account_id',
    label: 'Creator ID',
  },

  {
    key: 'account_name',
    label: 'Creator Name',
  },

  {
    key: 'owner_id',
    label: 'Assignee ID',
  },

  {
    key: 'owner_name',
    label: 'Assignee Name',
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

  {
    key: 'note_content',
    label: 'Note Content as Markdown',
  },

  {
    key: 'note_content_html',
    label: 'Note Content as HTML',
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
  let returnValue = {
    id: task.id,
    name: task.name,
    workspace_id: task.workspace_id,
    workspace_name: task.workspace_name, // populated via dehydration call
    list_id: task.list_id,
    list_name: task.list_name, // populated via dehydration call
    section_id: task.section_id,
    section_name: task.section_name, // populated via dehydration call
    account_id: task.account_id,
    account_name: task.account_name, // populated via dehydration call
    owner_id: task.owner_id,
    owner_name: task.owner_name, // populated via dehydration call
    subscriber_names: task.subscriber_names, // populated via dehydration call
    subscriber_ids: task.subscriber_ids,
    due_on: task.due_on,
    starts_on: task.starts_on,
    created_at: task.created_at,
    updated_at: task.updated_at,
    tags: task.tags,
    completed: task.completed,
    completed_at: task.completed_at,
  };

  if (task.note_mime_type !== 'text/html') {
    returnValue.note_content = task.note_content;
    returnValue.note_content_html = task.note_content_html;
  } else {
    // Legacy tasks using our older visual editor will not have a markdown version
    returnValue.note_content_html = task.note_content_html;
  }

  return returnValue;
}

/*
  *
  * Method to populate additional values on the task model that
  * aren’t returned via the original request using z.dehydrate
  *
  * @param {Object} Zapier 'z'
  * @param {Object} Task
  * @return {Object} Task
*/
function setupTaskDehydrators(z, task) {
  if (task.list_id) {
    task.list_name = z.dehydrate(getListName, {
      id: task.list_id,
      workspace_id: task.workspace_id,
    });

    if (task.section_id) {
      task.section_name = z.dehydrate(getSectionName, {
        id: task.section_id,
        workspace_id: task.workspace_id,
        list_id: task.list_id,
      });
    } else {
      task.section_name = '';
    }
  } else {
    task.list_name = '';
    task.section_name = '';
  }

  if (task.workspace_id) {
    task.workspace_name = z.dehydrate(getWorkspaceName, {
      id: task.workspace_id,
    });
  } else {
    task.workspace_name = '';
  }

  if (task.owner_id) {
    task.owner_name = z.dehydrate(getAccountName, {
      id: task.owner_id,
      workspace_id: task.workspace_id,
    });
  } else {
    task.owner_name = '';
  }

  if (task.account_id) {
    task.account_name = z.dehydrate(getAccountName, {
      id: task.account_id,
      workspace_id: task.workspace_id,
    });
  } else {
    task.account_name = '';
  }

  if (task.subscriber_ids && task.subscriber_ids.length) {
    task.subscriber_names = z.dehydrate(getAccountNames, {
      ids: task.subscriber_ids,
      workspace_id: task.workspace_id,
    });
  } else {
    task.subscriber_names = [];
  }

  return task;
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
    .then((results) => {
      results.task = setupTaskDehydrators(z, results.task);
      return results;
    })
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
  setupTaskDehydrators,
};
