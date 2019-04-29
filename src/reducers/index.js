import combineReducers from "../utils/combineReducers";
import * as actionTypes from "../action/types";

const initialState = {
  currentUser: null,
  isLoading: true
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        currentUser: null,
        isLoading: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  user: userReducer
});
