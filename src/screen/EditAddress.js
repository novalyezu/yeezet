import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
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
import { updateAddress } from "../publics/redux/actions/address";

class EditAddress extends Component {
  constructor(props) {
    super(props);
    this.param = this.props.navigation.getParam("data");

    this.state = {
      addressData: address,
      prov: this.param.province,
      dist: this.param.district,
      subDist: this.param.sub_district,
      provOp: addressOption,
      distOp: [],
      distOpKosong: false,
      subDistOp: [],
      id: this.param.id,
      label: this.param.label,
      name: this.param.name,
      phone: this.param.phone,
      province: this.param.province,
      district: this.param.district,
      subDistrict: this.param.sub_district,
      postalCode: this.param.postal_code,
      fullAddress: this.param.full_address
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.getDistrict();
    }, 1000);
  }

  getDistrict = () => {
    if (this.state.dist !== null) {
      var getDist = this.state.provOp.filter(el => {
        return el.id == this.state.province;
      });
      this.setState({
        distOp: getDist[0].district,
        distOpKosong: false
      });
    } else {
      this.setState({
        distOpKosong: false
      });
    }
    this.getSubDistrict();
  };

  getSubDistrict = () => {
    if (this.state.subDist !== null) {
      var getDist = this.state.distOp.filter(el => {
        return el.id == this.state.dist;
      });
      this.setState({
        subDistOp: getDist[0].sub_district
      });
    } else {
      this.setState({
        subDistOp: []
      });
    }
  };

  onProvChange = value => {
    if (value != 0) {
      var getDist = this.state.provOp.filter(el => {
        return el.id == value;
      });
      this.setState({
        prov: value,
        distOp: getDist[0].district,
        province: getDist[0].id
      });
    } else {
      this.setState({
        prov: value,
        distOp: [],
        province: ""
      });
    }
  };

  onDistChange = value => {
    if (value != 0) {
      var getSubDist = this.state.distOp.filter(el => {
        return el.id == value;
      });

      this.setState({
        dist: value,
        subDistOp: getSubDist[0].sub_district,
        district: getSubDist[0].id
      });
    } else {
      this.setState({
        dist: value,
        subDistOp: [],
        district: ""
      });
    }
  };

  onSubDistChange = value => {
    if (value != 0) {
      var getSubDist = this.state.subDistOp.filter(el => {
        return el.id == value;
      });

      this.setState({
        subDist: value,
        subDistrict: getSubDist[0].id
      });
    } else {
      this.setState({
        subDist: value,
        subDistrict: ""
      });
    }
  };

  saveAddress = async () => {
    const id = this.param.id;
    const token = this.props.auth.access_token.token;
    var body = {
      label: this.state.label,
      name: this.state.name,
      phone: this.state.phone,
      province: this.state.province,
      district: this.state.district,
      sub_district: this.state.subDistrict,
      postal_code: this.state.postalCode,
      full_address: this.state.fullAddress
    };

    await this.props.dispatch(updateAddress(id, token, body));
  };

  handleSaveAddress = () => {
    this.saveAddress()
      .then(res => {
        let balikKe = this.props.navigation.getParam("dari");
        if (balikKe === "Acc") {
          this.props.navigation.navigate("Account");
        } else {
          this.props.navigation.navigate("CheckoutAccount");
        }
      })
      .catch(err => {
        console.log("error :v SA " + err);
      });
  };

  render() {
    if (this.state.distOpKosong == true) {
      return (
        <View>
          <Text style={{ alignSelf: "center" }}>Loading...</Text>
        </View>
      );
    } else {
      return (
        <Container style={{ marginLeft: 10, marginTop: 10, marginRight: 10 }}>
          <Content>
            <Form>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Address Label</Text>
                <Item regular style={styles.input}>
                  <Input
                    placeholder="Label"
                    onChangeText={text => this.setState({ label: text })}
                    value={this.state.label}
                  />
                </Item>
              </View>
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
                <Text style={{ fontWeight: "bold" }}>Phone Number</Text>
                <Item regular style={styles.input}>
                  <Input
                    placeholder="Phone"
                    keyboardType="numeric"
                    onChangeText={text => this.setState({ phone: text })}
                    value={this.state.phone}
                  />
                </Item>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Province</Text>
                <Item regular style={styles.input}>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Ionicons name="ios-arrow-down" />}
                    placeholder="Select your Province"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    style={{ width: undefined }}
                    selectedValue={this.state.prov}
                    onValueChange={this.onProvChange.bind(this)}
                  >
                    <Picker.Item label="Select Province" value="0" />
                    {this.state.provOp.map(data => (
                      <Picker.Item
                        label={data.province}
                        value={data.id}
                        key={data.id}
                      />
                    ))}
                  </Picker>
                </Item>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>District</Text>
                <Item regular style={styles.input}>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Ionicons name="ios-arrow-down" />}
                    placeholder="Select your District"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    style={{ width: undefined }}
                    selectedValue={this.state.dist}
                    onValueChange={this.onDistChange.bind(this)}
                  >
                    <Picker.Item label="Select Distric" value="0" />
                    {this.state.distOp.map(data => (
                      <Picker.Item
                        label={data.district_name}
                        value={data.id}
                        key={data.id}
                      />
                    ))}
                  </Picker>
                </Item>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Sub-District</Text>
                <Item regular style={styles.input}>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Ionicons name="ios-arrow-down" />}
                    placeholder="Select your Sub-District"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    style={{ width: undefined }}
                    selectedValue={this.state.subDist}
                    onValueChange={this.onSubDistChange.bind(this)}
                  >
                    <Picker.Item label="Select Sub-Distric" value="0" />
                    {this.state.subDistOp.map(data => (
                      <Picker.Item
                        label={data.sub_district_name}
                        value={data.id}
                        key={data.id}
                      />
                    ))}
                  </Picker>
                </Item>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Postal Code</Text>
                <Item regular style={styles.input}>
                  <Input
                    placeholder="Code"
                    keyboardType="numeric"
                    onChangeText={text => this.setState({ postalCode: text })}
                    value={this.state.postalCode}
                  />
                </Item>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Full Address</Text>
                <Textarea
                  placeholder="Address"
                  rowSpan={3}
                  style={styles.input}
                  onChangeText={text => this.setState({ fullAddress: text })}
                  value={this.state.fullAddress}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Button block info onPress={this.handleSaveAddress}>
                  <Text>Save</Text>
                </Button>
              </View>
            </Form>
          </Content>
        </Container>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(EditAddress);

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#e5e5e5",
    borderRadius: 5
  }
});
