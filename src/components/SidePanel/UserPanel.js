import React, { useContext } from "react";
import firebase from "../../firebase";
import Store from "../../Store";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

export default function UserPanel() {
  const { state, dispatch } = useContext(Store);

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
          Signed in as <strong>{state.user.currentUser.displayName}</strong>
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
          <Dropdown
            trigger={<span>{state.user.currentUser.displayName}</span>}
            options={dropdownOptions()}
          />
        </Header>
      </Grid.Column>
    </Grid>
  );
}
