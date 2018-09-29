import { TAGS_IS_LOADING, TAGS_HAS_LOADED } from './action-types';

import { getTags } from '../api/tag';

export function tagsIsLoading(bool = true) {
  return {
    type: TAGS_IS_LOADING,
    payload: {
      isLoading: bool,
      startedLoadingAt: Date.now(),
    },
  };
}

export function tagsHasLoaded(tags) {
  return {
    type: TAGS_HAS_LOADED,
    payload: {
      all: tags,
      isLoading: false,
      loadedAt: Date.now(),
    },
  };
}

export function tagsFetch() {
  return dispatch => {
    dispatch(tagsIsLoading());

    getTags().then(response => {
      dispatch(tagsHasLoaded(response.data.data.tags));
    });
  };
}
