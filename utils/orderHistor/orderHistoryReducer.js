import { FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAIL } from "../types";

function reducer(state, action) {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case FETCH_SUCCESS:
      return { ...state, loading: false, orders: action.payload, error: "" };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default reducer;
