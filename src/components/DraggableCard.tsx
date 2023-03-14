import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ReactComponent as DeleteIcon } from "../assets/icon/delete.svg";

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

const DraggableCard = ({ toDoId, toDoText, index }: IDraggableCardProps) => {
  // 카드 삭제
  const onDeleteCard = () => {};

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
            <Card>
              <Text>{toDoText}</Text>
              <Btn onClick={onDeleteCard}>
                <DeleteIcon />
              </Btn>
            </Card>
          </CardWrapper>
        )}
      </Draggable>
    </>
  );
};

export default React.memo(DraggableCard);
// prop(toDo, index)이 바뀌지 않는다면 제발 DraggableCard컴포넌트는 랜더링 하지 말라고 함.

const CardWrapper = styled.div<{ isDragging: boolean }>`
  padding: 10px 10px 10px 15px;
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

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Text = styled.div``;

const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33px;
  height: 33px;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.hoverButtonOverlayColor};
  }
  svg {
    width: 19px;
    height: 19px;
    fill: ${(props) => props.theme.buttonColor};
  }
`;
