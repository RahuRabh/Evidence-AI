import { googleAuth } from "../api/auth";
import { useAuth } from "../features/auth/AuthProvider";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

export function GoogleAuthButton() {
  const { loginWithGoogle } = useAuth();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return;

    try {
      const res = await googleAuth(idToken);

      if (res && res.token && res.user) {
        loginWithGoogle(res.token, res.user);
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}
