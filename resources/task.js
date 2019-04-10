const { FLOW_API_URL } = require('../utils/constants');

const TaskOutputFields = [
  {
    key: 'id',
    label: 'Task ID',
  },
  {
    key: 'name',
    label: 'Task Name',
  },

  {
    key: 'workspace_id',
    label: 'Team ID',
  },

  {
    key: 'list_id',
    label: 'Project ID',
  },

  {
    key: 'section_id',
    label: 'Section ID',
  },

  {
    key: 'account_id',
    label: 'Task Creater ID',
  },

  {
    key: 'owner_id',
    label: 'Task Assignee ID',
  },

  {
    key: 'due_on',
    label: 'Task Due Date',
  },

  {
    key: 'starts_on',
    label: 'Task Start Date',
  },

  {
    key: 'created_at',
    label: 'Task Created At',
  },

  {
    key: 'updated_at',
    label: 'Task Last Updated At',
  },

  {
    key: 'tags',
    label: 'Task Tags',
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

const createTask = (z, bundle) => {
  const request = {
    url: `${FLOW_API_URL}/tasks`,
    method: 'POST',
    params: {
      organization_id: bundle.authData.orgId,
    },
    body: JSON.stringify({
      task: {
        workspace_id: bundle.inputData.workspace,
        name: bundle.inputData.title,
        owner_id: bundle.inputData.assignee,
        list_id: bundle.inputData.list,
        due_on: bundle.inputData.dueDate,
        note_content: bundle.inputData.note,
        note_mime_type: 'text/x-markdown',
        section_id: bundle.inputData.section,
      },
    }),
    headers: {
      'content-type': 'application/json',
    },
  };

  return z
    .request(request)
    .then((response) => z.JSON.parse(response.content))
    .then((json) => json.task);
};

const listTasks = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/tasks`,
      params: {
        order: 'created_at',
        organization_id: bundle.authData.orgId,
        ...(bundle.inputData.workspace && { workspace_id: bundle.inputData.workspace }),
      },
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => json.tasks.map(parseTask));
};

module.exports = {
  key: 'task',
  noun: 'Task',

  get: {
    display: {
      label: 'Get a Task by ID',
      description: 'Grab a single Task by ID.',
    },

    operation: {
      inputFields: [{ key: 'id', required: true }],
      outputFields: TaskOutputFields,
      perform: getTask,
    },
  },

  list: {
    display: {
      label: 'New Task',
      description: 'Triggers when a new task is added.',
      important: true,
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
      perform: listTasks,
    },
  },

  create: {
    display: {
      label: 'Create Task',
      description: 'Creates a new Flow task.',
    },

    operation: {
      inputFields: [
        {
          key: 'title',
          type: 'string',
          label: 'Task Name',
          helpText: 'Enter a descriptive title for your task.',
          required: true,
        },
        {
          key: 'note',
          type: 'text',
          label: 'Task Note',
          helpText:
            'Task notes are for when you need to include longer, more detailed information. You can use [Github Flavored Markdown](https://help.github.com/articles/basic-writing-and-formatting-syntax/) for formatting.',
          required: false,
        },
        {
          key: 'workspace',
          type: 'integer',
          label: 'Team',
          dynamic: 'workspace.id.name',
          helpText:
            'Choose a team for your task to be created in.',
          altersDynamicFields: true,
          required: true,
        },
        {
          key: 'list',
          type: 'integer',
          label: 'Project',
          dynamic: 'project.id.name',
          helpText:
            'Choose a project for your task to be created in. Projects are grouped under Teams, so if you can’t find the project you want, ensure the correct team is selected.',
          altersDynamicFields: true,
          required: true,
        },
        {
          key: 'section',
          type: 'integer',
          label: 'Section',
          helpText:
            'If your selected project has sections, you can select one here. If no section is selected, the task will be filed in the project’s default section if one exists, and no section if the project does not have a default section.',
          dynamic: 'section.id.name',
          altersDynamicFields: true,
          required: false,
        },
        {
          key: 'assignee',
          type: 'integer',
          label: 'Assignee',
          dynamic: 'account.id.name',
          helpText:
            'Choose a user to assign your task to.',
          altersDynamicFields: true,
          required: false,
        },
        {
          key: 'dueDate',
          type: 'datetime',
          label: 'Due Date',
          helpText:
            'Choose a due date for your task',
          required: false,
        },
      ],
      perform: createTask,
    },
  },
};
