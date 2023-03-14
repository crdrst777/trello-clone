import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { ReactComponent as DeleteIcon } from "../assets/icon/delete.svg";
import { boardState } from "../atom";

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: number;
}

const DraggableCard = ({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) => {
  const [boards, setBoards] = useRecoilState(boardState);

  // 카드 삭제
  const onDeleteCard = () => {
    if (window.confirm(`${toDoText} 할 일을 삭제하시겠습니까?`)) {
      setBoards((allBoards) => {
        const boardsCopy = [...allBoards];
        const boardIndex = boardsCopy.findIndex((b) => b.id === boardId);
        const boardCopy = { ...boardsCopy[boardIndex] };
        const listCopy = [...boardCopy.toDos];
        const cardIndex = boardCopy.toDos.findIndex((c) => c.id === toDoId);

        listCopy.splice(cardIndex, 1);
        boardCopy.toDos = listCopy;
        boardsCopy.splice(boardIndex, 1, boardCopy);

        localStorage.setItem("allBoards", JSON.stringify(boardsCopy));
        return boardsCopy;
      });
    }
  };

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
  transition: background-color 0.25s, box-shadow 0.25s;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.06);
  }
  svg {
    width: 19px;
    height: 19px;
    fill: #bdbdbd;
  }
`;
