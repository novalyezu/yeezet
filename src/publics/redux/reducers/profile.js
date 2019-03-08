const initialState = {
  data: [],
  isLoading: false
};

export default (profiles = (state = initialState, action) => {
  switch (action.type) {
    case "GET_FULL_PRORILE_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "GET_FULL_PRORILE_REJECTED":
      return Object.assign({}, state, {
        isLoading: false
      });

    case "GET_FULL_PRORILE_FULFILLED":
      return Object.assign({}, state, {
        data: action.payload.data,
        isLoading: false
      });

    case "UPDATE_PROFILE_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "UPDATE_PROFILE_REJECTED":
      return Object.assign({}, state, {
        isLoading: false
      });

    case "UPDATE_PROFILE_FULFILLED":
      return Object.assign({}, state, {
        data: action.payload.data,
        isLoading: false
      });

    default:
      return state;
  }
});
