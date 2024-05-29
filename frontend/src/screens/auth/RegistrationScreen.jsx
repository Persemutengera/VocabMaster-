import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import colors from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authThunks";
import { clearError, clearSuccess } from "../../features/auth/authSlice";
const RegistrationScreen = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const { loading, regError, registrationSuccess } = useSelector(
    (state) => state.auth
  );

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (registrationSuccess) {
      setModalVisible(true);
    }
  }, [registrationSuccess]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration = () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{
          backgroundColor: "#ffffff",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/undraw-adventure-map-hnin-21.png")}
        />
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subTitle}>by creating a free account </Text>

        {regError && Array.isArray(regError) && regError.length > 0 && (
          <View style={styles.messageContainer}>
            {regError.map((errorMessage, index) => (
              <Text key={index} style={styles.errorMessage}>
                {errorMessage}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.SectionStyle}>
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Image
            source={require("../../assets/user.png")}
            style={styles.ImageStyle}
          />
        </View>

        <View style={styles.SectionStyle}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Image
            source={require("../../assets/mail.png")}
            style={styles.ImageStyle}
          />
        </View>

        <View style={styles.SectionStyle}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
          <Image
            source={require("../../assets/lock.png")}
            style={styles.ImageStyle}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.registrationButton,
            loading && styles.registrationButtonDisabled,
          ]}
          onPress={handleRegistration}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.registrationButtonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registrationLink}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.registrationText}>Already a member? </Text>
          <Text style={styles.registrationLinkText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Your account has been created successfully
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  dispatch(clearSuccess());
                  dispatch(clearError());
                  navigation.navigate("Login");
                }}
              >
                <Text style={styles.textStyle}>Login Now</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  tinyLogo: {
    marginTop: 10,
    alignSelf: "center",
    width: 300,
    height: 200,
    borderRadius: 7,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: colors.primary,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    marginTop: -10,
    marginBottom: 20,
    color: "#252525",
  },
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    height: 50,
    borderRadius: 8,
    margin: 10,
    padding: 10,
  },
  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "stretch",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  registrationButton: {
    width: "100%",
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  registrationButtonDisabled: {
    opacity: 0.5,
  },
  registrationButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingIndicator: {
    position: "absolute",
    alignSelf: "center",
  },
  registrationLink: {
    marginTop: 5,
    flexDirection: "row",
  },
  registrationText: {
    color: colors.gray,
  },

  registrationLinkText: {
    color: colors.primary,
  },

  messageContainer: {
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    padding: 10,
    width: "100%",
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
  },
});

export default RegistrationScreen;
