import React, { useState, useContext } from "react";
import Store from "../../Store";
import firebase from "../../firebase";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment
} from "semantic-ui-react";
import { SliderPicker } from "react-color";

export default function ColorPanel() {
  const { state } = useContext(Store);
  const user = state.user.currentUser;
  const [modal, setModal] = useState(false);
  const [primary, setPrimary] = useState("#40bfa4");
  const [secondary, setSecondary] = useState("#4540bf");
  const [usersRef] = useState(firebase.database().ref("users"));

  const closeModal = () => {
    setModal(false);
  };

  const openModal = () => {
    setModal(true);
  };

  const handleChangeColorPicker = picker => color => {
    switch (picker) {
      case "primary":
        setPrimary(color.hex);
        break;
      case "secondary":
        setSecondary(color.hex);
        break;
      default:
        break;
    }
  };

  const handleSaveColor = () => {
    if (primary && secondary) {
      saveColors(primary, secondary);
    }
  };

  const saveColors = (primary, secondary) => {
    usersRef
      .child(`${user.uid}/colors`)
      .push()
      .update({
        primary,
        secondary
      })
      .then(() => {
        console.log("color saved");
        closeModal();
      })
      .catch(err => console.error(err));
  };

  return (
    <Sidebar
      as={Menu}
      icon="labeled"
      inverted
      vertical
      visible
      width="very thin"
    >
      <Divider />
      <Button icon="add" size="small" color="blue" onClick={openModal} />

      {/* Color Picker Modal */}
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Segment inverted>
            <Label content="Primary Color" />
            <SliderPicker
              color={primary}
              onChange={handleChangeColorPicker("primary")}
            />
          </Segment>
          <Segment inverted>
            <Label content="Secondary Color" />
            <SliderPicker
              color={secondary}
              onChange={handleChangeColorPicker("secondary")}
            />
          </Segment>
        </Modal.Content>

        <Modal.Actions>
          <Button color="green" inverted onClick={handleSaveColor}>
            <Icon name="checkmark" /> Save Colors
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
}
