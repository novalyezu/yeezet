import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage
} from "react-native";
import { Text, Container, Content, Header, Button } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import { connect } from "react-redux";

class CheckAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressData: [],
      addOp: addressOption,
      mainAdd: 0
    };
  }

  componentDidMount() {
    this.getMainAdd();
  }

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
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack();
    } catch (error) {
      console.log("error sin :v " + error);
    }
  };

  editAddress = data => () => {
    this.props.navigation.navigate("EditAddress", { data, dari: "CAcc" });
  };

  render() {
    return (
      <Container>
        <Content>
          <ScrollView>
            <View>
              <View style={styles.viewAlamat}>
                <Text style={styles.headerAlamat}>Address Setting</Text>
                <Button
                  info
                  onPress={() =>
                    this.props.navigation.navigate("AddAddress", {
                      dari: "CAcc"
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
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    address: state.address
  };
};

export default connect(mapStateToProps)(CheckAccount);

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center"
  },
  profile: {
    height: 40,
    width: 40,
    position: "absolute",
    top: 80,
    left: 30
  },
  name: {
    color: "#fff",
    position: "absolute",
    top: 90,
    left: 80
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
