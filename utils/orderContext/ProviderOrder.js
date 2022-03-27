import { useReducer } from "react";
import { ContextOrder } from "./ContextOrder";
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
import reducer from "./ReducerOrder";

const intialState = { loading: true, error: "", order: {} };
export function ProviderOrder(props) {
  const [
    {
      loading,
      error,
      order,
      loadingPay,
      errorPay,
      successPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, intialState);

  const requetStart = () => {
    return dispatch({ type: FETCH_REQUEST });
  };
  const requestSuccess = (order) => {
    return dispatch({ type: FETCH_SUCCESS, payload: order });
  };

  const requestError = (error) => {
    return dispatch({ type: FETCH_FAIL, payload: error });
  };

  const payRest = () => {
    return dispatch({ type: PAY_RESET });
  };

  const payRequest = () => {
    return dispatch({ type: PAY_REQUEST });
  };

  const paySuccess = (data) => {
    return dispatch({ type: PAY_SUCCESS, payload: data });
  };

  const payFail = (error) => {
    return dispatch({ type: PAY_FAIL, payload: error });
  };

  const deliverRest = () => {
    return dispatch({ type: DELIVER_RESET });
  };

  const deliverRequest = () => {
    return dispatch({ type: DELIVER_REQUEST });
  };

  const deliverSuccess = (data) => {
    return dispatch({ type: DELIVER_SUCCESS, payload: data });
  };

  const deliverFail = (error) => {
    return dispatch({ type: DELIVER_FAIL, payload: error });
  };
  const value = {
    loading,
    error,
    order,
    loadingPay,
    errorPay,
    successPay,
    loadingDeliver,
    successDeliver,
    requetStart,
    requestSuccess,
    requestError,
    deliverRest,
    deliverSuccess,
    deliverFail,
    deliverRequest,
    payRest,
    payFail,
    paySuccess,
    payRequest,
  };
  return (
    <ContextOrder.Provider value={value}>
      {props.children}
    </ContextOrder.Provider>
  );
}
