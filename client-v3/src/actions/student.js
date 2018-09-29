import { STUDENTS_IS_LOADING, STUDENTS_HAS_LOADED } from './action-types';

import { getMyStudents } from '../api/student';

export function studentsIsLoading(bool = true) {
  return {
    type: STUDENTS_IS_LOADING,
    payload: {
      isLoading: bool,
      startedLoadingAt: Date.now(),
    },
  };
}

export function studentsHasLoaded(students) {
  return {
    type: STUDENTS_HAS_LOADED,
    payload: {
      all: students,
      isLoading: false,
      loadedAt: Date.now(),
    },
  };
}

export function studentsFetch() {
  return dispatch => {
    dispatch(studentsIsLoading());

    return getMyStudents().then(response => {
      dispatch(studentsHasLoaded(response.data.data.myStudents));
    });
  };
}
