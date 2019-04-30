import React, { useState, useContext, Fragment } from "react";
import { useInput } from "../../customHooks/useInput";
import firebase from "../../firebase";
import Store from "../../Store";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

export default function Channels() {
  const { state, dispatch } = useContext(Store);
  const {
    value: channelName,
    bind: bindChannelName,
    reset: resetChannelName
  } = useInput("");
  const {
    value: channelDetails,
    bind: bindChannelDetails,
    reset: resetChannelDetails
  } = useInput("");
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [channelsRef, setChannelsRef] = useState(
    firebase.database().ref("channels")
  );

  const closeModal = () => {
    setModal(false);
    resetChannelName();
    resetChannelDetails();
  };

  const openModal = () => {
    setModal(true);
  };

  const isFormValid = () => {
    let errors = [];
    let error;

    if (channelName.length <= 0) {
      error = { message: "Fill in the Name of Channel" };
      errors.push(error);
    }
    if (channelDetails.length <= 0) {
      error = { message: "Fill in the About the Channel" };
      errors.push(error);
    }
    if (errors.length > 0) {
      setErrors(errors);
      return false;
    } else {
      return true;
    }
  };

  const addChannel = () => {
    const key = channelsRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: state.user.currentUser.displayName,
        avatar: state.user.currentUser.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        closeModal();
        console.log("channel added");
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setErrors([err]);
      });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid()) {
      addChannel();
    }
  };

  return (
    <Fragment>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>
          &nbsp; ({channels.length}){" "}
          <Icon link name="add" onClick={openModal} />
        </Menu.Item>
        {/* channels */}
      </Menu.Menu>

      {/* Add Channel Modal */}
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label="Name of Channel"
                name="channelName"
                autoFocus
                {...bindChannelName}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="About the Channel"
                name="channelDetails"
                {...bindChannelDetails}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color="green" inverted onClick={handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
}
