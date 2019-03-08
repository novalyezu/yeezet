const initialState = {
  data: [],
  isLoading: false
};

export default (address = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ADDRESS_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "GET_ADDRESS_REJECTED":
      return Object.assign({}, state, {
        isLoading: false
      });

    case "GET_ADDRESS_FULFILLED":
      return Object.assign({}, state, {
        data: action.payload.data,
        isLoading: false
      });

    case "UPDATE_ADDRESS_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "UPDATE_ADDRESS_REJECTED":
      return Object.assign({}, state, {
        isLoading: false
      });

    case "UPDATE_ADDRESS_FULFILLED":
      let find = state.data.find(obj => {
        return obj.id === action.payload.data.id;
      });
      Object.assign(find, {
        label: action.payload.data.label,
        name: action.payload.data.name,
        phone: action.payload.data.phone,
        province: action.payload.data.province,
        district: action.payload.data.district,
        sub_district: action.payload.data.sub_district,
        postal_code: action.payload.data.postal_code,
        full_address: action.payload.data.full_address
      });
      return Object.assign({}, state, {
        data: state.data,
        isLoading: false
      });

    case "ADD_ADDRESS_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "ADD_ADDRESS_REJECTED":
      return Object.assign({}, state, {
        isLoading: false
      });

    case "ADD_ADDRESS_FULFILLED":
      let newAdd = {
        id: action.payload.data.id,
        user_id: action.payload.data.user_id,
        label: action.payload.data.label,
        name: action.payload.data.name,
        phone: action.payload.data.phone,
        province: action.payload.data.province,
        district: action.payload.data.district,
        sub_district: action.payload.data.sub_district,
        postal_code: action.payload.data.postal_code,
        full_address: action.payload.data.full_address,
        created_at: action.payload.data.created_at,
        updated_at: action.payload.data.updated_at
      };
      return Object.assign({}, state, {
        data: [...state.data, newAdd],
        isLoading: false
      });

    default:
      return state;
  }
});
