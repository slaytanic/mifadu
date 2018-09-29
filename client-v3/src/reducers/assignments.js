import {
  ASSIGNMENTS_HAS_LOADED,
  ASSIGNMENTS_IS_LOADING,
  ASSIGNMENT_DELETED,
} from '../actions/action-types';

const initialState = {
  all: [],
};

const assignmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ASSIGNMENTS_IS_LOADING:
      return { ...state, ...action.payload };
    case ASSIGNMENTS_HAS_LOADED:
      return { ...state, ...action.payload };
    case ASSIGNMENT_DELETED:
      return { ...state, all: state.all.filter(a => a.id !== action.payload.id) };
    default:
      return state;
  }
};

export default assignmentsReducer;
