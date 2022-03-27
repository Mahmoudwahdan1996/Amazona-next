import { useReducer } from "react";
import { CartContext } from "./CartContext";
import Cookies from "js-cookie";
import { ADD_TO_CART , REMOVE_TO_CART , SAVE_SHIPPING_ADDRESS , SAVE_PAYMENT_METHOD , CART_CLEAR} from "../types";
import CartReducer from "./CartReducer";

const intialState = {
  cart: {
    cartItems: Cookies.get("cartItems")
      ? JSON.parse(Cookies.get("cartItems"))
      : [], 
    },
    shipingAddress : Cookies.get("shipingAddress") ? JSON.parse(Cookies.get("shipingAddress")) : {} ,
    paymentMethod: Cookies.get("paymentMethod") ? JSON.parse(Cookies.get("paymentMethod")) : "" ,
};
export function CartProvider(props) {
  const [state, dispatch] = useReducer(CartReducer, intialState);

  const addToCart = (product , quantity) => {
    return dispatch({ type: ADD_TO_CART, payload: {...product , quantity} });
  };

  const removeFromCart=(item)=>{
    return dispatch({type:REMOVE_TO_CART , payload:item})
  }

  const saveShipingAddress =( shipingAddress)=>{
    return dispatch({type: SAVE_SHIPPING_ADDRESS , payload:shipingAddress})
  }

  const savePaymentMethod =(paymentMethod)=>{
    return dispatch({type: SAVE_PAYMENT_METHOD , payload:paymentMethod})
  }

  const clearCartItems = ()=>{
    return dispatch({type:CART_CLEAR});
  }

  const value = { 
    cartItems: state.cart.cartItems,
    shipingAddress : state.shipingAddress , 
    paymentMethod: state.paymentMethod , 
    addToCart , 
    removeFromCart , 
    saveShipingAddress , 
    savePaymentMethod ,
    clearCartItems
  };
  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
}
