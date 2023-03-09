import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IDraggableCardProps {
  toDo: string;
  index: number;
}

const DraggableCard = ({ toDo, index }: IDraggableCardProps) => {
  console.log(toDo, "has been rendered");

  return (
    <>
      <Draggable key={toDo} draggableId={toDo} index={index}>
        {/* 여기서 key는 draggableId와 동일하게 */}
        {(magic, snapshot) => (
          <Card
            isDragging={snapshot.isDragging} // 드래깅 중인지 여부
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

export default React.memo(DraggableCard);
// prop(toDo, index)이 바뀌지 않는다면 제발 DraggableCard컴포넌트는 랜더링 하지 말라고 함.

const Card = styled.div<{ isDragging: boolean }>`
  padding: 10px;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  border-radius: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 7px rgba(0,0,0,0.3)" : "none"};
`;
