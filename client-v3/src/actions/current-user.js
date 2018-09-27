import { CURRENT_USER_IS_LOADING, CURRENT_USER_HAS_LOADED } from './action-types';

import { getCurrentUser, loginUser, logoutUser } from '../api/current-user';

export function currentUserIsLoading(bool = true) {
  return {
    type: CURRENT_USER_IS_LOADING,
    payload: {
      isLoading: bool,
      startedLoadingAt: Date.now(),
    },
  };
}

export function currentUserHasLoaded(currentUser) {
  return {
    type: CURRENT_USER_HAS_LOADED,
    payload: {
      ...currentUser,
      loggedIn: !!currentUser,
      isLoading: false,
      loadedAt: Date.now(),
    },
  };
}

export function currentUserFetch() {
  return dispatch => {
    dispatch(currentUserIsLoading());

    getCurrentUser().then(response => {
      dispatch(currentUserHasLoaded(response.data.data.me));
    });
  };
}

export function currentUserLogin(email, password) {
  return dispatch => {
    dispatch(currentUserIsLoading());

    loginUser(email, password).then(response => {
      dispatch(currentUserHasLoaded(response.data.data.loginUser));
    });
  };
}

export function currentUserLogout() {
  return dispatch => {
    dispatch(currentUserIsLoading());

    logoutUser().then(() => {
      dispatch(currentUserHasLoaded(null));
    });
  };
}
