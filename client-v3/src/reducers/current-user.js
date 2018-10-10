import {
  CURRENT_USER_HAS_LOADED,
  CURRENT_USER_IS_LOADING,
  CURRENT_USER_HAS_ERRORED,
} from '../actions/action-types';

const initialState = {
  loggedIn: false,
  errors: [],
};

const currentUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER_IS_LOADING:
      return { ...state, ...action.payload };
    case CURRENT_USER_HAS_LOADED:
      if (action.payload.loggedIn === true) {
        return { ...state, ...action.payload };
      }
      return { ...initialState, ...action.payload };
    case CURRENT_USER_HAS_ERRORED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default currentUserReducer;
