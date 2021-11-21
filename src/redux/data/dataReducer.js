const initialState = {
  loading: false,
  allDragons: [],
  allOwnerDragons: [],
  allNotOwnerDragons: [],
  error: false,
  errorMsg: "",
  name: "init"
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...initialState,
        loading: false,
        allDragons: action.payload.allDragons,
        allOwnerDragons: action.payload.allOwnerDragons,
        allNotOwnerDragons: action.payload.allNotOwnerDragons,

      };
    case "ADD_DATA":
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        name: action.payload.name,

      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };

    default:
      return state;
  }
};

export default dataReducer;
