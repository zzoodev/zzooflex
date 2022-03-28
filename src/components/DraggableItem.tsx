import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import React from "react";

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) => (props.isDragging ? "#81ecec" : "white")};
  padding: 10px 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? "10px 5px 5px rgba(0,0,0,0.3)" : "none"};
`;

interface IDraggableItem {
  todo: string;
  index: number;
}

function DraggableItem({ todo, index }: IDraggableItem) {
  return (
    <Draggable draggableId={todo} index={index} key={todo}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {todo}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableItem);
