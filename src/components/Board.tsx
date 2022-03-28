import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableItem from "./DraggableItem";
import { Itodo, todosAtom } from "../atoms";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import React from "react";

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
const Form = styled.form`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 10px 0px;
`;
const Input = styled.input`
  width: 85%;
`;

interface IBoardProps {
  todos: Itodo[];
  boardId: string;
}

function Board({ todos, boardId }: IBoardProps) {
  const { register, handleSubmit, setValue } = useForm();
  const [todoState, setTodo] = useRecoilState(todosAtom);

  const onSubmit = handleSubmit((data) => {
    const newData = {
      text: data[boardId],
      id: Date.now(),
    };
    setTodo((oldTodos) => {
      return { ...oldTodos, [boardId]: [...oldTodos[boardId], newData] };
    });
    setValue(boardId, "");
  });

  const jsonData = JSON.stringify(todoState);
  localStorage.setItem("todoData", jsonData);

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
          <Form onSubmit={onSubmit}>
            <Input
              type="text"
              {...register(boardId)}
              placeholder={`add to ${boardId}`}
            />
            <button>Add</button>
          </Form>
          {todos.map((todo, index) => (
            <DraggableItem todo={todo.text} index={index} key={index} />
          ))}
          {magic.placeholder}
        </BoardArea>
      )}
    </Droppable>
  );
}

export default React.memo(Board);
