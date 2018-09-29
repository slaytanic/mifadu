import { WORKSHOPS_IS_LOADING, WORKSHOPS_HAS_LOADED } from './action-types';

import { getWorkshops } from '../api/workshop';

export function workshopsIsLoading(bool = true) {
  return {
    type: WORKSHOPS_IS_LOADING,
    payload: {
      isLoading: bool,
      startedLoadingAt: Date.now(),
    },
  };
}

export function workshopsHasLoaded(workshops) {
  return {
    type: WORKSHOPS_HAS_LOADED,
    payload: {
      all: workshops,
      isLoading: false,
      loadedAt: Date.now(),
    },
  };
}

export function workshopsFetch() {
  return dispatch => {
    dispatch(workshopsIsLoading());

    getWorkshops().then(response => {
      dispatch(workshopsHasLoaded(response.data.data.workshops));
    });
  };
}
