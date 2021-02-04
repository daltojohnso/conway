import { fetchFriends } from "./service";

const friendsLoad = "friends/load";

export const loadFriends = () => {
  return (dispatch) => {
    fetchFriends().then((friends) => {
      dispatch({
        type: friendsLoad,
        friends,
      });
    });
  };
};
