import { ASSIGNMENTS_IS_LOADING, ASSIGNMENTS_HAS_LOADED } from './action-types';

import { getAssignments } from '../api/assignment';

export function assignmentsIsLoading(bool = true) {
  return {
    type: ASSIGNMENTS_IS_LOADING,
    payload: {
      isLoading: bool,
      startedLoadingAt: Date.now(),
    },
  };
}

export function assignmentsHasLoaded(assignments) {
  return {
    type: ASSIGNMENTS_HAS_LOADED,
    payload: {
      all: assignments,
      isLoading: false,
      loadedAt: Date.now(),
    },
  };
}

export function assignmentsFetch() {
  return dispatch => {
    dispatch(assignmentsIsLoading());

    getAssignments().then(response => {
      dispatch(assignmentsHasLoaded(response.data.data.assignments));
    });
  };
}
