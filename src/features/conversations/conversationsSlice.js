import { createSlice } from '@reduxjs/toolkit';

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState: {
   messages: [],
   allConversations: [],
   csp: "",
   userID: ""
  },
  reducers: {
    setSelectedUserID: (state, action) => {
        state.userID = action.payload
    },
    setAllConversations: (state, action) => {
      state.allConversations = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setCSP: (state , action) => {
        state.csp = action.payload
    },
  },
});

export const { setAllConversations,setCSP,setMessages,setSelectedUserID } = conversationsSlice.actions;

export default conversationsSlice.reducer;
