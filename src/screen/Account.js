import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  AsyncStorage,
  Alert
} from "react-native";
import { Text, Container, Content, Header, Button } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";

import { NavigationEvents } from "react-navigation";

import Login from "./Login";
import { logout } from "../publics/redux/actions/auth";
import { getFullProfile } from "../publics/redux/actions/profile";
import { getAddress } from "../publics/redux/actions/address";
import { emptyCart } from "../publics/redux/actions/carts";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressData: [],
      addOp: addressOption,
      mainAdd: 0,
      isAuth: false
    };
    this.refreshScreen = this.refreshScreen.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuth) {
      this.getMainAdd();
      this.getFullProfile();
      this.getAddress();
    }
  }

  getFullProfile = async () => {
    const user_id = this.props.auth.data.id;
    const token = this.props.auth.access_token.token;
    await this.props.dispatch(getFullProfile(user_id, token));
  };

  getAddress = async () => {
    const user_id = this.props.auth.data.id;
    const token = this.props.auth.access_token.token;
    await this.props.dispatch(getAddress(user_id, token));
  };

  getMainAdd = async () => {
    let main = await AsyncStorage.getItem("mainAdd");
    this.setState({
      mainAdd: main
    });
  };

  setSelected = id => async () => {
    this.setState({
      mainAdd: id
    });
    try {
      await AsyncStorage.setItem("mainAdd", id.toString());
    } catch (error) {
      console.log("error sin :v " + error);
    }
  };

  editAddress = data => () => {
    this.props.navigation.navigate("EditAddress", { data, dari: "Acc" });
  };

  editProfile = () => {
    const prof = this.props.profile.data;
    this.props.navigation.navigate("EditProfile", { prof });
  };

  refreshScreen() {
    this.setState({ isAuth: this.props.auth.isAuth });
    if (!this.state.isAuth) {
      this.getAddress()
        .then(res => {
          this.setState({
            addressData: this.props.address.data
          });
        })
        .catch(err => {});
      this.getFullProfile()
        .then(res => {})
        .catch(err => {});
    }
  }

  handleLogout = () => {
    Alert.alert("Warning", "Are you sure want to logout ?", [
      { text: "No" },
      {
        text: "Yes",
        style: "cancel",
        onPress: () => {
          this.doLogout()
            .then(res => {
              this.props.dispatch(emptyCart());
              AsyncStorage.removeItem("token");
              AsyncStorage.removeItem("refreshToken");
              this.props.navigation.navigate("Home");
            })
            .catch(err => {
              console.log("error :v Logut " + err);
            });
        }
      }
    ]);
  };

  doLogout = async () => {
    const token = this.props.auth.access_token.token;
    await this.props.dispatch(logout(token));
  };

  render() {
    let profile_name = this.props.auth.data.username;
    if (this.props.profile.data.length > 0) {
      profile_name = this.props.profile.data.name;
    }
    return (
      <Container>
        <NavigationEvents
          onWillFocus={payload => {
            this.refreshScreen();
          }}
        />
        <Header style={{ backgroundColor: "#fff" }}>
          <Text style={styles.headerTitle}>Account</Text>
        </Header>
        <Content>
          {this.state.isAuth ? (
            <View>
              <View>
                <Image
                  source={require("../image/parallax.jpg")}
                  style={{ height: 150, width: null }}
                />
                <Image
                  source={require("../image/profile.png")}
                  style={styles.profile}
                />
                <TouchableOpacity
                  onPress={() => this.editProfile()}
                  style={{ position: "absolute", top: 80, left: 90 }}
                >
                  <Text style={styles.name}>{profile_name}</Text>
                  <Text style={styles.editprofile}>edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.handleLogout()}
                  style={{ position: "absolute", top: 20, right: 20 }}
                >
                  <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                <View>
                  <View style={styles.viewAlamat}>
                    <Text style={styles.headerAlamat}>Address Setting</Text>
                    <Button
                      info
                      onPress={() =>
                        this.props.navigation.navigate("AddAddress", {
                          dari: "Acc"
                        })
                      }
                    >
                      <Text>Add New</Text>
                    </Button>
                  </View>
                  {this.props.address.data.map((data, key) => {
                    return (
                      <View key={key}>
                        {data.id == this.state.mainAdd ? (
                          <View style={styles.alamat}>
                            <TouchableOpacity style={styles.btn}>
                              <Image
                                style={styles.img}
                                source={require("../image/rb_select.png")}
                              />
                              <Text style={styles.label}>{data.label}</Text>
                            </TouchableOpacity>
                            <View style={styles.garis}>
                              <Text style={styles.nameAdd}>{data.name}</Text>
                              <Text>{data.full_address}</Text>
                              <Button
                                style={styles.edit}
                                onPress={this.editAddress(data)}
                              >
                                <Ionicons
                                  name="ios-create"
                                  size={25}
                                  color="#212121"
                                />
                                <Text style={styles.textEdit}>Edit</Text>
                              </Button>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.alamat}>
                            <TouchableOpacity
                              onPress={this.setSelected(data.id)}
                              style={styles.btn}
                            >
                              <Image
                                style={styles.img}
                                source={require("../image/rb_unselect.png")}
                              />
                              <Text style={styles.label}>{data.label}</Text>
                            </TouchableOpacity>
                            <View style={styles.garis}>
                              <Text style={styles.nameAdd}>{data.name}</Text>
                              <Text>{data.full_address}</Text>
                              <Button
                                style={styles.edit}
                                onPress={this.editAddress(data)}
                              >
                                <Ionicons
                                  name="ios-create"
                                  size={25}
                                  color="#212121"
                                />
                                <Text style={styles.textEdit}>Edit</Text>
                              </Button>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ) : (
            <Login move={this.props} />
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profile: state.profile,
    address: state.address
  };
};

export default connect(mapStateToProps)(Account);

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center"
  },
  profile: {
    height: 45,
    width: 45,
    position: "absolute",
    top: 80,
    left: 30
  },
  name: {
    color: "#fff",
    fontSize: 18
  },
  logout: {
    color: "#fff",
    textDecorationLine: "underline"
  },
  editprofile: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline"
  },
  viewAlamat: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  headerAlamat: {
    fontFamily: "Verdana",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10
  },
  img: {
    height: 20,
    width: 20
  },
  btn: {
    flexDirection: "row"
  },
  alamat: {
    marginLeft: 10,
    marginTop: 20,
    marginRight: 10
  },
  label: {
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 18,
    marginTop: -3
  },
  nameAdd: {
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "bold"
  },
  garis: {
    borderBottomWidth: 1,
    marginLeft: 30,
    borderBottomColor: "gray"
  },
  edit: {
    backgroundColor: "#d8d8d8",
    borderWidth: 1,
    borderColor: "gray",
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 10
  },
  textEdit: {
    color: "#212121"
  }
});
