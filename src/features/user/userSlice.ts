// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;  // Chắc chắn rằng id có thể là null
  email: string | null;
  company_name?: string | null; // Thuộc tính tùy chọn
}

const initialState: UserState = {
  id: null,
  email: null,
  company_name: null, // Đảm bảo các thuộc tính có giá trị mặc định
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
