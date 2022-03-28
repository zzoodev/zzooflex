import { atom } from "recoil";

interface ItodosAtom {
  [key: string]: string[];
}
export const todosAtom = atom<ItodosAtom>({
  key: "todos",
  default: {
    to_do: ["a", "b", "c"],
    doing: ["d", "e"],
    done: ["f", "g"],
  },
});
