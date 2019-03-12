import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
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
import { register } from "../publics/redux/actions/auth";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: ""
    };
  }

  doRegister = async () => {
    await this.props.dispatch(
      register({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      })
    );
  };

  handleRegister = () => {
    this.doRegister()
      .then(res => {
        const auth = this.props.auth;
        AsyncStorage.setItem("token", auth.access_token.token);
        AsyncStorage.setItem("refreshToken", auth.access_token.refreshToken);
        this.props.navigation.goBack();
        this.props.navigation.navigate("Home");
      })
      .catch(err => {
        console.log("error :v Register " + err);
      });
  };

  render() {
    return (
      <Container style={{ marginLeft: 10, marginTop: 10, marginRight: 10 }}>
        <Content>
          <Form>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Username</Text>
              <Item regular style={styles.input}>
                <Input
                  placeholder="Username"
                  onChangeText={text => this.setState({ username: text })}
                />
              </Item>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Email</Text>
              <Item regular style={styles.input}>
                <Input
                  placeholder="Email"
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
              <Button block info onPress={this.handleRegister}>
                <Text>REGISTER</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(Register);

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#e5e5e5",
    borderRadius: 5
  }
});
