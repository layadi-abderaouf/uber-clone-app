import {  Alert, Image, Text,View } from "react-native"
import CustomButton from "./CustomButton"
import { icons } from "@/constant"
import { useSSO} from "@clerk/clerk-expo";
import { router } from "expo-router";
import { googleOAuth } from "@/lib/auth";




const AOuth = ()=>{
    const { startSSOFlow } = useSSO();
    const GoogleSignInHnadler = async()=>{
        const result = await googleOAuth(startSSOFlow);

    if (result.code === "session_exists") {
      Alert.alert("Success", "Session exists. Redirecting to home screen.");
      router.replace("/(root)/(tabs)/home");
    }

    Alert.alert(result.success ? "Success" : "Error", result.message);
    }
    return(
    <View>
        <View className="flex flex-row mt-4 gap-x-4 items-center justify-center" >
             <View className="flex-1 h-[1px] bg-gray-200" />
             <Text className="text-lg" >Or</Text>
             <View className="flex-1 h-[1px] bg-gray-200" />
        </View>
        <CustomButton onPress={GoogleSignInHnadler}
         bgVariant="outline" textVariant="primary"
         IconLeft={()=>(
            <Image className="w-5 h-5 mx-2" source={icons.google} resizeMode="contain" />
         )} 
         className="mt-5 w-full shadow-none" title="Log in with GOOGLE" />
    </View>
)}
export default AOuth
