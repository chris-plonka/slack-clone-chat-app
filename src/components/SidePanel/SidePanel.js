import React from "react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";
import { Menu } from "semantic-ui-react";

export default function SidePanel() {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPanel />
      <Starred />
      <Channels />
      <DirectMessages />
    </Menu>
  );
}
