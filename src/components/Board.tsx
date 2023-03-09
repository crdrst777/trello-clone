import { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";

interface IBoardProps {
  toDos: string[];
  boardId: string;
}

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Board = ({ toDos, boardId }: IBoardProps) => {
  const inputRef = useRef<HTMLInputElement>(null); // 타입 지정해줘야함. <HTMLInputElement>
  const onClick = () => {
    inputRef.current?.focus(); // 버튼을 누르면 input이 활성화됨.
    setTimeout(() => {
      inputRef.current?.blur(); // focus됐던게 5초 후에 풀림.
    }, 5000);
  };

  return (
    <>
      <Wrapper>
        <Title>{boardId}</Title>
        <input ref={inputRef} placeholder="grab me" />
        <button onClick={onClick}>click me</button>
        <Droppable droppableId={boardId}>
          {(magic, snapshot) => (
            <Area
              isDraggingOver={snapshot.isDraggingOver} // 보드 위로 올라왔는지 여부 boolean
              isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)} // string이든 뭐든 존재하기만하면 true로
              ref={magic.innerRef}
              {...magic.droppableProps}
            >
              {toDos.map((toDo, index) => (
                <DraggableCard key={toDo} toDo={toDo} index={index} />
              ))}
              {magic.placeholder}
              {/* Draggable 엘리먼트를 드래그하는 동안 position: fixed(영역을 고정시킴)를 적용함. (Droppable 리스트가 작아지는 것을 방지) */}
            </Area>
          )}
        </Droppable>
      </Wrapper>
    </>
  );
};

export default Board;

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3" // 드래그해서 떠날 때면 회색으로
      : "transparent"}; // 투명

  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;
