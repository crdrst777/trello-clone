import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function App() {
  // onDragEnd함수는 드래그를 끝낸 시점에 불려진다.
  const onDragEnd = () => {};

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          <Droppable droppableId="one">
            {() => (
              <ul>
                <Draggable draggableId="first" index={0}>
                  {() => <li>One</li>}
                </Draggable>
                <Draggable draggableId="second" index={1}>
                  {() => <li>Two</li>}
                </Draggable>
              </ul>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
}

export default App;
