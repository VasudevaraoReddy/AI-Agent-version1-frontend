import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: {
    formSubmitted: false,
    values: {},
  },
  reducers: {
    setFieldValue: (state, action) => {
      const { field, value } = action.payload;
      state.values[field] = value;
    },
    setFormData: (state, action) => {
      state.values = { ...action.payload };
    },
    resetForm: (state) => {
      state.values = {};
    },
    setFormSubmitted: (state , action) => {
        state.formSubmitted = action.payload
    }
  },
});

export const { setFieldValue, setFormData, resetForm, setFormSubmitted } = formSlice.actions;

export default formSlice.reducer;
