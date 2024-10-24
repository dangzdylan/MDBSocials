import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Card } from "react-native-paper";
import { initializeApp } from "firebase/app"; // Import for initializing Firebase
import { getFirestore, collection, onSnapshot, DocumentData } from "firebase/firestore"; // Import Firestore functions
import keys from "../../../../keys.json"; // Adjust the path to your keys.json file
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}

export default function FeedScreen({ navigation }: Props) {
  const [myList, setMyList] = useState<SocialModel[]>([]);


  const app = initializeApp(keys);
  const firestore = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "socials"), (snapshot) => {
      const socials = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as DocumentData), //casting of document data
      })) as SocialModel[]; // cast to SocialModel array
      
      const sortedSocials = socials.sort((a, b) => (b.eventDate - a.eventDate) * -1);

      setMyList(sortedSocials);
    });

    return () => unsubscribe(); // detach listener when unmounted
  }, [firestore]);

  const renderItem = ({ item }: { item: SocialModel }) => {
    return (
      <Card style={styles.postItem} onPress={() => navigation.navigate("DetailScreen", { social: item })}>
        <Card.Cover source={{ uri: item.eventImage }} />
        <Card.Title title={item.eventName} subtitle={new Date(item.eventDate).toDateString()} />
        <Card.Content>
          <Text>{item.eventDescription}</Text>
        </Card.Content>
      </Card>
    );
  };

  const NavigationBar = () => {
    return (
      <Appbar.Header>
        <Appbar.Content title="Social Feed" />
        <Appbar.Action icon="plus" onPress={() => navigation.navigate("NewSocialScreen")} />
      </Appbar.Header>
    );
  };

  return (
    <>
      <NavigationBar />
      <View style={styles.container}>
        <FlatList
          data={myList}
          keyExtractor={(item) => item.id || item.eventName} 
          renderItem={renderItem}
        />
      </View>
    </>
  );
}
