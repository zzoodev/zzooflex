import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableItem from "./DraggableItem";

interface IBoardArea {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const BoardArea = styled.article<IBoardArea>`
  display: flex;
  flex-direction: column;
  width: 300px;
  min-height: 400px;
  max-height: max-content;
  padding: 20px 10px;
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#34495e"
      : props.draggingFromThisWith
      ? "#b2bec3"
      : props.theme.boardColor};
  border-radius: 10px;
  transition: background-color 0.2s linear;
`;
const Header = styled.h1`
  text-align: center;
  margin-bottom: 15px;
`;

interface IBoardProps {
  todos: string[];
  boardId: string;
}

function Board({ todos, boardId }: IBoardProps) {
  return (
    <Droppable droppableId={boardId}>
      {(magic, snapshot) => (
        <BoardArea
          isDraggingOver={snapshot.isDraggingOver}
          draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
          {...magic.droppableProps}
          ref={magic.innerRef}
        >
          <Header>{boardId.toUpperCase()}</Header>
          {todos.map((todo, index) => (
            <DraggableItem todo={todo} index={index} key={index} />
          ))}
          {magic.placeholder}
        </BoardArea>
      )}
    </Droppable>
  );
}

export default Board;
