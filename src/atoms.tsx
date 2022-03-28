import { atom } from "recoil";

export interface Itodo {
  text: string;
  id: number;
}
export interface ItodosAtom {
  [key: string]: Itodo[];
}
export const todosAtom = atom<ItodosAtom>({
  key: "todos",
  default: {
    to_do: [],
    doing: [],
    done: [],
  },
});
