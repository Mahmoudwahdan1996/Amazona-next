import { useReducer } from "react";
import { AdminContext } from "./AdminContext";
import { FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAIL } from "../types";
import reducer from "./AdminReducer";

const intialState = { loading: true, error: "", summary: { salesData: [] } };

export function AdminProvider(props) {
  const [{ loading, error, summary }, dispatch] = useReducer(
    reducer,
    intialState
  );

  const requetStart = () => {
    return dispatch({ type: FETCH_REQUEST });
  };
  const requestSuccess = (data) => {
    return dispatch({ type: FETCH_SUCCESS, payload: data });
  };

  const requestError = (error) => {
    return dispatch({ type: FETCH_FAIL, payload: error });
  };

  const value = {
    loading,
    error,
    summary,
    requetStart,
    requestSuccess,
    requestError,
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
}
