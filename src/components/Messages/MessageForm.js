import React, { useState, useContext, useRef } from "react";
import { useInput } from "../../customHooks/useInput";
import firebase from "../../firebase";
import Store from "../../Store";
import { Segment, Input, Button } from "semantic-ui-react";
import FileModal from "./FileModal";

export default function MessageForm({ messagesRef }) {
  const { state, dispatch } = useContext(Store);
  const inputMessage = useRef(null);
  const { value: message, bind: bindMessage, reset: resetMessage } = useInput(
    ""
  );
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const handleErrors = inputName => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const createMessage = () => {
    const { user } = state;
    return {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.currentUser.uid,
        name: user.currentUser.displayName,
        avatar: user.currentUser.photoURL
      }
    };
  };

  const sendMessage = () => {
    const { channel } = state;
    if (message && channel.currentChannel) {
      setLoading(true);
      messagesRef
        .child(channel.currentChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          resetMessage();
          setErrors([]);
          inputMessage.current.focus();
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
          const newError = [...errors].concat(err);
          setErrors(newError);
          inputMessage.current.focus();
        });
    } else {
      const err = {
        message: "Add a message"
      };
      console.error(err);
      const newError = [...errors].concat(err);
      setErrors(newError);
      inputMessage.current.focus();
    }
  };

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        ref={inputMessage}
        {...bindMessage}
        className={handleErrors("message")}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        placeholder="write your message"
        autoFocus
      />
      <Button.Group icon widths="2">
        <Button
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          disabled={loading}
          onClick={sendMessage}
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
          onClick={openModal}
        />
        <FileModal modal={modal} closeModal={closeModal} />
      </Button.Group>
    </Segment>
  );
}
