// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};
const addID = (payload) => {
  return {
    type: "ADD_DATA",
    payload: payload,
  };
};


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
