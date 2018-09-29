import { ASSIGNMENTS_IS_LOADING, ASSIGNMENTS_HAS_LOADED, ASSIGNMENT_DELETED } from './action-types';

import { getMyAssignments, deleteAssignment } from '../api/assignment';

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
      all: assignments || [],
      isLoading: false,
      loadedAt: Date.now(),
    },
  };
}

export function assignmentsFetch() {
  return dispatch => {
    dispatch(assignmentsIsLoading());

    return getMyAssignments().then(response => {
      dispatch(assignmentsHasLoaded(response.data.data.assignments));
    });
  };
}

export function assignmentDeleted(id) {
  return {
    type: ASSIGNMENT_DELETED,
    payload: {
      id,
    },
  };
}

export function assignmentDelete(id) {
  return dispatch => deleteAssignment(id).then(response => {
      dispatch(assignmentDeleted(response.data.data.deleteAssignment.id));
    });
}
