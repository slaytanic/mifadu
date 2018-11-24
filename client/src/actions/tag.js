import { TAGS_IS_LOADING, TAGS_HAS_LOADED, TAG_CREATED } from './action-types';

import { getTags, createTag } from '../api/tag';

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

export function tagCreated(tag) {
  return {
    type: TAG_CREATED,
    payload: {
      ...tag,
    },
  };
}

export function tagsFetch() {
  return dispatch => {
    dispatch(tagsIsLoading());

    return getTags().then(response => dispatch(tagsHasLoaded(response.data.data.tags)));
  };
}

export function tagCreate(input) {
  return dispatch =>
    createTag(input).then(response => dispatch(tagCreated(response.data.data.createTag)));
}
