import { atom } from "recoil";

export interface ICard {
  id: number;
  text: string;
}

export interface IBoard {
  id: number;
  title: string;
  toDos: ICard[];
}

// interface IToDoState {
//   [key: string]: IToDo[];
// }

export const boardState = atom<IBoard[]>({
  key: "borad",
  default: [
    {
      id: 0,
      title: "TO DO",
      toDos: [
        { id: 0, text: "빨래 널기" },
        { id: 1, text: "코로나 검사하기" },
        { id: 2, text: "책 읽기" },
        { id: 3, text: "마스크 사기" },
        { id: 4, text: "커피 마시기" },
        { id: 5, text: "설거지 하기" },
        { id: 6, text: "공부하기" },
        { id: 7, text: "운동하기" },
        { text: "이건 이름이 되게 긴데 마우스를 여기에도 올려보세요", id: 8 },
      ],
    },
    { id: 1, title: "DOING", toDos: [] },
    {
      id: 2,
      title: "DONE",
      toDos: [
        { id: 27, text: "은행 다녀오기" },
        { id: 28, text: "보드나 할 일을 추가해보세요!" },
      ],
    },
  ],
});

// export const toDoState = atom<IToDoState>({
//   key: "toDo",
//   default: {
//     "To Do": [
//       { id: 1, text: "hi" },
//       { id: 2, text: "hello" },
//     ],
//     Doing: [],
//     Done: [],
//   },
// });

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
