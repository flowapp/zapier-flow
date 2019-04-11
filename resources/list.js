const { FLOW_API_URL } = require('../utils/constants');

const listLists = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/lists`,
      params: {
        organization_id: bundle.authData.orgId,
        workspace_id: bundle.inputData.workspace,
        include: 'sections',
      },
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => json.lists);
};

const getList = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/lists/${bundle.inputData.id}`,
      params: {
        organization_id: bundle.authData.orgId,
        workspace_id: bundle.inputData.workspace,
      },
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => json.list);
};

module.exports = {
  key: 'list',
  noun: 'Project',

  list: {
    display: {
      label: 'New Project',
      description: 'Triggers when a new project is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'workspace',
          type: 'string',
          helpText: 'Team for Project',
          dynamic: 'workspace.id.name',
          altersDynamicFields: true,
        },
      ],
      perform: listLists,
      sample: {
        id: 1,
        name: 'Test project A',
        workspace_id: 2,
        archived: false,
        color_id: '124c85fd-a841-49e3-a948-f1dc4b3a0557',
        completed_section_id: null,
        completed_tasks_count: 12,
        created_at: new Date(),
        default_section_id: null,
        default_view: 'row',
        deleted: false,
        group_id: 40,
        ends_on: null,
        include_weekends: true,
        invite_only: false,
        starts_on: null,
        tasks_count: 14,
        updated_at: new Date(),
      },
    },
  },

  get: {
    display: {
      label: 'Get Project',
      description: 'Gets a single project.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getList,
    },
  },
};
