import React, { useState } from "react";
import { Menu, Icon } from "semantic-ui-react";

export default function DirectMessages() {
  const [users, setUsers] = useState([]);

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>
        &nbsp; ({users.length})
      </Menu.Item>
      {/* Users to Send Direct Messages */}
    </Menu.Menu>
  );
}
