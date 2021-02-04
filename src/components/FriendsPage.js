import React from "react";

class FriendsPage extends React.Component {
  render() {
    const { friends } = this.props;
    return (
      <main className="p-4 pt-0 w-screen ">
        <div className="p-4 bg-white shadow-md">
          {friends ? "Friends fetched!" : "Loading..."}
        </div>
      </main>
    );
  }
}

export default FriendsPage;
