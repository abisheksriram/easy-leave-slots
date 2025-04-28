
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import LanguageSelector from "@/components/LanguageSelector";

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isIdentityLoading, setIsIdentityLoading] = useState(false);
  const { login, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login({ username, password });
    
    if (success) {
      navigate("/");
    }
    
    setIsLoading(false);
  };

  const handleIdentityServerLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsIdentityLoading(true);
    try {
      await redirectToLogin();
    } catch (error) {
      console.error("Error redirecting to login:", error);
      setIsIdentityLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
          <CardDescription>
            {t('login.description')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('login.username')}</Label>
              <Input
                id="username"
                placeholder={t('login.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('login.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="pt-2">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? t('login.loading') : t('login.submit')}
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t('login.orContinueWith')}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              variant="outline" 
              type="button"
              onClick={handleIdentityServerLogin}
              disabled={isIdentityLoading}
            >
              {isIdentityLoading ? t('login.redirecting') : t('login.identityServer')}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default Login;
