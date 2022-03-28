import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { todosAtom } from "../atoms";
import { useRecoilState } from "recoil";
import Board from "./Board";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.bgColor};
`;
const Wrapper = styled.main`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  height: max-content;
  width: max-content;
`;

const DragAndDrap = function () {
  const [todos, setTodos] = useRecoilState(todosAtom);
  const onDragEnd = (event: DropResult) => {
    console.log(event);
    const { destination, draggableId, source } = event;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setTodos((allBoards) => {
        const targetBoard = [...allBoards[source.droppableId]];
        targetBoard.splice(source.index, 1);
        targetBoard.splice(destination?.index as number, 0, draggableId);

        return {
          ...allBoards,
          [source.droppableId]: targetBoard,
        };
      });
    }
    if (source.droppableId !== destination.droppableId) {
      setTodos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];

        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, draggableId);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          {Object.keys(todos).map((boardId) => (
            <Board
              boardId={boardId}
              key={boardId}
              todos={todos[boardId]}
            ></Board>
          ))}
        </Wrapper>
      </DragDropContext>
    </Container>
  );
};

export default DragAndDrap;
