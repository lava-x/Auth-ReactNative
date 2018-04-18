import React, { Component } from 'react'
import firebase from 'firebase'
import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import { Button, Card, CardSection, Input, Spinner } from './common'
//import FBLoginView from './FBLoginView'

import PropTypes from 'prop-types';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login'

export default class LoginForm extends Component {

  constructor(props){
    super(props)
    this.onButtonPress = this.onButtonPress.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.onLoginSuccess = this.onLoginSuccess.bind(this)
    this.onFacebookLogin = this.onFacebookLogin.bind(this)
    this.state = {
      email: '',
      password: '',
      error: '',
      loading: false
    }
  }

  async onButtonPress() {
    const { email, password } = this.state
    this.setState(() => ({error: "", loading: true}))
    try {
      const auth = await firebase.auth().signInWithEmailAndPassword(email, password)
      auth.onLoginSuccess
    } catch(e) {
      this.setState(() => ({ error: "Authentication Failed", loading: false}))
    }
    // firebase.auth().signInWithEmailAndPassword(email, password)
    //   .then(() => this.onLoginSuccess)
    //   .catch(() => this.setState(() => ({ error: "Authentication Failed", loading: false})))
  }

  onLoginSuccess() {
    this.setState(() => ({
      email: '',
      password: '',
      loading: false,
      error: ''
    }))
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />
    }

    return (
      <Button onPress={this.onButtonPress}>
        Log in
      </Button>
    )
  }
  
  onFacebookLogin() {
    FBLoginManager.loginWithPermissions(["email","user_friends"], function(error, data){
      if (!error) {
        console.log("Login data: ", data);
      } else {
        console.log("Error: ", error);
      }
    })
  }

  render(){

    return(
      <Card>
        <CardSection>
          <Input 
            secureTextEntry={false}
            placeholder="user@gmail.com"
            label="Email"
            value={this.state.email}
            onChangeText={(text) => this.setState({email: text})} 
          />
        </CardSection>
        <CardSection>
          <Input 
            secureTextEntry
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            label="Password"
            value={this.state.password}
            onChangeText={(text) => this.setState({password: text})} 
          />
        </CardSection>
        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>
        <CardSection>
          {this.renderButton()}
        </CardSection>
        <FBLogin 
          ref={(fbLogin) => { this.fbLogin = fbLogin }}
          loginBehavior={FBLoginManager.LoginBehaviors.Web}
          permissions={["email","user_friends"]}
          onLogin={function(e){console.log(e)}}
          onLoginFound={function(e){console.log(e)}}
          onLoginNotFound={function(e){console.log(e)}}
          onLogout={function(e){console.log(e)}}
          onCancel={function(e){console.log(e)}}
          onPermissionsMissing={function(e){console.log(e)}}
        />
      </Card>
    )
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'red'
  },
  // FB: {
  //   marginLeft: 10,
  //   marginRight: 10
  // }
}