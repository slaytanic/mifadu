import axios from 'axios';

import { GRAPHQL_ENDPOINT } from './common';

export function getMyStudents() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      '{ myStudents { id, firstName, lastName, email, completedProfile, idNumber, tutoredWorkshops { id } } }',
  });
}

export { getMyStudents as default };
