import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import { styles } from "./ConfirmationScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack"; 
import NewSocialScreen from "../NewSocialScreen/NewSocialScreen.main";

type ConfirmationScreenProps = {
    navigation: StackNavigationProp<any>; // Use appropriate types for your stack
  };
  
const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ navigation }) => {

    return(
        <View style={styles.container}>
            <Text style={styles.titleText}>Event successfully saved!</Text>  
            <Button style={styles.button} onPress={() => navigation.navigate("HomeScreen")}>Home</Button>
            <Button style={styles.button} onPress={() => navigation.navigate("FeedScreen")}>View Socials</Button>
        </View>

    );




}


export default ConfirmationScreen;


