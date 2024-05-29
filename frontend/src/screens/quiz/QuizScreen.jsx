import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { submitQuiz } from "../../features/quiz/quizThunks";
import LoadingScreen from "../shared/LoadingScreen";
import { useNavigation } from "@react-navigation/native";
import colors from "../../constants/colors";

const QuizScreen = () => {
  const navigator = useNavigation();
  const dispatch = useDispatch();
  const { quiz, isQuizSubmitting, quizSubmittingError } = useSelector(
    (state) => state.quiz
  );

  const { _id, questions, timeLimit } = quiz;

  const timeLimitInSeconds = timeLimit * 60;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [remainingTime, setRemainingTime] = useState(timeLimitInSeconds);
  const [answerSelected, setAnswerSelected] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const getOptionStyle = (
    userAnswer,
    correctAnswer,
    selectedAnswer,
    optionText
  ) => {
    if (optionText === correctAnswer && answerSelected) {
      return styles.correctOption; // Always return green background for correct answer
    } else if (userAnswer === selectedAnswer) {
      return styles.incorrectOption; // Show red background for selected incorrect answers
    }
    return styles.optionButton;
  };

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const selectAnswer = (selectedAnswer) => {
    if (!answerSelected) {
      // Check if an answer has already been selected
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestionIndex] = {
        questionId: currentQuestion._id,
        userAnswer: selectedAnswer,
      };
      setUserAnswers(updatedAnswers);
      setAnswerSelected(true); // Set answerSelected to true to disable further selections
    }
  };

  if (!quiz) {
    return <LoadingScreen />;
  }

  const handleFinishQuiz = async () => {
    // remove the undefined answers from the array
    const filteredAnswers = userAnswers.filter(
      (answer) => answer !== undefined
    );

    await dispatch(submitQuiz({ quizId: _id, userAnswers: filteredAnswers }));
    navigator.replace("QuizResult", { lessonTitle: quiz.lessonTitle });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswerSelected(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionCount}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <Text style={styles.question}>{currentQuestion.question}</Text>

        <TouchableOpacity
          style={[
            styles.optionButton,
            getOptionStyle(
              userAnswers[currentQuestionIndex]?.userAnswer,
              currentQuestion.answer,
              currentQuestion.answer,
              currentQuestion.answer
            ),
          ]}
          onPress={() => selectAnswer(currentQuestion.answer)}
        >
          <Text style={styles.optionText}>{currentQuestion.answer}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            getOptionStyle(
              userAnswers[currentQuestionIndex]?.userAnswer,
              currentQuestion.answer,
              currentQuestion.distractor1,
              currentQuestion.distractor1
            ),
          ]}
          onPress={() => selectAnswer(currentQuestion.distractor1)}
        >
          <Text style={styles.optionText}>{currentQuestion.distractor1}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            getOptionStyle(
              userAnswers[currentQuestionIndex]?.userAnswer,
              currentQuestion.answer,
              currentQuestion.distractor2,
              currentQuestion.distractor2
            ),
          ]}
          onPress={() => selectAnswer(currentQuestion.distractor2)}
        >
          <Text style={styles.optionText}>{currentQuestion.distractor2}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            getOptionStyle(
              userAnswers[currentQuestionIndex]?.userAnswer,
              currentQuestion.answer,
              currentQuestion.distractor3,
              currentQuestion.distractor3
            ),
          ]}
          onPress={() => selectAnswer(currentQuestion.distractor3)}
        >
          <Text style={styles.optionText}>{currentQuestion.distractor3}</Text>
        </TouchableOpacity>
      </View>
      {currentQuestionIndex !== questions.length - 1 ? (
        <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
          <Text style={styles.nextButtonText}>Next Question</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.nextButton} onPress={handleFinishQuiz}>
          <Text style={styles.nextButtonText}>
            {isQuizSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Finish Quiz"
            )}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.remainingTime}>
        Time Remaining: {formatTime(remainingTime)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  questionContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionCount: {
    fontSize: 18,
    marginBottom: 10,
    color: "#444",
  },
  question: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  optionButton: {
    backgroundColor: "#e3e3e3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  correctOption: {
    backgroundColor: "#4ade80",
  },
  incorrectOption: {
    backgroundColor: "#f87171",
  },
  remainingTime: {
    fontSize: 15,
    color: colors.black,
    marginTop: 20,
    fontWeight: "bold",
  },
  nextButton: {
    width: 120,
    height: 45,
    backgroundColor: "#3988FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginTop: 20,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default QuizScreen;
