import { FETCH_CURRENT_USER, LOGIN_USER, LOGOUT_USER } from '../actions/action-types';

const currentUserReducer = (state = null, action) => {
  switch (action.type) {
    case FETCH_CURRENT_USER:
      return { ...action.payload };
    case LOGIN_USER:
      return { ...action.payload };
    case LOGOUT_USER:
      return null;
    default:
      return state;
  }
};

export default currentUserReducer;
