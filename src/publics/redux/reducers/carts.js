const initialState = {
  carts: [],
  isLoading: false,
  totalPrice: 0
};

export default (carts = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "ADD_TO_CART_REJECTED":
      return {
        isLoading: false
      };

    case "ADD_TO_CART_FULFILLED":
      return Object.assign({}, state, {
        isLoading: false
      });

    case "GET_CARTS_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "GET_CARTS_REJECTED":
      return {
        isLoading: false
      };

    case "GET_CARTS_FULFILLED":
      const totalPriceCart = Object.keys(action.payload.data).reduce(
        (prev, key) => {
          return prev + action.payload.data[key].price;
        },
        0
      );
      return Object.assign({}, state, {
        carts: action.payload.data,
        isLoading: false,
        totalPrice: totalPriceCart
      });

    case "ADD_QTY_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "ADD_QTY_REJECTED":
      return {
        isLoading: false
      };

    case "ADD_QTY_FULFILLED":
      let findAdd = state.carts.find(obj => {
        return obj.id === action.payload.data.id;
      });
      Object.assign(findAdd, {
        qty: action.payload.data.qty,
        price: action.payload.data.price
      });
      const totalPriceAdd = Object.keys(state.carts).reduce((prev, key) => {
        return prev + state.carts[key].price;
      }, 0);
      return Object.assign({}, state, {
        isLoading: false,
        totalPrice: totalPriceAdd
      });

    case "MIN_QTY_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "MIN_QTY_REJECTED":
      return {
        isLoading: false
      };

    case "MIN_QTY_FULFILLED":
      let findMin = state.carts.find(obj => {
        return obj.id === action.payload.data.id;
      });
      Object.assign(findMin, {
        qty: action.payload.data.qty,
        price: action.payload.data.price
      });
      const totalPriceMin = Object.keys(state.carts).reduce((prev, key) => {
        return prev + state.carts[key].price;
      }, 0);
      return Object.assign({}, state, {
        isLoading: false,
        totalPrice: totalPriceMin
      });

    case "DELETE_ITEM_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "DELETE_ITEM_REJECTED":
      return {
        isLoading: false
      };

    case "DELETE_ITEM_FULFILLED":
      const clone = state.carts;
      const index = clone.findIndex(
        obj => parseInt(obj.id) === parseInt(action.payload.data)
      );
      if (index !== -1) clone.splice(index, 1);
      const totalPriceDel = Object.keys(state.carts).reduce((prev, key) => {
        return prev + state.carts[key].price;
      }, 0);
      return Object.assign({}, state, {
        carts: clone,
        isLoading: false,
        totalPrice: totalPriceDel
      });

    case "DONE_PAY_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "DONE_PAY_REJECTED":
      return {
        isLoading: false
      };

    case "DONE_PAY_FULFILLED":
      return Object.assign({}, state, {
        carts: [],
        isLoading: false,
        totalPrice: 0
      });

    case "EMPTY_CART":
      return Object.assign({}, state, {
        carts: [],
        totalPrice: 0
      });

    default:
      return state;
  }
});
