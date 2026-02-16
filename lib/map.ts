import { Driver, MarkerData } from "@/types/type";
import polyline from "@mapbox/polyline";



export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    userLatitude == null ||
    userLongitude == null ||
    destinationLatitude == null ||
    destinationLongitude == null
  ) {
    return [];
  }

  try {
    // ✅ 1️⃣ نحسب user → destination مرة واحدة
    const responseToDestination = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${userLongitude},${userLatitude};${destinationLongitude},${destinationLatitude}?overview=false`
    );

    const dataToDestination = await responseToDestination.json();

    if (!dataToDestination.routes?.length) return [];

    const timeToDestination = dataToDestination.routes[0].duration; // بالثواني

    // ✅ 2️⃣ نحسب لكل سائق driver → user
    const driversWithTimes = await Promise.all(
      markers.map(async (marker) => {
        const responseToUser = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${marker.longitude},${marker.latitude};${userLongitude},${userLatitude}?overview=false`
        );

        const dataToUser = await responseToUser.json();

        if (!dataToUser.routes?.length) return null;

        const timeToUser = dataToUser.routes[0].duration; // بالثواني

        const totalTimeMinutes =
        Number( ( (timeToUser + timeToDestination) / 60).toFixed(2));

        // 🔥 تسعير بسيط
        const price = (totalTimeMinutes * 0.5).toFixed(2);

        return {
          ...marker,
          time: totalTimeMinutes,
          price,
        };
      })
    );

    return driversWithTimes.filter(Boolean);
  } catch (error) {
    console.error("Error calculating driver times:", error);
    return [];
  }
};



export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          "User-Agent": "my-uber-app",
          "Accept": "application/json",
        },
      }
    );

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      const cleanedAddress = data.display_name
      .split(",")
      .map((part: string) => part.trim())
      .filter((part: string) =>/^[A-Za-z0-9\s\-]+$/
.test(part)) // يحتفظ فقط بالكلمات الإنجليزية
      .join(", ");

    return cleanedAddress || "Unknown location";
  
    } catch (e) {
      console.log("Response was not JSON:", e);
      return "Unknown location";
    }

  } catch (error) {
    console.log("Error getting address:", error);
    return "Unknown location";
  }
};



export const OSRMRoute = async ({
  origin,
  destination,
}: {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
})=>{
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=polyline`
    );

    const data = await response.json();

    if (!data.routes?.length) return;

    const points =  polyline.decode(data.routes[0].geometry);

    const coords =  points.map((point: number[]) => ({
      latitude: point[0],
      longitude: point[1],
    }));

    return coords
  } catch (error) {
    console.error("Error fetching route:", error);
  }
}
