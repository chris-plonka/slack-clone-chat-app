import React from "react";
import { useInput } from "../../customHooks/useInput";
import { Icon, Modal, Input, Button } from "semantic-ui-react";

export default function FileModal({ modal, closeModal }) {
  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
          autoFocus
        />
      </Modal.Content>

      <Modal.Actions>
        <Button color="green" inverted>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
