const { FLOW_API_URL } = require('../utils/constants');

/*
 * Sections are used for the task creation action and you cannot create a task in the designated completed section; the API will return an error.
 * This method returns an array of valid sections dervied from the respone.
 *
 * @param {Object} json
 * @return {Array} sections
*/
function filterOutCompletedTaskSection(json) {
  return json.sections.filter((section) => {
    return section.id !== json.list.completed_section_id;
  });
}

const getSections = (z, bundle) => {
  return z
    .request({
      url: `${FLOW_API_URL}/lists/${bundle.inputData.list}`,
      params: {
        organization_id: bundle.authData.orgId,
        workspace_id: bundle.inputData.workspace,
        include: 'sections',
      },
    })
    .then((response) => z.JSON.parse(response.content))
    .then((json) => filterOutCompletedTaskSection(json));
};

module.exports = {
  key: 'section',
  noun: 'Section',

  display: {
    label: 'List of Sections',
    description: 'This hidden trigger gets a list of sections from a project.',
    hidden: true,
  },

  operation: {
    perform: getSections,
  },
};
