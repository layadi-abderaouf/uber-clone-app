import { useState,useCallback } from "react";
import { icons, images } from "@/constant";
import { Link, router } from "expo-router";
import { useSignIn } from '@clerk/clerk-expo'
import type { EmailCodeFactor } from '@clerk/types'
import { View, Text,ScrollView,Image } from "react-native";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth"
import Modal from 'react-native-modal'

export default function SignIn() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [showEmailCode, setShowEmailCode] = useState(false)
    const [form, setForm] = useState({
        email: "",
        password: "",
      });
      const onSignInPress = useCallback(async () => {
        if (!isLoaded) return
        if(!form.email || !form.password){
            return;
        }
    
        // Start the sign-in process using the email and password provided
        try {
          const signInAttempt = await signIn.create({
            identifier: form.email,
            password:form.password,
          })
    
          // If sign-in process is complete, set the created session as active
          // and redirect the user
          if (signInAttempt.status === 'complete') {
            await setActive({
              session: signInAttempt.createdSessionId,
              navigate: async ({ session }) => {
                if (session?.currentTask) {
                  // Check for tasks and navigate to custom UI to help users resolve them
                  // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
                  console.log(session?.currentTask)
                  return
                }
    
                router.replace('/(root)/(tabs)/home')
              },
            })
          } else if (signInAttempt.status === 'needs_second_factor') {
            // Check if email_code is a valid second factor
            // This is required when Client Trust is enabled and the user
            // is signing in from a new device.
            // See https://clerk.com/docs/guides/secure/client-trust
            const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
              (factor): factor is EmailCodeFactor => factor.strategy === 'email_code',
            )
    
            if (emailCodeFactor) {
              await signIn.prepareSecondFactor({
                strategy: 'email_code',
                emailAddressId: emailCodeFactor.emailAddressId,
              })
              setShowEmailCode(true)
            }
          } else {
            // If the status is not complete, check why. User may need to
            // complete further steps.
            setError(JSON.stringify(signInAttempt, null, 2))
           
          }
        } catch (err:any) {
          // See https://clerk.com/docs/guides/development/custom-flows/error-handling
          // for more info on error handling
          setError(err.errors[0].longMessage)
          
        }
      }, [isLoaded, signIn, setActive, form.email, form.password])
    
      // Handle the submission of the email verification code
      const onVerifyPress = useCallback(async () => {
        if (!isLoaded) return
    
        try {
          const signInAttempt = await signIn.attemptSecondFactor({
            strategy: 'email_code',
            code,
          })
    
          if (signInAttempt.status === 'complete') {
            await setActive({
              session: signInAttempt.createdSessionId,
              navigate: async ({ session }) => {
                if (session?.currentTask) {
                  // Check for tasks and navigate to custom UI to help users resolve them
                  // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
                  console.log(session?.currentTask)
                  return
                }
    
                router.replace('/(root)/(tabs)/home')
              },
            })
          } else {
            console.error(JSON.stringify(signInAttempt, null, 2))
          }
        } catch (err) {
          console.error(JSON.stringify(err, null, 2))
        }
      }, [isLoaded, signIn, setActive,  code])
    return (
        <ScrollView className="flex-1 bg-white" >
            <View className="flex-1 bg-white" >
                <View className="relative w-full h-[250px]" >
                    <Image className="w-full h-[250px] z-0" source={images.signUpCar} />
                    <Text className="text-2xl font-bold absolute left-5 bottom-5" >LogIn into Your Account</Text>
                </View>
                <View className="p-5" >
                
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
                  <CustomButton onPress={onSignInPress} className="mt-6" title="Sign In" />
                  <OAuth/>
                  <Link className="text-lg  text-center text-general-200 mt-10" href={'/(auth)/sign-up'} >
                     <Text className=" text-zinc-400" >Dont have an account?  </Text>
                     <Text className="text-blue-500" >Sign Up</Text>
                  </Link>
                </View>
               
                <Modal isVisible={showEmailCode} >
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
                    value={code}
                    onChangeText={(code) => setCode(code)}
                  />
                  <CustomButton onPress={onVerifyPress}  className="mt-5 bg-green-500" title="Verify" />
                </View>
                </Modal>
            </View>
            
        </ScrollView>
    )
}