import {
  CURRENT_USER_HAS_ERRORED,
  CURRENT_USER_IS_LOADING,
  CURRENT_USER_HAS_LOADED,
} from './action-types';

import { getCurrentUser, loginUser, logoutUser } from '../api/current-user';

export function currentUserHasErrored(bool) {
  return {
    type: CURRENT_USER_HAS_ERRORED,
    hasErrored: bool,
  };
}

export function currentUserIsLoading(bool) {
  return {
    type: CURRENT_USER_IS_LOADING,
    isLoading: bool,
  };
}

export function currentUserHasLoaded(currentUser) {
  return {
    type: CURRENT_USER_HAS_LOADED,
    currentUser,
  };
}

export function currentUserFetch() {
  return dispatch => {
    dispatch(currentUserIsLoading(true));

    getCurrentUser()
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(currentUserIsLoading(false));

        return response.data.data.me;
      })
      .then(currentUser => dispatch(currentUserHasLoaded(currentUser)))
      .catch(() => dispatch(currentUserHasErrored(true)));
  };
}

export function currentUserLogin(email, password) {
  return dispatch => {
    dispatch(currentUserIsLoading(true));

    loginUser(email, password)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(currentUserIsLoading(false));

        return response.data.data.loginUser;
      })
      .then(currentUser => dispatch(currentUserHasLoaded(currentUser)))
      .catch(() => dispatch(currentUserHasErrored(true)));
  };
}

export function currentUserLogout() {
  return dispatch => {
    dispatch(currentUserIsLoading(true));

    logoutUser()
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(currentUserIsLoading(false));

        return null;
      })
      .then(currentUser => dispatch(currentUserHasLoaded(currentUser)))
      .catch(() => dispatch(currentUserHasErrored(true)));
  };
}
