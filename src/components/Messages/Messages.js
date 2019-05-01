import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import firebase from "../../firebase";
import Store from "../../Store";
import { useMutable } from "../../customHooks/useMutable";
import { setUserPosts } from "../../action";
import { Segment, Comment } from "semantic-ui-react";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import Typing from "./Typing";

export default function Messages() {
  const { state, dispatch } = useContext(Store);
  const isClick = useRef(false);
  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [usersRef] = useState(firebase.database().ref("users"));
  const [typingRef] = useState(firebase.database().ref("typing"));
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
  const [typingUsers, setTypingUsers] = useState([]);

  const {
    ref: isChannelStarredRef,
    val: isChannelStarred,
    set: setIsChannelStarred
  } = useMutable(false);

  useEffect(() => {
    if (state.channel.currentChannel && isClick.current) {
      starChannel();
    }
  }, [isChannelStarred]);

  useEffect(() => {
    const user = state.user.currentUser;
    const channel = state.channel.currentChannel;

    if (user && channel) {
      addListeners(channel.id);
      addUserStarsListener(channel.id, user.uid);
    }

    return () => {
      //console.log("clean up", user, channel);
      removeListeners();
    };
  }, [state.user.currentUser, state.channel.currentChannel]);

  useEffect(() => {
    handleSearchMessages();
  }, [searchTerm]);

  const addListeners = channelId => {
    addMessageListener(channelId);
    addTypingListener(channelId);
  };

  const removeListeners = () => {
    removeMessageListeners();
    removeUserStarsListeners();
    removeTypingListeners();
  };

  const getMessagesRef = () => {
    const isPrivateChannel = state.channel.isPrivateChannel;
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  const handleStar = () => {
    setIsChannelStarred(c => !c);
    isClick.current = true;
  };

  const starChannel = () => {
    isClick.current = false;
    if (isChannelStarredRef.current) {
      usersRef.child(`${state.user.currentUser.uid}/starred`).update({
        [state.channel.currentChannel.id]: {
          name: state.channel.currentChannel.name,
          details: state.channel.currentChannel.details,
          createdBy: {
            name: state.channel.currentChannel.createdBy.name,
            avatar: state.channel.currentChannel.createdBy.avatar
          }
        }
      });
    } else {
      usersRef
        .child(`${state.user.currentUser.uid}/starred`)
        .child(state.channel.currentChannel.id)
        .remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  };

  const addUserStarsListener = (channelId, userId) => {
    usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          setIsChannelStarred(prevStarred);
        }
      });
  };

  const addTypingListener = channelId => {
    const currentUser = state.user.currentUser;
    let typingUsersLocal = [];
    if (channelId && currentUser) {
      typingRef.child(channelId).on("child_added", snap => {
        if (snap.key !== currentUser.uid) {
          typingUsersLocal = typingUsersLocal.concat({
            id: snap.key,
            name: snap.val()
          });
          setTypingUsers([...typingUsersLocal]);
        }
      });
      typingRef.child(channelId).on("child_removed", snap => {
        const index = typingUsersLocal.findIndex(user => user.id === snap.key);
        if (index !== -1) {
          typingUsersLocal = typingUsersLocal.filter(
            user => user.id !== snap.key
          );
          setTypingUsers([...typingUsersLocal]);
        }
      });

      connectedRef.on("value", snap => {
        if (snap.val() === true) {
          typingRef
            .child(channelId)
            .child(currentUser.uid)
            .onDisconnect()
            .remove(err => {
              if (err !== null) {
                console.error(err);
              }
            });
        }
      });
    }
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
      countUserPosts(loadedMessagesClone);
    });
  };

  const removeUserStarsListeners = () => {
    setIsChannelStarred(false);
    //usersRef.off();
  };

  const removeMessageListeners = () => {
    setMessages([]);
    countUniqueUsers([]);
    countUserPosts([]);
    messagesRef.off();
  };

  const removeTypingListeners = () => {
    setTypingUsers([]);
    typingRef.off();
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

  const countUserPosts = messages => {
    const userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});

    dispatch(setUserPosts(userPosts));
  };

  const displayChannelName = channel => {
    const isPrivateChannel = state.channel.isPrivateChannel;
    return channel ? `${isPrivateChannel ? "@" : "#"}${channel.name}` : "";
  };

  const displayTypingUsers = typing =>
    typing.length > 0 &&
    typing.map(user => (
      <div style={{ display: "flex", alignItems: "center" }} key={user.id}>
        <span className="user__typing">{user.name} is typing</span>
        <Typing />
      </div>
    ));

  return (
    <Fragment>
      <MessagesHeader
        searchLoading={searchLoading}
        handleSearchChange={handleSearchChange}
        numUniqueUsers={numUniqueUsers}
        channelName={displayChannelName(state.channel.currentChannel)}
        isPrivateChannel={state.channel.isPrivateChannel}
        handleStar={handleStar}
        isChannelStarred={isChannelStarred}
      />

      <Segment>
        <Comment.Group className="messages">
          {searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)}
          {displayTypingUsers(typingUsers)}
        </Comment.Group>
      </Segment>

      <MessageForm
        getMessagesRef={getMessagesRef}
        isPrivateChannel={state.channel.isPrivateChannel}
      />
    </Fragment>
  );
}
