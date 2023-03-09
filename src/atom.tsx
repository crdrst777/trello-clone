import { atom } from "recoil";

interface IToDoState {
  [key: string]: string[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": ["a", "b"],
    Doing: ["c", "d", "e"],
    Done: ["f"],
  },
});

// to_do: ["a", "b"],
// diing: ["c", "d", "e"],
// done: ["f"],
// 이렇게 지정해주면 유저가 보드를 더 추가했을시 에러남. 그래서 확장성을 위해 타입을 저렇게 만들었음.
