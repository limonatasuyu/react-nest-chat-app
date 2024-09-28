import { Button, Input, Typography } from "antd";
import { FC } from "react";
import DiceIcon from "./DiceIcon";
import { faker } from "@faker-js/faker";

function generateRandomRoomName() {
  const randomAdjective = faker.word.adjective(); // Get a random adjective
  const randomNoun = faker.word.noun(); // Get a random noun
  const randomNumber = faker.number.int({ min: 1, max: 999 }); // Optional, for uniqueness
  return `${capitalize(randomAdjective)}${capitalize(randomNoun)}${randomNumber}`;
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

interface GroupJoinProps {
  isCreatingNewRoom: boolean;
  groupLink: string;
  setGroupLink: (link: string) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  setIsCreatingNewRoom: (isCreating: boolean) => void;
  handleCreateGroup: () => void;
  handleJoinGroup: () => void;
}

const GroupJoin: FC<GroupJoinProps> = ({
  isCreatingNewRoom,
  groupLink,
  setGroupLink,
  groupName,
  setGroupName,
  setIsCreatingNewRoom,
  handleCreateGroup,
  handleJoinGroup,
}) => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <Typography.Title level={2} className="mb-4">
        Join or Create a Room
      </Typography.Title>
      {isCreatingNewRoom ? (
        <>
          <Input
            placeholder="Room Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mb-2 w-80"
            suffix={<DiceIcon onClick={() => setGroupName(generateRandomRoomName())} />}
          />
          <Button type="primary" onClick={handleCreateGroup} className="mb-2">
            Create Room
          </Button>
          <Button onClick={() => setIsCreatingNewRoom(false)}>Join Existing Room</Button>
        </>
      ) : (
        <>
          <Input
            placeholder="Room Link"
            value={groupLink}
            onChange={(e) => setGroupLink(e.target.value)}
            className="mb-2 w-80"
          />
          <Button type="primary" onClick={handleJoinGroup}>
            Join Room
          </Button>
          <Button onClick={() => setIsCreatingNewRoom(true)} className="mt-2">
            Create New Room
          </Button>
        </>
      )}
    </div>
  );
};

export default GroupJoin;
