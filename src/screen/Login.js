import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import {
  Container,
  Text,
  Content,
  Form,
  Item,
  Picker,
  Input,
  Textarea,
  Button
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import { connect } from "react-redux";

import { login } from "../publics/redux/actions/auth";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: ""
    };
  }

  handleLogin = () => {
    this.doLogin()
      .then(res => {
        const auth = this.props.move.auth;
        AsyncStorage.setItem("token", auth.access_token.token);
        AsyncStorage.setItem("refreshToken", auth.access_token.refreshToken);
        this.props.move.navigation.navigate("Home");
      })
      .catch(err => {
        console.log("error login :v " + err);
        Alert.alert("Warning", "Email or password is wrong!");
      });
  };

  doLogin = async () => {
    await this.props.dispatch(
      login({
        email: this.state.email,
        password: this.state.password
      })
    );
  };

  goToRegister = () => {
    this.props.move.navigation.navigate("Register");
  };

  render() {
    return (
      <Container style={{ marginLeft: 10, marginTop: 10, marginRight: 10 }}>
        <Content>
          <Form>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Email</Text>
              <Item regular style={styles.input}>
                <Input
                  placeholder="Email"
                  autoFocus={true}
                  onChangeText={text => this.setState({ email: text })}
                />
              </Item>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Password</Text>
              <Item regular style={styles.input}>
                <Input
                  placeholder="Password"
                  onChangeText={text => this.setState({ password: text })}
                  secureTextEntry={true}
                />
              </Item>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Button block info onPress={this.handleLogin}>
                <Text>Login</Text>
              </Button>
              <TouchableOpacity onPress={() => this.goToRegister()}>
                <Text
                  style={{
                    alignSelf: "center",
                    textDecorationLine: "underline",
                    color: "blue",
                    marginTop: 10
                  }}
                >
                  Don't have an account? Register here.
                </Text>
              </TouchableOpacity>
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default connect()(Login);

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#e5e5e5",
    borderRadius: 5
  }
});
