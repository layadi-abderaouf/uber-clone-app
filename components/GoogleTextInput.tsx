import { icons } from "@/constant"
import { useLocationStore } from "@/store"
import { GoogleInputProps } from "@/types/type"
import { View ,Image, TouchableOpacity} from "react-native"
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'


const google_maps_api_key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY

const GoogleTextInput = ({
    icon,
    initialLocation,
    containerStyle,
    textInputBackgroundColor,
    handlePress,
  }: GoogleInputProps)=>{
    
    const {setDestinationLocation} = useLocationStore()

    return(
    <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}>
        <GooglePlacesAutocomplete
         fetchDetails={true}
         placeholder="where you want to go ?"
         debounce={200}
         query={{
          key:google_maps_api_key,
          language:'en'
         }}
         onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
         styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
        renderRightButton={() =>
           (
            <TouchableOpacity
              onPress={() => {
                setDestinationLocation({latitude:null,longitude:null,address:null})
              }}
              className="justify-center items-center pr-2"
            >
              <Image
                source={icons.close} // ضع أي أيقونة X عندك
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )
        }
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where do you want to go?",
        }}
        />
    </View>
)}

export default GoogleTextInput