import React, { useState, useContext } from "react";
import { useInput } from "../../customHooks/useInput";
import firebase from "../../firebase";
import Store from "../../Store";
import { Segment, Input, Button } from "semantic-ui-react";

export default function MessageForm({ messagesRef }) {
  const { state, dispatch } = useContext(Store);
  const { value: message, bind: bindMessage, reset: resetMessage } = useInput(
    ""
  );
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleErrors = inputName => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
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
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
          const newError = [...errors].concat(err);
          setErrors(newError);
        });
    } else {
      const err = {
        message: "Add a message"
      };
      console.error(err);
      const newError = [...errors].concat(err);
      setErrors(newError);
    }
  };

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        {...bindMessage}
        className={handleErrors("message")}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        placeholder="write your message"
      />
      <Button.Group icon widths="2">
        <Button
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          onClick={sendMessage}
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  );
}
