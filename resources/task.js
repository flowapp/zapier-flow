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
