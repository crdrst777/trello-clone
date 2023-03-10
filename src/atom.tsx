import { atom } from "recoil";

export interface IToDo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: IToDo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [
      { id: 1, text: "hi" },
      { id: 2, text: "hello" },
    ],
    Doing: [],
    Done: [],
  },
});

// Done: [
//   {
//     id: 2;
//     text: “f”;
//   },
//   {
//     id: 3;
//     text: “dd”;
//   }
//   ]
