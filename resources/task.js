const { FLOW_API_URL } = require('../utils/constants');
const { TaskOutputFields, parseTask, getTask, generateTaskSample, setupTaskDehydrators } = require('../utils/sharedTaskResources');

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

/*
 * Get all tasks that have been created in the last hour in an organization.
 * workspace can also optionally be specified for a more granular response.
*/
const getRecentlyCreatedTasks = (z, bundle) => {
  let params = {
    order: 'created_at',
    organization_id: bundle.authData.orgId,
    ...(bundle.inputData.workspace && { workspace_id: bundle.inputData.workspace }),
  };

  // We only want to pass created_after if it is running for real,
  // otherwise potentially sample data will not be populated if a user hasn't recently created any tasks.
  if (!bundle.meta || !bundle.meta.isLoadingSample) {
    let createdAfter = new Date();
    createdAfter.setHours(createdAfter.getHours() - 1);
    params.created_after = createdAfter.toISOString();
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
      perform: getRecentlyCreatedTasks,
      sample: generateTaskSample(),
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
          dynamic: 'list.id.name',
          helpText:
            'Choose a project for your task to be created in. Projects are grouped under Teams, so if you can’t find the project you want, ensure the correct team is selected.',
          altersDynamicFields: true,
          required: false,
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
