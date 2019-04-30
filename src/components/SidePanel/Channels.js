import React, { useState, Fragment } from "react";
import { useInput } from "../../customHooks/useInput";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

export default function Channels() {
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

  const closeModal = () => {
    setModal(false);
    resetChannelName();
    resetChannelDetails();
  };

  const openModal = () => {
    setModal(true);
  };

  return (
    <Fragment>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>
          &nbsp; ({channels.length}) <Icon name="add" onClick={openModal} />
        </Menu.Item>
        {/* channels */}
      </Menu.Menu>

      {/* Add Channel Modal */}
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                fluid
                label="Name of Channel"
                name="channelName"
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
          <Button color="green" inverted>
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
