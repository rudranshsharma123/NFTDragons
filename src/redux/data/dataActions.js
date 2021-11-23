// log
import store from "../store";
//This fucntion is supposed to call the action Check Data Request to set the initial state and turn loading to true!!
const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};
// This fucntion is supposed to be called with and will update the values in the state!
const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};
// This function was supposed to change the Name vairable in the state but it was not working like intended
const addID = (payload) => {
  return {
    type: "ADD_DATA",
    payload: payload,
  };
};

// This is for the case when the data is not getting fetched!
const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};
// This function was supposed to add the "Name" feild to the state but it was not working as intended during production and testing so, I had to abandon the multi-page appraoch
export const addName = (name) => {
  return async (dispatch) => {
    console.log(name);
    dispatch(addID({ name }));
  }

}

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let allDragons = await store
        .getState()
        .blockchain.dragonToken.methods.getDragons()
        .call();
      let allOwnerDragons = await store
        .getState()
        .blockchain.dragonToken.methods.getOwnerDragons(account)
        .call();
      let allNotOwnerDragons = await store
        .getState()
        .blockchain.dragonToken.methods.getDragonsOfNotUser(account)
        .call();


      dispatch(
        fetchDataSuccess({
          allDragons,
          allOwnerDragons,
          allNotOwnerDragons,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
