import React, { useState, useContext, useEffect } from "react";
import Store from "../../Store";
import firebase from "../../firebase";
import { Header, Segment, Accordion, Icon, Image } from "semantic-ui-react";

export default function MetaPanel() {
  const { state } = useContext(Store);
  const [activeIndex, setActiveIndex] = useState(0);
  const channel = state.channel.currentChannel;
  const isPrivateChannel = state.channel.isPrivateChannel;

  const handleActiveIndexClick = (event, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  if (isPrivateChannel) return null;

  return (
    <Segment loading={!channel}>
      <Header as="h3" attached="top">
        About # {channel && channel.name}
      </Header>
      <Accordion styled attached="true">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleActiveIndexClick}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          Channel Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {channel && channel.details}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleActiveIndexClick}
        >
          <Icon name="dropdown" />
          <Icon name="user circle" />
          Top Posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          posters
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={handleActiveIndexClick}
        >
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          Created By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Header as="h3">
            <Image circular src={channel && channel.createdBy.avatar} />
            {channel && channel.createdBy.name}
          </Header>
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
}
