
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        
        // Handle error from auth server
        const errorParam = params.get("error");
        if (errorParam) {
          const errorDescription = params.get("error_description") || "Authentication failed";
          throw new Error(errorDescription);
        }

        // Validate required parameters
        if (!code || !state) {
          throw new Error("Missing required authentication parameters");
        }

        // Process the authentication
        const success = await handleAuthCallback(code, state);
        
        if (success) {
          // Redirect to home page on success
          navigate("/");
        } else {
          throw new Error("Failed to complete authentication");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
        // Redirect to login after a delay
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [handleAuthCallback, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        {error ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-red-500">Authentication Error</h2>
            <p className="mb-8 text-gray-600">{error}</p>
            <p className="text-gray-500">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Completing Authentication</h2>
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500">Please wait while we complete the authentication process...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
