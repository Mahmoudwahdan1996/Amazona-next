import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAIL,
  PAY_FAIL,
  PAY_REQUEST,
  PAY_SUCCESS,
  PAY_RESET,
  DELIVER_RESET,
  DELIVER_FAIL,
  DELIVER_SUCCESS,
  DELIVER_REQUEST,
} from "../types";

function reducer(state, action) {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case FETCH_SUCCESS:
      return { ...state, loading: false, order: action.payload, error: "" };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PAY_REQUEST:
      return { ...state, loadingPay: true };
    case PAY_SUCCESS:
      return {
        ...state,
        loadingPay: false,
        successPay: true,
      };
    case PAY_FAIL:
      return { ...state, loadingPay: false, errorPay: action.payload };
    case PAY_RESET:
      return {
        ...state,
        loadingPay: false,
        successPay: false,
        errorPay: "",
      };
    case DELIVER_REQUEST:
      return { ...state, loadingDeliver: true };
    case DELIVER_SUCCESS:
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: true,
      };
    case DELIVER_FAIL:
      return { ...state, loadingDeliver: false, error: action.payload };
    case DELIVER_RESET:
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        error: "",
      };
    default:
      state;
  }
}

export default reducer;
