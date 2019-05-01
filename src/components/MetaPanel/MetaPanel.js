import React, { useState, useContext, useEffect } from "react";
import Store from "../../Store";
import { Header, Segment, Accordion, Icon } from "semantic-ui-react";

export default function MetaPanel() {
  const { state } = useContext(Store);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleActiveIndexClick = (event, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  if (state.channel.isPrivateChannel) return null;

  return (
    <Segment>
      <Header as="h3" attached="top">
        About # Channel
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
          details
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
          creator
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
}
