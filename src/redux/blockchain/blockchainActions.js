// constants
import Web3 from "web3";
import DragonToken from "../../contracts/DragonToken.json";
// log
import { fetchData } from "../data/dataActions";

// Very similar to the DataActions, It also has the same work to add actions 

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

// This function is supposed to connect the browser to the local blockchain! and update accounts whenever they are changed!
export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        console.log(accounts[0]);
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        console.log("network idn", networkId);
        const dragonTokenNetworkData = await DragonToken.networks[networkId];
        if (dragonTokenNetworkData) {
          const dragonToken = new web3.eth.Contract(
            DragonToken.abi,
            dragonTokenNetworkData.address
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              dragonToken: dragonToken,
              web3: web3,
            })
          );
          // Add listeners start
          window.ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed("Change network to Polygon."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
