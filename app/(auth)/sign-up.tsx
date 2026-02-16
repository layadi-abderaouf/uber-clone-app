import React, { useState } from "react";
import { icons, images } from "@/constant";
import { Link, useRouter } from "expo-router";
import { useSignUp } from '@clerk/clerk-expo'
import { View, Text,ScrollView,Image } from "react-native";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import Modal from 'react-native-modal';
import OAuth from "@/components/OAuth"
import { fetchAPI } from "@/lib/fetch";


export default function SignUp() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const router = useRouter()
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
      });
      const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: "",
      });


       // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    if (!form.email || !form.name || !form.password) {
      console.log("Missing fields");
      setError('please enter all required fields')
      return;
    }

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress:form.email,
        password:form.password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err:any) {
      setError(err.errors[0].longMessage)
   
      
    }
  }

   // Handle submission of verification form
   const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
         code:verification.code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });
        await setActive({ session: signUpAttempt.createdSessionId })
        setVerification({
          ...verification,
          state: "success",
        });
        
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err:any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  }

  
    return (
        <ScrollView className="flex-1 bg-white" >
            <View className="flex-1 bg-white" >
                <View className="relative w-full h-[250px]" >
                    <Image className="w-full h-[250px] z-0" source={images.signUpCar} />
                    <Text className="text-2xl font-bold absolute left-5 bottom-5" >Create Your Account</Text>
                </View>
                <View className="p-5" >
                <InputField
                    label="Name"
                    placeholder="Enter name"
                    icon={icons.person}
                    value={form.name}
                    onChangeText={(value) => setForm({ ...form, name: value })}
                  />
                   <InputField
                    label="Email"
                    placeholder="Enter your email"
                    icon={icons.email}
                    value={form.email}
                    onChangeText={(value) => setForm({ ...form, email: value })}
                  />
                   <InputField
                    label="Password"
                    secureTextEntry={true}
                    placeholder="Enter your password"
                    icon={icons.lock}
                    value={form.password}
                    onChangeText={(value) => setForm({ ...form, password: value })}
                  />
                  {error && (
                    <Text className="text-red-500 text-sm mt-1">
                      {error}
                    </Text>
                  )}
                  <CustomButton onPress={onSignUpPress} className="mt-6" title="Sign Up" />
                  <OAuth/>
                  <Link className="text-lg  text-center text-general-200 mt-10" href={'/(auth)/sign-in'} >
                     <Text className=" text-zinc-400" >Already have an account?  </Text>
                     <Text className="text-blue-500" >Log In</Text>
                  </Link>
                </View>
               
                <Modal
                onModalHide={() => {
                  if (verification.state === "success") {
                    setShowSuccessModal(true);
                  }
                }}
                 isVisible={verification.state === 'pending'} >
                <View className="px-7 bg-white py-9 rounded-2xl min-h-[300px]">
                   <Text className="font-bold text-2xl mb-2">
                     Verification
                   </Text>
                   <Text className="font-Jakarta mb-5">
                     We ve sent a verification code to {form.email}.
                   </Text>
                  <InputField
                    label=" code"
                    secureTextEntry={true}
                    placeholder="Enter the code from your email"
                    icon={icons.lock}
                    keyboardType="numeric"
                    value={verification.code}
                    onChangeText={(code) =>
                      setVerification({ ...verification, code })
                    }
                  />
                  {verification.error && (
                    <Text className="text-red-500 text-sm mt-1">
                      {verification.error}
                    </Text>
                  )}
                  <CustomButton onPress={onVerifyPress}  className="mt-5 bg-green-500" title="Verify" />
                </View>
                </Modal>
                <Modal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => router.push(`/(root)/(tabs)/home`)}
              className="mt-5"
            />
          </View>
        </Modal>
            </View>
            
        </ScrollView>
    )
}