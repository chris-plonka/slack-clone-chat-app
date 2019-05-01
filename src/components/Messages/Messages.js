import React, { Fragment, useState, useContext, useEffect } from "react";
import firebase from "../../firebase";
import Store from "../../Store";
import { Segment, Comment } from "semantic-ui-react";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

export default function Messages() {
  const { state } = useContext(Store);
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [numUniqueUsers, setNumUniqueUsers] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const user = state.user.currentUser;
    const channel = state.channel.currentChannel;

    if (user && channel) {
      addListeners(channel.id);
    }

    return () => {
      removeListeners();
    };
  }, [state.user.currentUser, state.channel.currentChannel]);

  useEffect(() => {
    handleSearchMessages();
  }, [searchTerm]);

  const addListeners = channelId => {
    addMessageListener(channelId);
  };

  const removeListeners = () => {
    removeMessageListeners();
  };

  const getMessagesRef = () => {
    const isPrivateChannel = state.channel.isPrivateChannel;
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  const addMessageListener = channelId => {
    let loadedMessages = [];
    let ref = getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      // mutates the array, but won't trigger a render
      loadedMessages.push(snap.val());
      //creates a new array, which should trigger a render
      const loadedMessagesClone = [...loadedMessages];
      setMessages(loadedMessagesClone);
      setMessagesLoading(false);
      countUniqueUsers(loadedMessagesClone);
    });
  };

  const removeMessageListeners = () => {
    setMessages([]);
    countUniqueUsers([]);
    messagesRef.off();
  };

  const displayMessages = messages => {
    if (messages.length > 0) {
      return messages.map(message => (
        <Message
          key={message.timestamp}
          message={message}
          user={state.user.currentUser}
        />
      ));
    }
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
  };

  const handleSearchMessages = () => {
    const channelMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResultsLocal = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResultsLocal);
    setTimeout(() => setSearchLoading(false), 1000);
  };

  const countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    setNumUniqueUsers(numUniqueUsers);
  };

  const displayChannelName = channel => {
    const isPrivateChannel = state.channel.isPrivateChannel;
    return channel ? `${isPrivateChannel ? "@" : "#"}${channel.name}` : "";
  };

  return (
    <Fragment>
      <MessagesHeader
        searchLoading={searchLoading}
        handleSearchChange={handleSearchChange}
        numUniqueUsers={numUniqueUsers}
        channelName={displayChannelName(state.channel.currentChannel)}
        isPrivateChannel={state.channel.isPrivateChannel}
      />

      <Segment>
        <Comment.Group className="messages">
          {searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)}
        </Comment.Group>
      </Segment>

      <MessageForm
        getMessagesRef={getMessagesRef}
        isPrivateChannel={state.channel.isPrivateChannel}
      />
    </Fragment>
  );
}
