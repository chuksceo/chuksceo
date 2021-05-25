import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: JSON.parse(window.localStorage.getItem('user')),
  },
  reducers: {
    login:(state,action)=>{
      state.value=action.payload;
      const data=JSON.stringify(action.payload);
      window.localStorage.setItem('user',data);

    },

    logout:(state)=>{
      state.value=null;
      window.localStorage.setItem('user',null);
    }

  }
});

export const { login, logout } = userSlice.actions;
export const userEmail=(state)=>state.user.value
export default userSlice.reducer;