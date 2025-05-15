import { configureStore } from '@reduxjs/toolkit'
import formReducer from '../features/form/formSlice.js'
import conversationReducer from '../features/conversations/conversationsSlice.js'

export const store = configureStore({
  reducer: {
    formData: formReducer,
    conversationState: conversationReducer, 
  },
})