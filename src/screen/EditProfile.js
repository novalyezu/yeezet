import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, AsyncStorage } from "react-native";
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
import DateTimePicker from "react-native-modal-datetime-picker";
import Momen from "moment";
import { connect } from "react-redux";
import { updateProfile } from "../publics/redux/actions/profile";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.param = this.props.navigation.getParam("prof");
    this.dateNow = new Date();
    this.state = {
      isDateTimePickerVisible: false,
      user_id: "",
      name: "",
      birth_date: Momen(this.dateNow).format("YYYY-MM-DD"),
      gender: ""
    };
  }

  componentDidMount() {
    if (Object.keys(this.param).length > 0) {
      this.setState({
        user_id: this.param.user_id,
        name: this.param.name,
        birth_date: Momen(this.param.birth_date).format("YYYY-MM-DD"),
        gender: this.param.gender
      });
    }
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    this.setState({
      birth_date: Momen(date).format("YYYY-MM-DD")
    });
    this._hideDateTimePicker();
  };

  saveProfile = () => {
    const token = this.props.auth.access_token.token;
    let body = {
      user_id: this.props.auth.data.id,
      name: this.state.name,
      birth_date: this.state.birth_date,
      gender: this.state.gender
    };
    this.props.dispatch(updateProfile(body, token));
    this.props.navigation.navigate("Account");
  };

  // handleSaveProfile = () => {
  //   this.saveProfile()
  //     .then(res => {

  //     })
  //     .catch(err => {
  //       console.log("error :v SP " + err);
  //     });
  // };

  render() {
    return (
      <Container style={{ marginLeft: 10, marginTop: 10, marginRight: 10 }}>
        <Content>
          <Form>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Name</Text>
              <Item regular style={styles.input}>
                <Input
                  placeholder="Name"
                  onChangeText={text => this.setState({ name: text })}
                  value={this.state.name}
                />
              </Item>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Birth Date</Text>
              <TouchableOpacity onPress={this._showDateTimePicker}>
                <View style={[styles.input, { height: 50, borderWidth: 0.1 }]}>
                  <Text style={{ marginLeft: 8, marginTop: 13 }}>
                    {this.state.birth_date}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Gender</Text>
              <Item regular style={styles.input}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Ionicons name="ios-arrow-down" />}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  style={{ width: undefined }}
                  selectedValue={this.state.gender}
                  onValueChange={text =>
                    this.setState({
                      gender: text
                    })
                  }
                >
                  <Picker.Item label="Laki-Laki" value="Laki-Laki" />
                  <Picker.Item label="Perempuan" value="Perempuan" />
                </Picker>
              </Item>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Button block info onPress={this.saveProfile}>
                <Text>Save</Text>
              </Button>
            </View>
          </Form>
        </Content>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          date={new Date(this.state.birth_date)}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(EditProfile);

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#e5e5e5",
    borderRadius: 5
  }
});
