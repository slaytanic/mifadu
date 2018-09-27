import { CURRENT_USER_HAS_LOADED, CURRENT_USER_IS_LOADING } from '../actions/action-types';

const initialState = {
  loggedIn: false,
};

const currentUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER_IS_LOADING:
      return { ...state, ...action.payload };
    case CURRENT_USER_HAS_LOADED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default currentUserReducer;
