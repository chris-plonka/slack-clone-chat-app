import React, { Fragment, useState } from "react";
import firebase from "../../firebase";
import { Segment, Comment } from "semantic-ui-react";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";

export default function Messages() {
  const [messagesRef, setMessagesRef] = useState(
    firebase.database().ref("messages")
  );
  return (
    <Fragment>
      <MessagesHeader />

      <Segment>
        <Comment.Group className="messages">{/* Messages */}</Comment.Group>
      </Segment>

      <MessageForm messagesRef={messagesRef} />
    </Fragment>
  );
}
