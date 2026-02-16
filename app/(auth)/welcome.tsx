import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { onboarding } from '@/constant';
import { View,Text,Image, TouchableOpacity} from "react-native";
import CustomButton from '@/components/CustomButton';
import Swiper from 'react-native-swiper';


export default function Home() {
   const swiperRef = useRef<Swiper>(null);
   const [currentIndex, setCurrentIndex] = useState(0);
   const isInLastSlide = currentIndex === onboarding.length - 1;
  return (
    <View className={styles.container}>

        <TouchableOpacity className='flex w-full items-end justify-end p-5'
         onPress={() => router.replace('/(auth)/sign-up')}>
           <Text className='text-black text-md font-bold'>Skip</Text>
        </TouchableOpacity>
        <Swiper ref={swiperRef}
                loop={false}
                dot={<View className='w-[32px] h-[4px] bg-[#E2E8F0] mx-1 rounded-full' />}
                activeDot={<View className='w-[32px] h-[4px] bg-[#0286FF] mx-1 rounded-full' />}
                onIndexChanged={(index) => setCurrentIndex(index)}
        >
         {onboarding.map((item) => (
          <View className='flex items-center justify-center p-5' key={item.id}>
            <Image source={item.image} className='w-full h-[300px]' resizeMode='contain' />
            <View className='mt-10 flex flex-row items-center justify-center'>
              <Text className='text-black text-center font-bold mx-10 text-3xl' >{item.title}</Text>
             
            </View>
            <Text className='text-lg text-center text-[#858585] mx-10 mt-3' >{item.description}</Text>
          </View>
         ))}
        </Swiper>
        <CustomButton  title={isInLastSlide ? "Get Started":"Next"}
         onPress={()=>isInLastSlide ? router.replace('/(auth)/sign-up') : swiperRef.current?.scrollBy(1)}
         className="w-11/12 mt-10 mb-5 " />
      
    </View>
  );
}

const styles = {
  container: 'flex h-full items-center justify-between bg-white',
};
