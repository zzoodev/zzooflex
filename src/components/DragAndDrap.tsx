import styled from "styled-components";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
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
const Trash = styled.div`
  width: 300px;
  height: 100px;
  background-color: #333;
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%);
`;

const DragAndDrap = function () {
  const [todos, setTodos] = useRecoilState(todosAtom);
  const jsonData = JSON.stringify(todos);
  localStorage.setItem("todoData", jsonData);

  const onDragEnd = (event: DropResult) => {
    const { destination, source } = event;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setTodos((allBoards) => {
        const targetBoard = [...allBoards[source.droppableId]];
        const grapItem = targetBoard[source.index];
        targetBoard.splice(source.index, 1);
        targetBoard.splice(destination?.index as number, 0, grapItem);
        return {
          ...allBoards,
          [source.droppableId]: targetBoard,
        };
      });
    }
    if (destination.droppableId === "trash") {
      console.log(event);
      setTodos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        sourceBoard.splice(source.index, 1);
        return { ...allBoards, [source.droppableId]: [...sourceBoard] };
      });
      return;
    }
    if (source.droppableId !== destination.droppableId) {
      setTodos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];
        const grapItem = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, grapItem);
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
        <Droppable droppableId="trash">
          {(provided) => (
            <Trash ref={provided.innerRef}>{provided.placeholder}</Trash>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default DragAndDrap;
