import { PayloadAction } from "./../../node_modules/@reduxjs/toolkit/src/createAction";
import { IRepo } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface repoState {
  repos: IRepo[];
  loading: boolean;
  search: string;
  itemsPerPage: number;
}

const initialState: repoState = {
  repos: [],
  loading: false,
  search: "",
  itemsPerPage: 6,
};

export const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setRepos: (state, action: PayloadAction<IRepo[]>) => {
      state.repos = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
    },
    clearRepos: (state) => {
        state.repos = [];
    }
  },
});

export const {setSearch, setRepos, setLoading, clearRepos} = repoSlice.actions;
export default repoSlice.reducer;
