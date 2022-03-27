import { useReducer } from "react";
import { OrdersAdminContext } from "./ordersAdminContext";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAIL,
  FETCH_SUCCESS_PRODUCTS,
  FETCH_REQUEST_PRODUCTS,
  FETCH_FAIL_PRODUCTS,
  FETCH_FAIL_PRODUCT,
  FETCH_REQUEST_PRODUCT,
  FETCH_SUCCESS_PRODUCT,
  UPDATE_FAIL,
  UPDATE_REQUEST,
  UPDATE_SUCCESS,
  UPLOAD_REQUEST,
  UPLOAD_SUCCESS,
  UPLOAD_FAIL,
  CREATE_REQUEST,
  CREATE_SUCCESS,
  CREATE_FAIL,
  DELETE_REQUEST,
  DELETE_SUCCESS,
  DELETE_RESET,
  DELETE_FAIL,
  FETCH_USERS_REQUEST,
  FETCH_USERS_FAIL,
  FETCH_USERS_SUCCESS,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  DELETE_USER_RESET,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
} from "../types";
import reducer from "./ordersAdminReducer";

const intialState = {
  loading: true,
  error: "",
  orders: [],
  products: [],
  loadingProducts: true,
  errorUpdate: "",
  loadingUsers: true,
  users: [],
};

export function OrdersAdminProvider(props) {
  const [
    {
      loading,
      error,
      orders,
      products,
      loadingProducts,
      loadingUpdate,
      errorUpdate,
      loadingUpload,
      loadingCreate,
      loadingDelete,
      successDelete,
      users,
      loadingDeleteUser,
      loadingUsers,
    },
    dispatch,
  ] = useReducer(reducer, intialState);

  const requetStart = () => {
    return dispatch({ type: FETCH_REQUEST });
  };
  const requestSuccess = (data) => {
    return dispatch({ type: FETCH_SUCCESS, payload: data });
  };

  const requestError = (error) => {
    return dispatch({ type: FETCH_FAIL, payload: error });
  };

  const requetProductsStart = () => {
    return dispatch({ type: FETCH_REQUEST_PRODUCTS });
  };
  const requestProductsSuccess = (data) => {
    return dispatch({ type: FETCH_SUCCESS_PRODUCTS, payload: data });
  };
  const requestProductsError = (error) => {
    return dispatch({ type: FETCH_FAIL_PRODUCTS, payload: error });
  };

  const requetProductStart = () => {
    return dispatch({ type: FETCH_REQUEST_PRODUCT });
  };
  const requestProductSuccess = () => {
    return dispatch({ type: FETCH_SUCCESS_PRODUCT });
  };
  const requestProductError = (error) => {
    return dispatch({ type: FETCH_FAIL_PRODUCT, payload: error });
  };

  const updateRequest = () => {
    return dispatch({ type: UPDATE_REQUEST });
  };
  const updateFail = () => {
    return dispatch({ type: UPDATE_FAIL });
  };
  const updateSuccess = () => {
    return dispatch({ type: UPDATE_SUCCESS });
  };

  const uploadRequest = () => {
    return dispatch({ type: UPLOAD_REQUEST });
  };

  const uploadSuccess = () => {
    return dispatch({ type: UPLOAD_SUCCESS });
  };
  const uploadFail = (error) => {
    return dispatch({ type: UPLOAD_FAIL, payload: error });
  };
  const createRequest = () => {
    return dispatch({ type: CREATE_REQUEST });
  };

  const createSuccess = () => {
    return dispatch({ type: CREATE_SUCCESS });
  };
  const createFail = () => {
    return dispatch({ type: CREATE_FAIL });
  };

  const deleteRequest = () => {
    return dispatch({ type: DELETE_REQUEST });
  };

  const deleteSuccess = () => {
    return dispatch({ type: DELETE_SUCCESS });
  };
  const deleteFail = () => {
    return dispatch({ type: DELETE_FAIL });
  };
  const deleteReset = () => {
    return dispatch({ type: DELETE_RESET });
  };

  const fetchUsersRequest = () => {
    return dispatch({ type: FETCH_USERS_REQUEST });
  };
  const fetchUsersFail = (error) => {
    return dispatch({ type: FETCH_USERS_FAIL, payload: error });
  };
  const fetchUsersSuccess = (users) => {
    return dispatch({ type: FETCH_USERS_SUCCESS, payload: users });
  };

  const deleteUserRequest = () => {
    return dispatch({ type: DELETE_USER_REQUEST });
  };
  const deleteUserSuccess = () => {
    return dispatch({ type: DELETE_USER_SUCCESS });
  };
  const deleteUserFail = () => {
    return dispatch({ type: DELETE_USER_FAIL });
  };
  const deleteUserReset = () => {
    return dispatch({ type: DELETE_USER_RESET });
  };

  const fetchUserRequest = () => {
    return dispatch({ type: FETCH_USER_REQUEST });
  };
  const fetchUserFail = (error) => {
    return dispatch({ type: FETCH_USER_FAIL, payload: error });
  };
  const fetchUserSuccess = () => {
    return dispatch({ type: FETCH_USER_SUCCESS });
  };
  const value = {
    loading,
    error,
    orders,
    products,
    loadingProducts,
    loadingUpload,
    loadingCreate,
    loadingDelete,
    successDelete,
    users,
    loadingDeleteUser,
    loadingUsers,
    requetStart,
    requestSuccess,
    requestError,
    requetProductsStart,
    requestProductsSuccess,
    requestProductsError,
    requestProductError,
    requestProductSuccess,
    requetProductStart,
    updateRequest,
    updateFail,
    updateSuccess,
    loadingUpdate,
    errorUpdate,
    uploadRequest,
    uploadSuccess,
    uploadFail,
    createRequest,
    createSuccess,
    createFail,
    deleteRequest,
    deleteSuccess,
    deleteFail,
    deleteReset,
    fetchUsersRequest,
    fetchUsersFail,
    fetchUsersSuccess,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    deleteUserReset,
    fetchUserRequest,
    fetchUserFail,
    fetchUserSuccess,
  };
  return (
    <OrdersAdminContext.Provider value={value}>
      {props.children}
    </OrdersAdminContext.Provider>
  );
}
