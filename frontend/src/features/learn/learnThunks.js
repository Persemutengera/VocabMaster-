import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";

export const startLearning = createAsyncThunk(
  "learn/startLearning",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/learn/start");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchLessons = createAsyncThunk(
  "learn/fetchLessons",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/learn/get-lessons");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const startLesson = createAsyncThunk(
  "learn/startLesson",
  async (lessonId, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/learn/start-lesson", {
        lessonId,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getWords = createAsyncThunk(
  "learn/getWords",
  async (lessonTopic, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/learn/get-words/${lessonTopic}`
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const markWordAsLearned = createAsyncThunk(
  "learn/markWordAsLearned",
  async (data, thunkAPI) => {
    const { wordId, lessonTitle, isLearned, level } = data;

    try {
      const response = await axiosInstance.post("/learn/word-learned", {
        wordId,
        lessonTitle,
        isLearned,
        level,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const markLessonAsCompleted = createAsyncThunk(
  "learn/markLessonAsCompleted",
  async ({ lessonId, lessonNumber }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/learn/lesson-completed/${lessonId}/${lessonNumber}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
