/// <reference types="vite/client" />

type CounterInitState = {
  counter: number,
  isRunning: boolean;
  activeRowId:string | null;
  user: User | null
}

type User = {
  id:string
  name: string;
  email: string;
  photo: string;
  tasks?: {
    id:string;
    title: string;
    clocking: number

  }[];
  totalClocking?:number
  isActive?:boolean;
  screenshots?:{
    url:string
  }
};


type UserReducerInitState = {
  loading: boolean,
  user: User | null
}

type TotalClockingInitState = {
  totalClocking: number
}

type TaskType = {
  id:string;
  title: string;
  clocking: number

}


type  DisplayMediaOptionsType = {
  video:boolean;
  audio:boolean;
}