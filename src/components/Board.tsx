import { useForm } from "react-hook-form";
import { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { ICard, boardState } from "../atom";
import { useRecoilState } from "recoil";

interface IBoardProps {
  boardTitle: string;
  boardId: number; // 말그대로 보드의 id
  boardToDos: ICard[];
  // isDragging: boolean;
}

interface ICardsWrapperProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IForm {
  toDo: string;
}

const Board = ({
  boardTitle,
  boardId,
  boardToDos,
}: // isDragging,
IBoardProps) => {
  const [boards, setBoards] = useRecoilState(boardState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  // addToDo
  const onCreateCard = ({ toDo }: IForm) => {
    console.log("toDo", toDo);
    console.log("boardTitle", boardTitle);
    console.log("boardId", boardId);
    console.log("boardToDos", boardToDos);
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setBoards((allBoards) => {
      const boardsCopy = [...allBoards];
      const boardIndex = allBoards.findIndex((b) => b.id === boardId);
      const boardCopy = { ...allBoards[boardIndex] };

      boardCopy.toDos = [newToDo, ...boardCopy.toDos];
      boardsCopy.splice(boardIndex, 1, boardCopy);

      localStorage.setItem("allBoards", JSON.stringify(boardsCopy));
      return boardsCopy;
    });
    setValue("toDo", "");
  };

  const onDeleteBoard = () => {
    if (window.confirm(`${boardTitle} 보드를 삭제하시겠습니까?`)) {
      setBoards((allBoards) => {
        const boardsCopy = [...allBoards];
        const boardIndex = allBoards.findIndex((b) => b.id === boardId);
        boardsCopy.splice(boardIndex, 1);
        return boardsCopy;
      });
    }
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
      {/* <input ref={inputRef} placeholder="grab me" />
        <button onClick={onClick}>click me</button> */}
      <Droppable droppableId={boardTitle}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver} // 보드 위로 올라왔는지 여부 boolean
            // isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)} // string이든 뭐든 존재하기만하면 true로
          >
            <TitleFormWrapper>
              <Title>
                <h2>{boardTitle}</h2>
                <button onClick={onDeleteBoard}>X</button>
              </Title>
              <Form onSubmit={handleSubmit(onCreateCard)}>
                <input
                  {...register("toDo", { required: true })}
                  type="text"
                  placeholder={`Add task on ${boardTitle}`}
                />
              </Form>
            </TitleFormWrapper>
            <CardsWrapper ref={provided.innerRef} {...provided.droppableProps}>
              {boardToDos.map((toDo, index) => (
                <DraggableCard
                  key={toDo.id}
                  toDoId={toDo.id}
                  toDoText={toDo.text}
                  index={index}
                />
              ))}
              {provided.placeholder}
              {/* Draggable 엘리먼트를 드래그하는 동안 position: fixed(영역을 고정시킴)를 적용함. (Droppable 리스트가 작아지는 것을 방지) */}
            </CardsWrapper>
          </Container>
        )}
      </Droppable>
    </>
  );
};

export default Board;

const Container = styled.div<{ isDraggingOver: boolean }>`
  width: 300px;
  border-radius: 15px;
  min-height: 285px;
  margin: 0 15px 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0.3rem 0.6rem rgba(0, 0, 0, 0.15);
  color: ${(props) => (props.isDraggingOver ? "white" : "none")};
  background-color: ${(props) =>
    props.isDraggingOver ? props.theme.accentColor : props.theme.boardColor};
`;

const TitleFormWrapper = styled.div``;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;

  h2 {
    font-weight: 600;
    font-size: 18px;
  }

  button {
    border: none;
    background-color: transparent;
  }
`;

const Form = styled.form`
  width: 100%;
  padding: 0 20px;
  /* margin: auto; */
  input {
    width: 100%;
  }
`;

const CardsWrapper = styled.div`
  /* props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3" // 드래그해서 떠날 때면 회색으로
      : "transparent"}; // 투명 */
  flex-grow: 1;
  transition: background-color 0.2s ease-in-out;
  padding: 16px 20px 20px 20px;
`;
