import React from "react";
import { StyleSheet } from "react-native";
import { AppStyles } from "../../../AppStyles";



export const styles = StyleSheet.create({
    ...AppStyles,

    titleText: {
        color : "black",
        fontSize : 25,
        fontWeight : "bold",
        marginBottom : 25,
    },
    button: {
        backgroundColor : "lightgray",
        borderRadius : 10,
        margin : 15,

    },
    container: {
        display : "flex",
        justifyContent : "center",
        flex : 1,
        alignItems : "center",
    }

  });