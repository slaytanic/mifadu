import { push } from 'connected-react-router';

import {
  CURRENT_USER_IS_LOADING,
  CURRENT_USER_HAS_LOADED,
  CURRENT_USER_HAS_ERRORED,
} from './action-types';

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  createOrUpdateUser,
  resetPassword,
} from '../api/current-user';

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

export function currentUserHasErrored(errors) {
  return {
    type: CURRENT_USER_HAS_ERRORED,
    payload: { isLoading: false, errors },
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

    return loginUser(email, password).then(response => {
      if (response.data.errors) {
        return dispatch(currentUserHasErrored(response.data.errors));
      }

      return dispatch(currentUserHasLoaded(response.data.data.loginUser));
    });
  };
}

export function currentUserLogout() {
  return dispatch => {
    dispatch(currentUserIsLoading());

    logoutUser().then(() => {
      dispatch(currentUserHasLoaded(null));
      dispatch(push('/'));
    });
  };
}

export function currentUserRegister(input) {
  return dispatch => {
    dispatch(currentUserIsLoading());

    createOrUpdateUser(input).then(response => {
      dispatch(currentUserHasLoaded(response.data.data.createOrUpdateUser));
      dispatch(push('/'));
    });
  };
}

export function currentUserResetPassword(password, recoveryToken) {
  return dispatch => {
    dispatch(currentUserIsLoading());

    return resetPassword(password, recoveryToken).then(response => {
      const action = dispatch(currentUserHasLoaded(response.data.data.resetPassword));
      dispatch(push('/'));
      return action;
    });
  };
}
