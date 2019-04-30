import React, { useState, useContext, useRef, useEffect } from "react";
import uuidv4 from "uuid/v4";
import { useInput } from "../../customHooks/useInput";
import firebase from "../../firebase";
import Store from "../../Store";
import { Segment, Input, Button } from "semantic-ui-react";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

export default function MessageForm({ messagesRef }) {
  const { state } = useContext(Store);
  const inputMessage = useRef(null);
  const { value: message, bind: bindMessage, reset: resetMessage } = useInput(
    ""
  );
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [uploadState, setUploadState] = useState("");
  const [uploadTask, setUploadTask] = useState(null);
  const [precentUploaded, setPrecentUploaded] = useState(0);
  const [storageRef] = useState(firebase.storage().ref());

  const handleUploadError = err => {
    console.error(err);
    setErrors([...errors].concat(err));
    setUploadState("error");
    setUploadTask(null);
  };

  useEffect(() => {
    if (uploadTask !== null) {
      uploadTask.task.on(
        "state_changed",
        snap => {
          const precentUploadedLocal = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          setPrecentUploaded(precentUploadedLocal);
        },
        err => handleUploadError(err),
        () => {
          uploadTask.task.snapshot.ref
            .getDownloadURL()
            .then(downloadUrl => {
              console.log(downloadUrl);
              sendFileMessage(
                downloadUrl,
                uploadTask.ref,
                uploadTask.pathToUpload
              );
            })
            .catch(err => handleUploadError(err));
        }
      );
    }
  }, [uploadTask]);

  const sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(createMessage(fileUrl))
      .then(() => {
        setUploadState("done");
      })
      .catch(err => handleUploadError(err));
  };

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

  const uploadFile = (file, metadata) => {
    const pathToUpload = state.channel.currentChannel.id;
    const filePath = `chat/public/${uuidv4()}`;

    setUploadState("uploading");
    setUploadTask({
      task: storageRef.child(filePath).put(file, metadata),
      pathToUpload,
      ref: messagesRef
    });
  };

  const createMessage = (fileUrl = null) => {
    const { user } = state;
    const messageObj = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.currentUser.uid,
        name: user.currentUser.displayName,
        avatar: user.currentUser.photoURL
      }
    };
    if (fileUrl !== null) {
      messageObj["image"] = fileUrl;
    } else {
      messageObj["content"] = message;
    }

    return messageObj;
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
          disabled={uploadState === "uploading"}
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
          onClick={openModal}
        />
      </Button.Group>
      <FileModal
        modal={modal}
        closeModal={closeModal}
        uploadFile={uploadFile}
      />
      <ProgressBar
        uploadState={uploadState}
        precentUploaded={precentUploaded}
      />
    </Segment>
  );
}
