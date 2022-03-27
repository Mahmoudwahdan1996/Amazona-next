import { useReducer } from "react";
import { ContextHistoryOrder } from "./orderHistoryContext";
import { FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAIL } from "../types";
import reducer from "./orderHistoryReducer";

const intialState = { loading: true, error: "", orders: [] };
export function OrderHistoryProvider(props) {
  const [{ loading, error, orders }, dispatch] = useReducer(
    reducer,
    intialState
  );

  const requetStart = () => {
    return dispatch({ type: FETCH_REQUEST });
  };
  const requestSuccess = (order) => {
    return dispatch({ type: FETCH_SUCCESS, payload: order });
  };

  const requestError = (error) => {
    return dispatch({ type: FETCH_FAIL, payload: error });
  };

  const value = {
    loading,
    error,
    orders,

    requetStart,
    requestSuccess,
    requestError,
  };
  return (
    <ContextHistoryOrder.Provider value={value}>
      {props.children}
    </ContextHistoryOrder.Provider>
  );
}
