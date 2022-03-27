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

function reducer(state, action) {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case FETCH_SUCCESS:
      return { ...state, loading: false, orders: action.payload, error: "" };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case FETCH_REQUEST_PRODUCTS:
      return { ...state, loadingProducts: true, error: "" };
    case FETCH_SUCCESS_PRODUCTS:
      return {
        ...state,
        loadingProducts: false,
        products: action.payload,
        error: "",
      };
    case FETCH_FAIL_PRODUCTS:
      return { ...state, loadingProducts: false, error: action.payload };
    case FETCH_REQUEST_PRODUCT:
      return { ...state, loading: true, error: "" };
    case FETCH_SUCCESS_PRODUCT:
      return { ...state, loading: false, error: "" };
    case FETCH_FAIL_PRODUCT:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_REQUEST:
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case UPDATE_SUCCESS:
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case UPDATE_FAIL:
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case UPLOAD_REQUEST:
      return { ...state, loadingUpload: true, errorUpload: "" };
    case UPLOAD_SUCCESS:
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case UPLOAD_FAIL:
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    case CREATE_REQUEST:
      return { ...state, loadingCreate: true, error: "" };
    case CREATE_SUCCESS:
      return { ...state, loadingCreate: false, error: "" };
    case CREATE_FAIL:
      return { ...state, loadingCreate: false, error: action.payload };
    case DELETE_REQUEST:
      return { ...state, loadingDelete: true, error: "" };
    case DELETE_SUCCESS:
      return { ...state, loadingDelete: false, successDelete: true, error: "" };
    case DELETE_FAIL:
      return { ...state, loadingDelete: false, error: action.payload };
    case DELETE_RESET:
      return { ...state, loadingDelete: false, successDelete: false };

    case FETCH_USERS_REQUEST:
      return { ...state, loadingUsers: true, error: "" };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loadingUsers: false,
        users: action.payload,
        error: "",
      };
    case FETCH_USERS_FAIL:
      return { ...state, loadingUsers: false, error: action.payload };

    case DELETE_USER_REQUEST:
      return { ...state, loadingDeleteUser: true };
    case DELETE_USER_SUCCESS:
      return { ...state, loadingDeleteUser: false, successDelete: true };
    case DELETE_USER_FAIL:
      return { ...state, loadingDeleteUser: false };
    case DELETE_USER_RESET:
      return { ...state, loadingDeleteUser: false, successDelete: false };

    case FETCH_USER_REQUEST:
      return { ...state, loading: true, error: "" };
    case FETCH_USER_SUCCESS:
      return { ...state, loading: false, error: "" };
    case FETCH_USER_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      state;
  }
}

export default reducer;
