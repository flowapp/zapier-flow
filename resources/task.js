const { FLOW_API_URL } = require('../utils/constants');

const getTask = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/tasks/${bundle.inputData.id}`,
      params: {
        organization_id: bundle.authData.orgId,
      },
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => json.task);
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
    .then((json) => json.tasks);
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
          key: 'workspace',
          type: 'integer',
          label: 'Team',
          dynamic: 'workspace.id.name',
          altersDynamicFields: true,
          required: true,
        },
        {
          key: 'list',
          type: 'integer',
          label: 'Project',
          dynamic: 'project.id.name',
          altersDynamicFields: true,
          required: true,
        },
        {
          key: 'section',
          type: 'integer',
          label: 'Task Section',
          helpText:
            'If the project has todo sections, you can select one here. By default, the task will get added to the "No Section" list if you don\'t specify a section.',
          dynamic: 'section.id.name',
          altersDynamicFields: true,
          required: false,
        },
        {
          key: 'assignee',
          type: 'integer',
          label: 'Assignee',
          dynamic: 'account.id.name',
          altersDynamicFields: true,
          required: false,
        },
        {
          key: 'title',
          type: 'string',
          label: 'Task Name',
          helpText: 'Enter a descriptive title for the task.',
          required: true,
        },
        {
          key: 'note',
          type: 'text',
          label: 'Task Note',
          helpText:
            'You can enter a note for the task. You can use [Github Flavored Markdown](https://help.github.com/articles/basic-writing-and-formatting-syntax/) for formatting.',
          required: false,
        },
        {
          key: 'dueDate',
          type: 'datetime',
          label: 'Due Date',
          required: false,
        },
      ],
      perform: createTask,
    },
  },
};
