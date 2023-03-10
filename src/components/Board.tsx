import { useForm } from "react-hook-form";
import { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { IToDo, toDoState } from "../atom";
import { useSetRecoilState } from "recoil";

interface IBoardProps {
  toDos: IToDo[];
  boardId: string; // Doing이나 Done같은거임
}

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IForm {
  toDo: string;
}

const Board = ({ toDos, boardId }: IBoardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    console.log(toDo);
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [
          newToDo,
          ...allBoards[boardId], // 기존의 board 내용들 예를들면 { id: 1, text: "hi" }, { id: 2, text: "hello" },
        ],
      };
    });
    setValue("toDo", "");
  };

  // const inputRef = useRef<HTMLInputElement>(null); // 타입 지정해줘야함. <HTMLInputElement>
  // const onClick = () => {
  //   inputRef.current?.focus(); // 버튼을 누르면 input이 활성화됨.
  //   setTimeout(() => {
  //     inputRef.current?.blur(); // focus됐던게 5초 후에 풀림.
  //   }, 5000);
  // };

  return (
    <>
      <Wrapper>
        <Title>{boardId}</Title>
        <Form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("toDo", { required: true })}
            type="text"
            placeholder={`Àdd task on ${boardId}`}
          />
        </Form>
        {/* <input ref={inputRef} placeholder="grab me" />
        <button onClick={onClick}>click me</button> */}
        <Droppable droppableId={boardId}>
          {(magic, snapshot) => (
            <Area
              isDraggingOver={snapshot.isDraggingOver} // 보드 위로 올라왔는지 여부 boolean
              isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)} // string이든 뭐든 존재하기만하면 true로
              ref={magic.innerRef}
              {...magic.droppableProps}
            >
              {toDos.map((toDo, index) => (
                <DraggableCard
                  key={toDo.id}
                  index={index}
                  toDoId={toDo.id}
                  toDoText={toDo.text}
                />
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

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
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
