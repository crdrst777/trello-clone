import { useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { boardState } from "./atom";
import Board from "./components/Board";
// import AddBoxIcon from "@mui/icons-material/AddBox";
import { ReactComponent as Add } from "./assets/icon/add.svg";

function App() {
  const [boards, setBoards] = useRecoilState(boardState);

  useEffect(() => {
    if (localStorage.getItem("allBoards")) {
      setBoards(() => {
        return JSON.parse(localStorage.getItem("allBoards") || "");
      });
    }
  }, []);

  const onCreateBoard = () => {
    const name = window.prompt("새 보드의 이름을 입력해주세요.")?.trim(); // 앞과 뒤쪽의 공백을 제거하여 줌
    if (name !== null && name !== undefined) {
      if (name === "") {
        alert("이름을 입력해주세요.");
        return;
      }
      setBoards((allBoards) => {
        const boardsCopy = [...allBoards];
        const newBoards = [
          ...boardsCopy,
          { title: name, id: Date.now(), toDos: [] },
        ];
        localStorage.setItem("allBoards", JSON.stringify(newBoards));
        return newBoards;
      });
    }
  };

  // onDragEnd함수는 드래그를 끝낸 시점에 불려진다.
  // 원래 있던 위치(source.index)에서 지우고, 이동한 위치(destination.index)에 추가한다.
  // x.splice(0, 1) -> index 0으로 가서 1개의 요소를 삭제
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, source } = info;
    if (!destination) return; // 드래그했다가 다시 제자리에 놓으면 걍 리턴한다.

    // 태스크 순서 변경(보드 내)
    if (destination.droppableId === source.droppableId) {
      // 1.수정이 일어난 보드[]만 복사한다. (allBoards객체 안의 source.droppableId를 가져온다.) (droppableId는 Doing이나 Done같은거임)
      // 2.그 복사본을 기존 보드들 옆에 붙여준다.
      setBoards((allBoards) => {
        const boardsCopy = [...allBoards];
        const boardIndex = boardsCopy.findIndex(
          ({ title }) => title === source.droppableId
        );
        const boardCopy = { ...boardsCopy[boardIndex] };
        const listCopy = [...boardCopy.toDos];
        const prevToDo = boardCopy.toDos[source.index];

        listCopy.splice(source.index, 1);
        listCopy.splice(destination.index, 0, prevToDo);

        boardCopy.toDos = listCopy;
        boardsCopy.splice(boardIndex, 1, boardCopy);
        localStorage.setItem("allBoards", JSON.stringify(boardsCopy));
        return boardsCopy;

        // const boardCopy = [...allBoards[source.droppableId]];
        // const taskObj = boardCopy[source.index];
        // // 내가 옮기려는 toDo object. obj를 지워버려서 원하는 참조값을 없애면 안되니깐 지우기전애 먼저 잡아놓은거임.
        // boardCopy.splice(source.index, 1);
        // boardCopy.splice(destination?.index, 0, taskObj);
        // const newAllBoards = {
        //   ...allBoards, // 기존 보드들
        //   [source.droppableId]: boardCopy, // 변형된 복사본
        // };
        // localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
        // return newAllBoards;
        // 객체 안에서 키 값이 중복된 프로퍼티는 마지막에 선언된 프로퍼티를 사용하기 때문에 저렇게 넣어줘도 상관없는 것임.
        // key값에 변수값을 넣으려면 대괄호[]를 써야함. (ES6: Computed property name)
      });
    }

    // 태스크 순서 변경(보드 간)
    if (destination?.droppableId !== source.droppableId) {
      // 1. 움직임이 시작된 보드, 움직임이 끝난 보드를 각각 복사
      // 2. sourceBoard에서 draggableId을 삭제, targetBoard에는 draggableId을 추가
      setBoards((allBoards) => {
        const boardsCopy = [...allBoards];
        const sourceBoardIndex = boardsCopy.findIndex(
          ({ title }) => title === source.droppableId
        );
        const destinationBoardIndex = boardsCopy.findIndex(
          ({ title }) => title === destination.droppableId
        );

        const sourceBoardCopy = { ...boardsCopy[sourceBoardIndex] };
        const destinationBoardCopy = { ...boardsCopy[destinationBoardIndex] };

        const sourceListCopy = [...sourceBoardCopy.toDos];
        const destinationListCopy = [...destinationBoardCopy.toDos];

        const prevToDo = sourceBoardCopy.toDos[source.index];

        sourceListCopy.splice(source.index, 1);
        destinationListCopy.splice(destination.index, 0, prevToDo);

        sourceBoardCopy.toDos = sourceListCopy;
        destinationBoardCopy.toDos = destinationListCopy;

        boardsCopy.splice(sourceBoardIndex, 1, sourceBoardCopy);
        boardsCopy.splice(destinationBoardIndex, 1, destinationBoardCopy);

        localStorage.setItem("allBoards", JSON.stringify(boardsCopy));
        return boardsCopy;

        //       const sourceBoard = [...allBoards[source.droppableId]];
        //       const taskObj = sourceBoard[source.index];
        //       const destinationBoard = [...allBoards[destination.droppableId]];
        //       sourceBoard.splice(source.index, 1);
        //       destinationBoard.splice(destination?.index, 0, taskObj);
        //       const newAllBoards = {
        //         ...allBoards,
        //         [source.droppableId]: sourceBoard,
        //         [destination.droppableId]: destinationBoard,
        //       };
        //       localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
        //       return newAllBoards;
      });
    }
  };
  console.log("boards", boards);

  return (
    <>
      <Header>
        <Title>TO DO LIST</Title>
        <Btn onClick={onCreateBoard}>
          <Add />
        </Btn>
      </Header>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boardsArea" direction="horizontal" type="board">
          {(provided, snapshot) => (
            <BoardsWrapper ref={provided.innerRef} {...provided.droppableProps}>
              {/* Object.keys()는 object가 가진 key만 array로 뽑아줌 */}
              {/* {Object.keys(toDos).map((boardId, index) => ( */}
              {boards.map((board, index) => (
                <Draggable
                  key={board.id}
                  draggableId={`board-${board.id}`}
                  index={index}
                >
                  {/* draggableId는 string이어야함 */}
                  {(provided, snapshot) => (
                    <BoardWrapper
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <Board
                        key={board.id}
                        boardTitle={board.title}
                        boardId={board.id}
                        boardToDos={board.toDos}
                      />
                    </BoardWrapper>
                  )}
                </Draggable>
              ))}
            </BoardsWrapper>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default App;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 120px;
  padding: 40px 48px;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 600;
`;

const Btn = styled.button`
  svg {
    width: 40px;
    height: 40px;
    fill: ${(props) => props.theme.gray3};
    &:hover,
    &:focus {
      fill: ${(props) => props.theme.accentColor};
    }
  }
`;

const Container = styled.div`
  /* display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh; */
`;

const BoardsWrapper = styled.div`
  /* display: grid;
  display: flex;
  justify-content: center;
  align-items: flex-start; // ?
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr); */
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  min-width: calc(100vw - 64px);
  /* height: calc(100vh - 160px); */
  margin: 0 48px 48px 48px;
`;

const BoardWrapper = styled.div``;
