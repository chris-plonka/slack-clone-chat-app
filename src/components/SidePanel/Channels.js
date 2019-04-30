import React, { useState, useContext, useEffect, Fragment } from "react";
import { useInput } from "../../customHooks/useInput";
import firebase from "../../firebase";
import Store from "../../Store";
import { setCurrentChannel } from "../../action";
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
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeChannel, setActiveChannel] = useState("");
  const [channelsRef, setChannelsRef] = useState(
    firebase.database().ref("channels")
  );

  useEffect(() => {
    addListeners();
    // Clean up the Listeners
    return () => {
      removeListeners();
    };
  }, []);

  useEffect(() => {
    setFirstChannel();
  }, [channels]);

  const removeListeners = () => {
    channelsRef.off();
  };

  const addListeners = () => {
    let loadedChannels = [];
    channelsRef.on("child_added", snap => {
      // mutates the array, but won't trigger a render
      loadedChannels.push(snap.val());
      //creates a new array, which should trigger a render
      const loadedChannelsClone = [...loadedChannels];
      setChannels(loadedChannelsClone);
    });
  };

  const changeChannel = channel => {
    setActiveChannel(channel.id);
    dispatch(setCurrentChannel(channel));
  };

  const setFirstChannel = () => {
    if (firstLoad && channels.length > 0) {
      const firstChannel = channels[0];
      changeChannel(firstChannel);
      setFirstLoad(false);
    }
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
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>
          &nbsp; ({channels.length}){" "}
          <Icon link name="add" onClick={openModal} />
        </Menu.Item>
        {/* channels */}
        {displayChannels(channels)}
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
