import combineReducers from "../utils/combineReducers";
import userReducer from "./userReducer";
import channelReducer from "./channelReducer";

export default combineReducers({
  user: userReducer,
  channel: channelReducer
});
