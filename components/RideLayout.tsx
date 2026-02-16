import { icons } from "@/constant";
import { router } from "expo-router";
import { View,Text, TouchableOpacity,Image } from "react-native"
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import Map from "./Map";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useRef } from "react";

const RideLayout = ({children,title,snapPoint,canSelect}:{children:React.ReactNode,title?:string|null,snapPoint?:string[],canSelect?:boolean})=>{
    const bottomSheetRef = useRef<BottomSheet>(null)
    return (
        <GestureHandlerRootView>
           <View className="flex-1 bg-white">
             <View className="flex flex-col h-screen bg-blue-500">
             <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
               <TouchableOpacity onPress={() => router.back()}>
                 <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                   <Image
                      source={icons.backArrow}
                      resizeMode="contain"
                      className="w-6 h-6"
                    />
                 </View>
               </TouchableOpacity>
               <Text className="text-xl font-JakartaSemiBold ml-5">
                 {title || "Go Back"}
                </Text>
             </View>
             <Map canSelect={canSelect} />
             </View>
             <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoint || ['45%','85%']} >
                 <BottomSheetView
                  style={{
                    flex: 1,
                    padding: 20,
                  }}
                >
                  {children}
                </BottomSheetView>
             </BottomSheet>
           </View>
        </GestureHandlerRootView>
    )
}

export default RideLayout;