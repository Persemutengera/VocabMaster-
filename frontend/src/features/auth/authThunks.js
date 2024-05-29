import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { removeAuthToken, storeAuthToken } from "../../helpers/tokenStorage";
import { storeUserInfo } from "../../helpers/userInfoStorage";
import { API_BASE_URL } from "../../constants/baseUrl";

const LOGIN_URL = `${API_BASE_URL}/auth/login`;
const REGISTER_URL = `${API_BASE_URL}/auth/register`;

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(LOGIN_URL, credentials);
      const { token, user } = response.data;

      user.email = credentials.email;
      user.password = credentials.password;

      await storeAuthToken(token);
      await storeUserInfo(user);

      return { token, user };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(REGISTER_URL, userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const clearAsyncStorage = createAsyncThunk(
  "auth/clearAsyncStorage",
  async (_, thunkAPI) => {
    try {
      await removeAuthToken();
      await storeUserInfo();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
