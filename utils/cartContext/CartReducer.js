import { ADD_TO_CART , REMOVE_TO_CART , SAVE_SHIPPING_ADDRESS , SAVE_PAYMENT_METHOD , CART_CLEAR} from "../types";
import Cookies from "js-cookie";


function CartReducer(state, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => newItem.id === item.id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item)=>item.name === existItem.name ? newItem : item)
        : [...state.cart.cartItems, newItem];
        Cookies.set("cartItems" , JSON.stringify(cartItems))
      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }
    case REMOVE_TO_CART :{
      const cartItems = state.cart.cartItems.filter(item=>item.id !== action.payload.id);
      Cookies.set("cartItems" , JSON.stringify(cartItems));
      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }

    case SAVE_SHIPPING_ADDRESS :{
      return {
        ...state,
        shipingAddress: action.payload,
      }
    }

    case SAVE_PAYMENT_METHOD :{
      return {
        ...state,
        paymentMethod: action.payload,
      }
    }

    case CART_CLEAR : {
      return {
        ...state , cart : {...state.cart , cartItems : [] }
      }
    }

    default:
      return state;
  }
}

export default CartReducer;
