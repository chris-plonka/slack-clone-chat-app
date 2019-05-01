import React, { useContext, useState } from "react";
import Store from "../../Store";
import { setCurrentChannel, setPrivateChannel } from "../../action";
import { Menu, Icon } from "semantic-ui-react";

export default function Starred() {
  const { dispatch } = useContext(Store);
  const [starredChannels, setStarredChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");

  const changeChannel = channel => {
    setActiveChannel(channel.id);
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
  };

  const displayChannels = channels => {
    return (
      channels.length > 0 &&
      channels.map(channel => (
        <Menu.Item
          key={channel.id}
          onClick={() => changeChannel(channel)}
          name={channel.name}
          style={{ opacity: 0.7 }}
          active={channel.id === activeChannel}
        >
          # {channel.name}
        </Menu.Item>
      ))
    );
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
        </span>
        &nbsp; ({starredChannels.length})
      </Menu.Item>
      {/* starredChannels */}
      {displayChannels(starredChannels)}
    </Menu.Menu>
  );
}
