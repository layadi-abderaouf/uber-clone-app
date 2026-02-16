import { Text,View,FlatList,Image, ActivityIndicator } from "react-native"
import * as Location from 'expo-location'
import {  useUser } from '@clerk/clerk-expo'
import { SignOutButton } from "@/components/SignOutBtn"
import RideCard from "@/components/RideCard"
import { icons, images } from "@/constant"
import GoogleTextInput from "@/components/GoogleTextInput"
import Map from "@/components/Map"
import { useLocationStore } from "@/store"
import { useEffect } from "react"
import { router } from "expo-router"
import CustomButton from "@/components/CustomButton"
import { Ride } from "@/types/type"
import { useFetch } from "@/lib/fetch"




const Home = ()=>{
    const { user } = useUser()
    const {setUserLocation,setDestinationLocation,destinationAddress} = useLocationStore()
   // const [has_permission,setHas_permissions] = useState(false)
    const {data:rides,loading} = useFetch<Ride[]>(`/(api)/(ride)/${user?.id}`)
    const handleDestinationPress =(location:{latitude:number
      ,longitude:number,address:string})=>{
          setDestinationLocation(location)
          router.push('/(root)/find-ride')
    }

    useEffect(()=>{
      const requestLocation = async()=>{
        let {status} = await Location.requestForegroundPermissionsAsync()
        if(status !== 'granted'){
         // setHas_permissions(false)
          return;
        }
        let location = await Location.getCurrentPositionAsync()
        const address = await Location.reverseGeocodeAsync({
          latitude:location.coords?.latitude,
          longitude:location.coords?.longitude
        })
        setUserLocation({
          latitude:location.coords?.latitude,
          longitude:location.coords?.longitude,
          address:`${address[0].name}, ${address[0].region}`
        })
      }
      requestLocation()
    },[setUserLocation])
   
    return(
        <View className="bg-gray-100" >
           
           
           <FlatList className="px-5" keyboardShouldPersistTaps='handled' data={rides?.slice(0,5)} renderItem={({item})=>(
              <RideCard ride={item} />
           )}
           contentContainerStyle={{
            paddingBottom:200
           }}
           ListEmptyComponent={() => (
            <View className="flex flex-col items-center justify-center">
              {!loading ? (
                <>
                  <Image
                    source={images.noResult}
                    className="w-40 h-40"
                    alt="No recent rides found"
                    resizeMode="contain"
                  />
                  <Text className="text-sm">No recent rides found</Text>
                </>
              ) : (
                <ActivityIndicator size="small" color="#000" />
              )}
            </View>
          )}
          ListHeaderComponent={
            <>
              <View className="flex flex-row items-center justify-between my-5">
                <Text className="text-2xl font-bold">
                  Welcome {user?.firstName}👋
                </Text>
                
                <SignOutButton></SignOutButton>
              </View>
              
              <GoogleTextInput
                initialLocation={destinationAddress as string}
                icon={icons.search}
                containerStyle="bg-white shadow-md shadow-gray-300"
                handlePress={handleDestinationPress}
              />
              {destinationAddress ? 
              (<CustomButton onPress={()=>{
                router.push('/(root)/find-ride')
              }} className="mt-2" title="find ride" />) : (<></>)
              }
  
              <>
                <Text className="text-xl font-bold mt-5 mb-3">
                  Your current location
                </Text>
                <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map/>
                </View>
              </>
  
              <Text className="text-xl font-bold mt-5 mb-3">
                Recent Rides
              </Text>
            </>
          }
            />
        </View>
        
    )
}

export default Home;