import { icons } from '@/constant'
import CustomButton from './CustomButton'
import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Image } from 'react-native'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      router.replace('/')
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <CustomButton  onPress={handleSignOut} textVariant='primary'  className='justify-center items-center  rounded-full bg-white' title='Sign out '
    IconRight={()=>(<Image className="w-4 h-4 "   source={icons.out} />)} />
  )
}

