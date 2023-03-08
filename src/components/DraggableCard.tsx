import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IDraggableCardProps {
  toDo: string;
  index: number;
}

const DraggableCard = ({ toDo, index }: IDraggableCardProps) => {
  return (
    <>
      <Draggable key={toDo} draggableId={toDo} index={index}>
        {/* 여기서 key는 draggableId와 동일하게 */}
        {(magic) => (
          <Card
            ref={magic.innerRef}
            {...magic.dragHandleProps}
            {...magic.draggableProps}
          >
            {toDo}
          </Card>
        )}
      </Draggable>
    </>
  );
};

export default DraggableCard;

const Card = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
`;
