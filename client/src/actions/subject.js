import { SUBJECTS_IS_LOADING, SUBJECTS_HAS_LOADED } from './action-types';

import { getSubjects } from '../api/subject';

export function subjectsIsLoading(bool = true) {
  return {
    type: SUBJECTS_IS_LOADING,
    payload: {
      isLoading: bool,
      startedLoadingAt: Date.now(),
    },
  };
}

export function subjectsHasLoaded(subjects) {
  return {
    type: SUBJECTS_HAS_LOADED,
    payload: {
      all: subjects,
      isLoading: false,
      loadedAt: Date.now(),
    },
  };
}

export function subjectsFetch() {
  return dispatch => {
    dispatch(subjectsIsLoading());

    getSubjects().then(response => {
      dispatch(subjectsHasLoaded(response.data.data.subjects));
    });
  };
}
