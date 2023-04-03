import { SafeAreaView, Text, View, Button, TextInput, ScrollView, Alert, Modal, TouchableOpacity, Image } from "react-native";
import { Component, useState, useEffect } from "react";
import tailwind from "tailwind-rn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

const serial = require('generate-serial-key');

export default class App extends Component {

  state = {
    new: "",
    search: "",
    modalVisible: false,
    modal2Visible: false,
    modal2AVisible: false,
    ref: "",
    name: "",
    company: "",
    position: "",
    address: "",
    cell: "",
    fax: "",
    email: "",
    cards: []
  }

  constructor(props) {
    super(props);
    this.getData();
  }

  store = async (newCard) => {
    try {
      if (this.state.cards.includes(newCard)) {
        Alert.alert("Card already exists");
      }
      else {
        this.setState({ cards: this.state.cards.concat(newCard) });
        await AsyncStorage.setItem('cards', JSON.stringify(this.state.cards));
        // AsyncStorage.getItem('cards').then((value) => {
        //   console.log(JSON.parse(value));
        // })
        // .catch((error) => {
        //   console.log(error);
        // })
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  onSubmit = async () => {
    this.setState({ modalVisible: !this.state.modalVisible })
    try {
      axios.get('http://10.0.2.2:8000/api/find?ref=' + this.state.new)
      .then((response) => {
        if (response.data == null) {
          Alert.alert("Card not found")
        }
        else {
          this.store(JSON.stringify(response.data));
        }
      }).catch((error) => {
        console.log(error);
      });
      // const modded = this.state.cards.concat(this.state.new);
      // this.setState({ cards: modded });
      // await AsyncStorage.setItem('cards', JSON.stringify(this.state.cards));
    }
    catch (error) {
      console.log(error);
    }
  }

  getData = async () => {
    try {
      const  value  = await AsyncStorage.getItem('cards');
      if (value !== null) {
        this.setState({ cards: JSON.parse(value) });
      }

      const ownValue = await AsyncStorage.getItem('self');
      if (ownValue !== null) {
        this.setState({ ref: JSON.parse(ownValue).ref });
        this.setState({ name: JSON.parse(ownValue).name });
        this.setState({ company: JSON.parse(ownValue).company });
        this.setState({ cell: JSON.parse(ownValue).cell });
        this.setState({ fax: JSON.parse(ownValue).fax });
        this.setState({ email: JSON.parse(ownValue).email });
        this.setState({ position: JSON.parse(ownValue).position });
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  delete = async (card) => {
    try {
      const modded = this.state.cards.filter((item) => item != card);
      this.setState({ cards: modded });
      await AsyncStorage.setItem('cards', JSON.stringify(this.state.cards));
    }
    catch (error) {
      console.log(error);
    }
  }

  clear = async () => {
    try {
      await AsyncStorage.clear();
      console.log("Cleared");
    }
    catch (error) {
      console.log(error);
    }
  }

  search = async () => {
    try {
      // let result = [];
      // this.state.cards.filter((item) => {
      //   item_parsed = JSON.parse(item);
      //   console.log(item.name);
      //   console.log(this.state.search);
      //   if (
      //     item_parsed.name.includes(this.state.search) || 
      //     item_parsed.company.includes(this.state.search) || 
      //     item_parsed.position.includes(this.state.search) || 
      //     item_parsed.address.includes(this.state.search) || 
      //     item_parsed.cell.toString().includes(this.state.search) || 
      //     item_parsed.fax.toString().includes(this.state.search) || 
      //     item_parsed.email.includes(this.state.search)) {
      //     result = result.concat(item);
      //   }
      // });
      // if (result.length == 0) {
      //   Alert.alert("Card not found");
      // }
      // else {
      //   console.log(result);
      //   Alert.alert(typeof result);
      // }
      let result = null;
      this.state.cards.filter((item) => {
        item_parsed = JSON.parse(item);
        console.log(item.name);
        console.log(this.state.search);
        if (
          item_parsed.name.includes(this.state.search) || 
          item_parsed.company.includes(this.state.search) || 
          item_parsed.position.includes(this.state.search) || 
          item_parsed.address.includes(this.state.search) || 
          item_parsed.cell.toString().includes(this.state.search) || 
          item_parsed.fax.toString().includes(this.state.search) || 
          item_parsed.email.includes(this.state.search)) {
          result = item;
        }
      });
      if (result == null) {
        Alert.alert("Card not found");
      }
      else {
        const parsed_result = JSON.parse(result);
        Alert.alert("Found...", "Name: " + parsed_result.name + "\nCompany: " + parsed_result.company + "\nPosition: " + parsed_result.position + "\nAddress: " + parsed_result.address + "\nCell: " + parsed_result.cell + "\nFax: " + parsed_result.fax + "\nEmail: " + parsed_result.email);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  toggleModal2 = () => {
    this.setState({ modal2Visible: !this.state.modal2Visible });
    return 0;
  }

  toggleModal2A = () => {
    this.setState({ modal2AVisible: !this.state.modal2AVisible });
    return 0;
  }


  modal2handler = () => {
    console.log("reached");
    console.log(this.state.ref);
    if (this.state.ref) {
      console.log("reached2")
      this.toggleModal2();
    }
    else {
      console.log("reached3")
      this.toggleModal2A();
    }
    console.log(this.state.modal2Visible);
    console.log(this.state.modal2AVisible);
  }

  saveSelf = async (card) => {
    await AsyncStorage.setItem('self', card);
  }

  save = async () => {
    try {
      const selfCard = {
        ref: serial.generate(8, '-', 4),
        name: this.state.name,
        company: this.state.company,
        address: this.state.address,
        cell: this.state.cell,
        fax: this.state.fax,
        email: this.state.email,
        position: this.state.position

      }

      axios.post('http://10.0.2.2:8000/api/create', selfCard)
        .then((response) => {
          if (response.data != null) {
            Alert.alert("Card successfully created");
            this.setState({ name: this.state.name, company: this.state.company, address: this.state.address, cell: this.state.cell, fax: this.state.fax, email: this.state.email, position: this.state.position, ref: selfCard.ref });
            this.saveSelf(JSON.stringify(selfCard));
            this.toggleModal2A();
          }
          else {
            Alert.alert("An error occured, please try again");
          }
        })
        .catch ((error) => {
          Alert.alert("An error occured, please try again");
        });
          
    }
    catch (error) {
      Alert.alert("An error occured, please try again");
    }
  }


  render() {
    return (
      <SafeAreaView style={tailwind("flex-1 items-center justify-center")}>
        <Modal visible={this.state.modalVisible} animationType="slide">
          <View style={tailwind("flex-1 items-center justify-center")}>
          <View style={tailwind("bg-blue-500 px-5 py-3 rounded-lg")}>
            <TextInput
              style={tailwind("border-2 border-blue-600 rounded-lg")}
              onChangeText={(text) => this.setState({ new: text })}
              placeholder="Enter 8 digit serial number"
            />
            <Button title="Add" onPress={this.onSubmit} />
            <Button title="Clear" onPress={this.clear} />
          </View>
          </View>
        </Modal>
        <Modal visible={this.state.modal2Visible} animationType="slide">
          <View style={tailwind("flex-1 items-center justify-center bg-blue-500 px-5 py-3 rounded-l")}>
            <View style={tailwind("flex flex-row")}>
              <Text style={tailwind("text-2xl")}>{this.state.ref}</Text>
              <TouchableOpacity onPress={this.toggleModal2}>
                <Image source={require('./assets/x.png')} style={tailwind("w-6 h-6")} />
              </TouchableOpacity>
            </View>
            <Text style={tailwind("text-xl pt-5")}>{this.state.name}</Text>
            <Text style={tailwind("text-xl pt-5")}>{this.state.company}</Text>
            <Text style={tailwind("text-xl pt-5")}>{this.state.position}</Text>
            <Text style={tailwind("text-xl pt-5")}>Address: {this.state.address}</Text>
            <Text style={tailwind("text-xl pt-5")}>Phone: {this.state.cell}</Text>
            <Text style={tailwind("text-xl pt-5")}>Fax: {this.state.fax}</Text>
            <Text style={tailwind("text-xl pt-5")}>Email: {this.state.email}</Text>
          </View>
        </Modal>
        <Modal visible={this.state.modal2AVisible} animationType="slide">
          <View style={tailwind("flex-1 items-center justify-center bg-blue-500 px-5 py-3 rounded-lg")}>
            <TextInput style={tailwind("text-xl pt-3")} placeholder="Enter name" onChangeText={(text) => this.setState({ name: text })}/>
            <TextInput style={tailwind("text-xl pt-3")} placeholder="Enter company" onChangeText={(text) => this.setState({ company: text })}/>
            <TextInput style={tailwind("text-xl pt-3")} placeholder="Enter position" onChangeText={(text) => this.setState({ position: text })}/>
            <TextInput style={tailwind("text-xl pt-3")} placeholder="Enter address" onChangeText={(text) => this.setState({ address: text })}/>
            <TextInput style={tailwind("text-xl pt-3")} placeholder="Enter cell" onChangeText={(text) => this.setState({ cell: parseInt(text) })}/>
            <TextInput style={tailwind("text-xl pt-3")} placeholder="Enter fax" onChangeText={(text) => this.setState({ fax: parseInt(text) })}/>
            <TextInput style={tailwind("text-xl pt-3 pb-3")} placeholder="Enter email" onChangeText={(text) => this.setState({ email: text })}/>
            <Button title="Save" onPress={this.save}/>
          </View>
        </Modal>
        <View style={tailwind("flex flex-row justify-between max-w-md bg-blue-500 px-5 py-3 rounded-lg my-1")}>
          <View style={tailwind("bg-blue-600 px-5 py-3 rounded-lg my-1 flex flex-row justify-between")}>
            <TextInput onChangeText={(query) => this.setState({ search: query})} placeholder="Search"/>
            <Button title="Enter" onPress={this.search}/>
          </View>
          <TouchableOpacity onPress={this.modal2handler}>
            <Image source={require('./assets/profile.png')} style={{ width: 50, height: 50 }} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={tailwind("flex")}>
            {this.state.cards.map((card, i) => {
              card_parsed = JSON.parse(card);
              return (
                <View style={tailwind("bg-blue-500 px-5 py-3 rounded-lg my-0.5")} key={i}>
                  <View style={tailwind("flex flex-row justify-between")}>
                    <Text style={tailwind("text-white text-lg")}>{card_parsed.name}</Text>
                    <TouchableOpacity onPress={() => this.delete(card)}>
                      <Image source={require('./assets/x.png')} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                  </View>
                  <Text style={tailwind("text-white")}>{card_parsed.company}</Text>
                  <Text style={tailwind("text-white")}>{card_parsed.position}</Text>
                  <Text style={tailwind("text-white")}>Address: {card_parsed.address}</Text>
                  <Text style={tailwind("text-white")}>Phone: {card_parsed.cell}</Text>
                  <Text style={tailwind("text-white")}>Fax: {card_parsed.fax}</Text>
                  <Text style={tailwind("text-white")}>Email: {card_parsed.email}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <TouchableOpacity visible={!this.state.modalVisible} style={tailwind("bg-blue-600 px-5 py-3 rounded-full my-1 w-20 h-20 justify-center mb-px mr-px")} onPress={this.toggleModal}>
          <Image source={require('./assets/plus.png')} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
