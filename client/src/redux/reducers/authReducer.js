const initialState = {
    user: null,
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_USER":
        return {
          ...state,
          user: action.payload,
        };
  
      case "LOGOUT_USER":
        return {
          ...state,
          user: null,
        };
  
      default:
        return state;
    }
  };