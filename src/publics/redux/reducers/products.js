const initialState = {
  isLoading: false,
  data: [],
  lastPage: 0,
  nextPage: "",
  page: 0,
  perPage: 0,
  prevPage: "",
  total: 0,
  hasMore: false,
  detail: []
};

export default (products = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PRODUCTS_PENDING":
      return Object.assign({}, state, {
        data: state.data,
        isLoading: true
      });

    case "GET_PRODUCTS_REJECTED":
      return {
        isLoading: false
      };

    case "GET_PRODUCTS_FULFILLED":
      if (action.payload.data.page !== action.payload.data.lastPage) {
        init = Object.assign({}, state, {
          data: [...state.data, ...action.payload.data.data],
          lastPage: action.payload.data.lastPage,
          nextPage: action.payload.data.nextPage,
          page: action.payload.data.page,
          perPage: action.payload.data.perPage,
          prevPage: action.payload.data.prevPage,
          total: action.payload.data.total,
          isLoading: false,
          hasMore: true
        });
      } else {
        init = Object.assign({}, state, {
          data: [...state.data, ...action.payload.data.data],
          lastPage: action.payload.data.lastPage,
          nextPage: action.payload.data.nextPage,
          page: action.payload.data.page,
          perPage: action.payload.data.perPage,
          prevPage: action.payload.data.prevPage,
          total: action.payload.data.total,
          isLoading: false,
          hasMore: false
        });
      }
      return init;

    case "GET_PRODUCT_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "GET_PRODUCT_REJECTED":
      return {
        isLoading: false
      };

    case "GET_PRODUCT_FULFILLED":
      return Object.assign({}, state, {
        detail: action.payload.data,
        isLoading: false
      });

    default:
      return state;
  }
});
