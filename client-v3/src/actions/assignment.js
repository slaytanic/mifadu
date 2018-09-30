import {
  ASSIGNMENTS_IS_LOADING,
  ASSIGNMENTS_HAS_LOADED,
  ASSIGNMENT_CREATED,
  ASSIGNMENT_UPDATED,
  ASSIGNMENT_DELETED,
} from './action-types';

import {
  getMyAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../api/assignment';

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

export function assignmentCreated(assignment) {
  return {
    type: ASSIGNMENT_CREATED,
    payload: assignment,
  };
}

export function assignmentUpdated(assignment) {
  return {
    type: ASSIGNMENT_UPDATED,
    payload: assignment,
  };
}

export function assignmentDeleted(id) {
  return {
    type: ASSIGNMENT_DELETED,
    payload: id,
  };
}

export function assignmentFetch(id) {
  return dispatch =>
    getAssignment(id).then(response => dispatch(assignmentUpdated(response.data.data.assignment)));
}

export function assignmentsFetch() {
  return dispatch => {
    dispatch(assignmentsIsLoading());

    return getMyAssignments().then(response =>
      dispatch(assignmentsHasLoaded(response.data.data.myAssignments)),
    );
  };
}

export function assignmentCreate(input) {
  return dispatch =>
    createAssignment(input).then(response =>
      dispatch(assignmentCreated(response.data.data.createAssignment)),
    );
}

export function assignmentUpdate(id, input) {
  return dispatch =>
    updateAssignment(id, input).then(response =>
      dispatch(assignmentUpdated(response.data.data.updateAssignment)),
    );
}

export function assignmentDelete(id) {
  return dispatch =>
    deleteAssignment(id).then(response =>
      dispatch(assignmentDeleted(response.data.data.deleteAssignment.id)),
    );
}
