import * as Linking from "expo-linking";
import { fetchAPI } from "./fetch";

export const googleOAuth = async (startOAuthFlow: any) => {
    try {
      const { createdSessionId, setActive, signUp } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
        strategy: "oauth_google" 
      });
  
      if (createdSessionId) {
        if (setActive) {
          await setActive({ session: createdSessionId });
  
          if (signUp.createdUserId) {
            await fetchAPI("/(api)/user", {
              method: "POST",
              body: JSON.stringify({
                name: `${signUp.firstName} ${signUp.lastName}`,
                email: signUp.emailAddress,
                clerkId: signUp.createdUserId,
              }),
            });
          }
  
          return {
            success: true,
            code: "success",
            message: "You have successfully signed in with Google",
          };
        }
      }
  
      return {
        success: false,
        message: "An error occurred while signing in with Google",
      };
    } catch (err: any) {
      console.error(err);
      return {
        success: false,
        code: err.code,
        message: err?.errors[0]?.longMessage,
      };
    }
  };