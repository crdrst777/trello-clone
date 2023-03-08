import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atom";
import DraggableCard from "./components/DraggableCard";

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  // onDragEnd함수는 드래그를 끝낸 시점에 불려진다.
  // 원래 있던 위치(source.index)에서 지우고, 이동한 위치(destination.index)에 추가한다.
  // x.splice(0, 1) -> index 0으로 가서 1개의 요소를 삭제
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    if (!destination) return; // 드래그했다가 다시 제자리에 놓으면 걍 리턴한다.
    setToDos((oldToDos) => {
      const copyToDos = [...oldToDos];
      copyToDos.splice(source.index, 1);
      copyToDos.splice(destination?.index, 0, draggableId);
      return copyToDos;
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            <Droppable droppableId="one">
              {(magic) => (
                <Board ref={magic.innerRef} {...magic.droppableProps}>
                  {toDos.map((toDo, index) => (
                    <DraggableCard key={toDo} toDo={toDo} index={index} />
                  ))}
                  {magic.placeholder}
                  {/* Draggable 엘리먼트를 드래그하는 동안 position: fixed(영역을 고정시킴)를 적용함. (Droppable 리스트가 작아지는 것을 방지) */}
                </Board>
              )}
            </Droppable>
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;

const Wrapper = styled.div`
  display: flex;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* background-color: beige; */
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(1, 1fr);
`;

const Board = styled.div`
  padding: 30px 10px 20px 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
`;
