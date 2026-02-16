import { icons } from "@/constant";
import { useFetch } from "@/lib/fetch";
import { calculateDriverTimes, OSRMRoute,calculateRegion, generateMarkersFromData ,getAddressFromCoordinates} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import { useEffect, useState } from "react";
import {  ActivityIndicator, StyleSheet, View ,Text} from "react-native"
import MapView, { MapPressEvent, Marker,Polyline,PROVIDER_DEFAULT } from "react-native-maps";




const Map = ({canSelect}:{canSelect?:boolean})=>{
    const {userLatitude,userLongitude,
        destinationLatitude,destinationLongitude,setDestinationLocation} = useLocationStore()
    const {setDrivers,selectedDriver} = useDriverStore()
    const region = calculateRegion({
            userLatitude,
            userLongitude,
            destinationLatitude,
            destinationLongitude,
        });
    const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
    const [markers,setMarkers] = useState<MarkerData[]>([])
    const [routeCoords, setRouteCoords] = useState<any[]>([]);
    const handleLocationPress = async(event:MapPressEvent)=>{
        if(canSelect === false){
            return
        }
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setDestinationLocation({
            latitude,
            longitude,
            address:"Loading address...",
          });
        
        const address = await getAddressFromCoordinates(latitude, longitude);

        setDestinationLocation({
            latitude,
            longitude,
            address,
          });
          
    
        // هنا تستدعي الدالة التي تريدها
        console.log("Selected:", latitude, longitude, address);
    }
      

    useEffect(()=>{
        if(Array.isArray(drivers)){
            if(!userLatitude || !userLongitude){
                return;
            }
           
            const newMarkers = generateMarkersFromData({
                data:drivers,
                userLatitude,userLongitude
            } )
            setMarkers(newMarkers)
        }
    },[drivers,userLatitude,userLongitude])

    useEffect(() => {
        if (
          markers.length > 0 &&
          destinationLatitude !== undefined &&
          destinationLongitude !== undefined
        ) {
            setRouteCoords([])
          calculateDriverTimes({
            markers,
            userLatitude,
            userLongitude,
            destinationLatitude,
            destinationLongitude,
          }).then((drivers) => {
            setDrivers(drivers as MarkerData[]);
          });
          OSRMRoute({
            origin: {
              latitude: Number(userLatitude),
              longitude: Number(userLongitude),
            },
            destination: {
              latitude: Number(destinationLatitude),
              longitude: Number(destinationLongitude),
            },
          }).then((route) => {
            if (route) {
              setRouteCoords(route);
            }
          });
        }
      }, [markers, destinationLatitude, destinationLongitude,userLatitude,userLongitude,setDrivers]);

   
    
    if(!userLatitude || !userLongitude || loading){
        return (
            <View className="flex justify-between items-center w-full">
              <ActivityIndicator size="small" color="#000" />
            </View>
          );
    }
    if (error){
        return (
            <View className="flex justify-between items-center w-full">
              <Text>Error: {error}</Text>
            </View>
          );
    }
       
   
    return (
       
       
        <MapView 
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            tintColor="black"
            showsPointsOfInterest={false}
            showsUserLocation={true}
            userInterfaceStyle="light"
            initialRegion={region}
            onPress={async (event) => {
                 handleLocationPress(event)
              }}
        >
            {markers.map((marker)=>(
                <Marker key={marker.id}
                coordinate={{latitude:marker.latitude,longitude:marker.longitude}}
                title={marker.title}
                image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
                 />
            ))}
            { destinationLatitude && destinationLongitude && (
              <Marker
                coordinate={{
                  latitude: destinationLatitude, 
                  longitude: destinationLongitude
                }}
                title="Selected Location"
                description="destination"
              />
            )}
            {routeCoords.length > 0 && (
              <Polyline
               coordinates={routeCoords}
               strokeWidth={4}
               strokeColor="blue"
             />
            )}
        </MapView>
        
    )
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
})

export default Map