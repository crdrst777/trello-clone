import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atom";
import Board from "./components/Board";

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  // onDragEnd함수는 드래그를 끝낸 시점에 불려진다.
  // 원래 있던 위치(source.index)에서 지우고, 이동한 위치(destination.index)에 추가한다.
  // x.splice(0, 1) -> index 0으로 가서 1개의 요소를 삭제
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { draggableId, destination, source } = info;
    if (!destination) return; // 드래그했다가 다시 제자리에 놓으면 걍 리턴한다.

    // 동일한 보드 안에서 움직이는 경우
    if (destination?.droppableId === source.droppableId) {
      // 1.수정이 일어난 보드[]만 복사한다. (allBoards객체 안의 source.droppableId를 가져온다.) (droppableId는 Doing이나 Done같은거임)
      // 2.그 복사본을 기존 보드들 옆에 붙여준다.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards, // 기존 보드들
          [source.droppableId]: boardCopy, // 변형된 복사본
        };
        // 객체 안에서 키 값이 중복된 프로퍼티는 마지막에 선언된 프로퍼티를 사용하기 때문에 저렇게 넣어줘도 상관없는 것임.
        // key값에 변수값을 넣으려면 대괄호[]를 써야함. (ES6: Computed property name)
      });
    }

    // 다른 보드를 넘나들며 움직이는 경우
    if (destination?.droppableId !== source.droppableId) {
      // 1. 움직임이 시작된 보드, 움직임이 끝난 보드를 각각 복사
      // 2. sourceBoard에서 draggableId을 삭제, targetBoard에는 draggableId을 추가
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {/* Object.keys()는 object가 가진 key만 array로 뽑아줌 */}
            {Object.keys(toDos).map((boardId) => (
              <Board key={boardId} boardId={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  display: flex;
  justify-content: center;
  align-items: flex-start; // ?
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;
