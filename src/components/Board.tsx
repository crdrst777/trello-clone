import { useForm } from "react-hook-form";
// import { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { ICard, boardState } from "../atom";
import { useRecoilState } from "recoil";
import { ReactComponent as DeleteIcon } from "../assets/icon/delete.svg";

interface IBoardProps {
  boardTitle: string;
  boardId: number;
  boardToDos: ICard[];
}

// interface ICardsWrapperProps {
//   isDraggingOver: boolean;
//   isDraggingFromThis: boolean;
// }

interface IForm {
  toDo: string;
}

const Board = ({ boardTitle, boardId, boardToDos }: IBoardProps) => {
  const [boards, setBoards] = useRecoilState(boardState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  // 카드 생성
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
      const boardIndex = boardsCopy.findIndex((b) => b.id === boardId);
      const boardCopy = { ...boardsCopy[boardIndex] };

      boardCopy.toDos = [newToDo, ...boardCopy.toDos];
      boardsCopy.splice(boardIndex, 1, boardCopy);

      localStorage.setItem("allBoards", JSON.stringify(boardsCopy));
      return boardsCopy;
    });
    setValue("toDo", "");
  };

  // 보드 삭제
  const onDeleteBoard = () => {
    if (window.confirm(`${boardTitle} 보드를 삭제하시겠습니까?`)) {
      setBoards((allBoards) => {
        const boardsCopy = [...allBoards];
        const boardIndex = boardsCopy.findIndex((b) => b.id === boardId);
        boardsCopy.splice(boardIndex, 1);
        localStorage.setItem("allBoards", JSON.stringify(boardsCopy));
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
            <CardTopArea>
              <TitleBtnWrapper>
                <Title>{boardTitle}</Title>
                <Btn onClick={onDeleteBoard}>
                  <DeleteIcon />
                </Btn>
              </TitleBtnWrapper>
              <Form onSubmit={handleSubmit(onCreateCard)}>
                <input
                  {...register("toDo", { required: true })}
                  type="text"
                  placeholder={`Add task on ${boardTitle}`}
                />
              </Form>
            </CardTopArea>
            <CardsWrapper ref={provided.innerRef} {...provided.droppableProps}>
              {boardToDos.map((toDo, index) => (
                <DraggableCard
                  key={toDo.id}
                  toDoId={toDo.id}
                  toDoText={toDo.text}
                  index={index}
                  boardId={boardId}
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

const CardTopArea = styled.div``;

const TitleBtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 18px;
`;

const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: background-color 0.25s, box-shadow 0.25s;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.hoverButtonOverlayColor};
  }
  svg {
    width: 23px;
    height: 23px;
    fill: ${(props) => props.theme.buttonColor};
  }
`;

const Form = styled.form`
  width: 100%;
  padding: 0 20px;
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
  transition: background-color 0.3s ease-in-out;
  padding: 16px 20px 20px 20px;
`;
