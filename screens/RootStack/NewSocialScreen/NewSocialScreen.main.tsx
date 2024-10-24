import React, { useState } from "react";
import { Platform, View, Text } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync, uuid } from "../../../Utils";
import { Image } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";

import firebase from "firebase/app";
import "firebase/firestore";
import { SocialModel } from "../../../models/social";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";
import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getApp } from "firebase/app";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}

export default function NewSocialScreen({ navigation }: Props) {
  // TODO: Declare state variables for all of the attributes 
  // that you need to keep track of on this screen.
  
  // HINTS:
  // 1. There are five core attributes that are related to the social object.
  // 2. There are two attributes from the Date Picker.
  // 3. There is one attribute from the Snackbar.
  // 4. There is one attribute for the loading indicator in the submit button.
  
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePicked, setIsDatePicked] = useState(false);
  const [snackbar, setSnackBar] = useState<string | null>(null); // Changed to string | null for Snackbar
  const [saveEventComplete, setSaveEventComplete] = useState(true);

  const ImagePickerExample = () => {
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    
      console.log(result);
    
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
    
    return (
      <View style={styles.imagePickerContainer}>
        <Button onPress={pickImage}>
          Pick an image from camera roll
        </Button>
        {image && <Image source={{ uri: image }} style={styles.imagePickerImage} />}
      </View>
    );
  }

  // Functions to show, hide, and confirm date picker selection
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (pickedDate: Date) => {
    setEventDate(pickedDate); // Update state with the picked date
    setIsDatePicked(true);
    hideDatePicker(); // Close the modal after selecting a date
  };
    
  const saveEvent = async () => {
    // TODO: Validate all fields (hint: field values should be stored in state variables).
    // If there's a field that is missing data, then return and show an error
    // using the Snackbar.

    // Otherwise, proceed onwards with uploading the image, and then the object.
    if (!eventName || !eventLocation || !eventDescription || !image || !isDatePicked) {
      setSnackBar("Please fill all fields and select a date.");
      return;
    }

    try {
      // (0) Firebase Cloud Storage wants a Blob, so we first convert the file path
      // saved in our eventImage state variable to a Blob.

      // Utility function to convert image URI to Blob
    async function getFileObjectAsync(uri: string): Promise<Blob> {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    }
      
      // (1) Write the image to Firebase Cloud Storage.
      const object = await getFileObjectAsync(image);
      const db = getFirestore();
      const storage = getStorage(getApp());
      const storageRef = ref(storage, `${uuid()}.jpg`);
      const result = await uploadBytes(storageRef, object);

      // (2) Get the download URL of the file we just wrote.
      const downloadURL = await getDownloadURL(result.ref);
      
      // (3) Construct & write the social model to the "socials" collection in Firestore.
      const socialRef = doc(collection(db, "socials"), uuid()); 
      const socialDoc: SocialModel = {
        eventName,
        eventDate: eventDate.getTime(),
        eventLocation,
        eventDescription,
        eventImage: downloadURL,
      };
      await setDoc(socialRef, socialDoc);

      console.log("Finished social creation.");
      navigation.navigate("ConfirmationScreen"); //nav to confirmation page

    } catch (e) {
      console.error("Error while writing social:", e);
      setSnackBar("An error occurred while saving the event.");
    }

    setSaveEventComplete(true);

  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action onPress={navigation.goBack} icon="close" />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={{ ...styles.container, padding: 20 }}>
        <TextInput
          label="Event Name"
          value={eventName}
          onChangeText={setEventName}
        />
          
        <TextInput
          label="Event Location"
          value={eventLocation}
          onChangeText={setEventLocation}
        />
          
        <TextInput
          label="Event Description"
          value={eventDescription}
          onChangeText={setEventDescription}
        />
          
        <ImagePickerExample />
          
        <Button onPress={showDatePicker}>Show Date Picker</Button>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        {isDatePicked && <Text>{`Selected Date: ${eventDate.toLocaleString()}`}</Text>}

        <Button
          mode="contained"
          onPress={() => {setSaveEventComplete(false); saveEvent();}}
          loading={false}
          disabled={!saveEventComplete} // so that people can't click
        >
          Save Event
        </Button>

        <Snackbar
          visible={snackbar !== null}
          onDismiss={() => setSnackBar(null)}
          duration={3000}
        >
          {snackbar}
        </Snackbar>
      </View>
    </>
  );
}
