import CustomButton from "@/components/CustomButton"
import DriverCard from "@/components/DriverCard"
import GoogleTextInput from "@/components/GoogleTextInput"
import RideLayout from "@/components/RideLayout"
import { icons } from "@/constant"
import { useDriverStore, useLocationStore } from "@/store"
import { router } from "expo-router"
import { View,Text, FlatList } from "react-native"




const ConfirmRide = ()=>{
    const {userAddress,setUserLocation
        ,destinationAddress,setDestinationLocation
    } = useLocationStore()
    const {drivers,selectedDriver,setSelectedDriver} = useDriverStore()
    return (
        <RideLayout title={'choose a driver'} canSelect={false} snapPoint={['85%']} >
            <FlatList
        data={drivers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(Number(item.id!))}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Ride"
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
        </RideLayout>
    )
}

export default ConfirmRide