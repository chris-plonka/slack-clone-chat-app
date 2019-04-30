import React, { Fragment, useState, useContext, useEffect } from "react";
import firebase from "../../firebase";
import Store from "../../Store";
import { Segment, Comment } from "semantic-ui-react";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

export default function Messages() {
  const { state, dispatch } = useContext(Store);
  const [messagesRef, setMessagesRef] = useState(
    firebase.database().ref("messages")
  );
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    const user = state.user.currentUser;
    const channel = state.channel.currentChannel;

    if (user && channel) {
      addListeners(channel.id);
    }

    return () => {
      removeMessageListeners();
    };
  }, [state.user.currentUser, state.channel.currentChannel]);

  const addListeners = channelId => {
    addMessageListener(channelId);
  };

  const addMessageListener = channelId => {
    let loadedMessages = [];
    messagesRef.child(channelId).on("child_added", snap => {
      // mutates the array, but won't trigger a render
      loadedMessages.push(snap.val());
      //creates a new array, which should trigger a render
      const loadedMessagesClone = [...loadedMessages];
      setMessages(loadedMessagesClone);
      console.log(loadedMessagesClone);
      setMessagesLoading(false);
    });
  };

  const removeMessageListeners = () => {
    messagesRef.off();
  };

  const displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={state.user.currentUser}
      />
    ));

  return (
    <Fragment>
      <MessagesHeader />

      <Segment>
        <Comment.Group className="messages">
          {displayMessages(messages)}
        </Comment.Group>
      </Segment>

      <MessageForm messagesRef={messagesRef} />
    </Fragment>
  );
}
