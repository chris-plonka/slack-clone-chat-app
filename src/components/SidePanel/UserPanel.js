import React, { useContext, useState } from "react";
import firebase from "../../firebase";
import Store from "../../Store";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button
} from "semantic-ui-react";

export default function UserPanel() {
  const { state } = useContext(Store);
  const [modal, setModal] = useState(false);

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
      text: <span onClick={openModal}>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign Out</span>
    }
  ];

  const closeModal = () => {
    setModal(false);
  };

  const openModal = () => {
    setModal(true);
  };

  return (
    <Grid>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/* App header */}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
          {/* User Dropdown */}
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image
                    src={state.user.currentUser.photoURL}
                    spaced="right"
                    avatar
                  />
                  {state.user.currentUser.displayName}
                </span>
              }
              options={dropdownOptions()}
            />
          </Header>
        </Grid.Row>

        {/* Change User Avatar Modal */}
        <Modal basic open={modal} onClose={closeModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input fluid type="file" label="New Avatar" name="previewImage" />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {/* Image Preview */}
                </Grid.Column>
                <Grid.Column>{/* Cropped Image Preview */}</Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="save" /> Change Avatar
            </Button>
            <Button color="green" inverted>
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" inverted onClick={closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
}
