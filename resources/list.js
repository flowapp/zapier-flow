const { FLOW_API_URL } = require('../utils/constants');

/*
  * Method to convert API list response to trim down unneeded values
  * When Zapier populates the action part of the form it grabs all items from the list response
  * without any discrimination. Many of the items are poorly labelled and not likely to be needed for any integration.
  *
  * In order to help clean up the noise, this method cherry-picks the values that seem important to expose to Zapier.
  *
  * @param {Object} List
  * @return {Object} List
*/
function parseList(list) {
  return {
    id: list.id,
    name: list.name,
    created_at: list.created_at,
    updated_at: list.updated_at,
    completed_section_id: list.completed_section_id,
    completed_tasks_count: list.completed_tasks_count,
    default_section_id: list.default_section_id,
    default_view: list.default_view,
    ends_on: list.ends_on,
    group_id: list.group_id,
    include_weekends: list.include_weekends,
    invite_only: list.invite_only,
    starts_on: list.starts_on,
    subscriber_ids: list.subscriber_ids,
    tasks_count: list.tasks_count,
    workspace_id: list.workspace_id,
  };
}

/*
 * Fetch all lists in a workspace that the user has access to,
 * providing they are not soft-deleted or archived
*/
const getListsInWorkspace = (z, bundle) => {
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
    .then((json) => json.lists.map(parseList));
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
    .then((json) => parseList(json.list));
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
      perform: getListsInWorkspace,
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
