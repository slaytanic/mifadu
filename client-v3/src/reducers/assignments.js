import {
  ASSIGNMENTS_HAS_LOADED,
  ASSIGNMENTS_IS_LOADING,
  ASSIGNMENT_DELETED,
} from '../actions/action-types';

function count(assignments) {
  const counters = {
    pendingEvaluationCount: 0,
    pendingCount: 0,
    completedCount: 0,
    completedEvaluationCount: 0,
  };
  assignments.forEach(a => {
    a.statusTags.forEach(t => {
      switch (t) {
        case 'pending_evaluation':
          counters.pendingEvaluationCount += 1;
          break;
        case 'pending_work':
          counters.pendingCount += 1;
          break;
        case 'completed_evaluation':
          counters.completedEvaluationCount += 1;
          break;
        case 'completed_work':
          counters.completedCount += 1;
          break;
        default:
      }
    });
  });
  return counters;
}

const initialState = {
  all: [],
  ...count([]),
};

const assignmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ASSIGNMENTS_IS_LOADING:
      return { ...state, ...action.payload };
    case ASSIGNMENTS_HAS_LOADED:
      return { ...state, ...action.payload, ...count(action.payload.all) };
    case ASSIGNMENT_DELETED: {
      const all = state.all.filter(a => a.id !== action.payload.id);
      return { ...state, all, ...count(all) };
    }
    default:
      return state;
  }
};

export default assignmentsReducer;
