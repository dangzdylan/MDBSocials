import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import { styles } from "./HomeScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack"; 
import NewSocialScreen from "../../NewSocialScreen/NewSocialScreen.main";

// Define the type for your navigation prop
type HomeScreenProps = {
    navigation: StackNavigationProp<any>; // Use appropriate types for your stack
  };
  
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

    return (
        <View style={styles.outView}>
            <View>
                <Text style={styles.welcomeText}>Welcome to MDBSocials</Text>
                <Button style={styles.button} onPress={() => navigation.navigate("FeedScreen")}>View Events</Button>
                <Button style={styles.button} onPress={() => navigation.navigate("NewSocialScreen")}>Create Events</Button>

            </View>
        </View>





    );

}

export default HomeScreen;