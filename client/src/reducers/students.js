import { STUDENTS_HAS_LOADED, STUDENTS_IS_LOADING } from '../actions/action-types';

const initialState = {
  all: [],
};

const studentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case STUDENTS_IS_LOADING:
      return { ...state, ...action.payload };
    case STUDENTS_HAS_LOADED:
      return {
        ...state,
        ...action.payload,
        all: action.payload.all.sort((a, b) =>
          a.lastName.toUpperCase() > b.lastName.toUpperCase() ? 1 : -1,
        ),
      };
    default:
      return state;
  }
};

export default studentsReducer;
