import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

export default function MessagesHeader({
  channelName,
  numUniqueUsers,
  handleSearchChange,
  searchLoading,
  isPrivateChannel
}) {
  return (
    <Segment clearing>
      {/* channel title */}
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          {!isPrivateChannel && <Icon name={"star outline"} color="black" />}
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>
      {/* channel search input */}
      <Header floated="right">
        <Input
          loading={searchLoading}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="search Messages"
          onChange={handleSearchChange}
        />
      </Header>
    </Segment>
  );
}
