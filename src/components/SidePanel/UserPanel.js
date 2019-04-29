import React from "react";
import firebase from "../../firebase";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

const handleSignout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => console.log("signout"))
    .catch(err => console.log(err));
};

const dropdownOptions = () => [
  {
    key: "user",
    text: (
      <span>
        Signed in as <strong>User</strong>
      </span>
    ),
    disabled: true
  },
  {
    key: "avatar",
    text: <span>Change Avatar</span>
  },
  {
    key: "signout",
    text: <span onClick={handleSignout}>Sign Out</span>
  }
];

export default function UserPanel() {
  return (
    <Grid style={{ background: "#4c3c4c" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/* App header */}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
        </Grid.Row>
        {/* User Dropdown */}
        <Header style={{ padding: "0.25em" }} as="h4" inverted>
          <Dropdown trigger={<span>User</span>} options={dropdownOptions()} />
        </Header>
      </Grid.Column>
    </Grid>
  );
}
