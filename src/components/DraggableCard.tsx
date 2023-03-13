import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

const DraggableCard = ({ toDoId, toDoText, index }: IDraggableCardProps) => {
  // console.log("toDoText", toDoText);
  return (
    <>
      <Draggable draggableId={`todo-${toDoId}`} index={index}>
        {/* draggableId는 string이어야함 */}
        {(provided, snapshot) => (
          <CardWrapper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging} // 드래깅 중인지 여부
          >
            <Card>{toDoText}</Card>
          </CardWrapper>
        )}
      </Draggable>
    </>
  );
};

export default React.memo(DraggableCard);
// prop(toDo, index)이 바뀌지 않는다면 제발 DraggableCard컴포넌트는 랜더링 하지 말라고 함.

const CardWrapper = styled.div<{ isDragging: boolean }>`
  padding: 15px;
  margin-top: 8px;
  opacity: ${(prop) => (prop.isDragging ? 0.85 : 1)};
  box-shadow: ${(props) =>
    props.isDragging
      ? "0px 2px 7px rgba(0,0,0,0.3)"
      : "0 0.25rem 0.5rem rgba(0, 0, 0, 0.15)"};
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
  color: black;
`;

const Card = styled.div``;
