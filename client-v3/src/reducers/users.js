import { USERS_HAS_LOADED, USERS_IS_LOADING } from '../actions/action-types';

const initialState = {
  all: [],
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERS_IS_LOADING:
      return { ...state, ...action.payload };
    case USERS_HAS_LOADED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default usersReducer;
