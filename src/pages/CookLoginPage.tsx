import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock, Mail, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';

const CookLoginPage = () => {
  const navigate = useNavigate();
  const { setCurrentRole } = useApp();
  const [email, setEmail] = useState('cook@hostelhub.com');
  const [password, setPassword] = useState('Cook@123');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentRole('cook');
    navigate('/cook');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <CardTitle>Cook Login</CardTitle>
              <CardDescription>Sign in to the cook module</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2 text-foreground">
                <UserCog className="w-4 h-4" />
                <span className="font-medium">Demo credentials</span>
              </div>
              <p>
                Email: <span className="font-semibold text-foreground">cook@hostelhub.com</span>
              </p>
              <p>
                Password: <span className="font-semibold text-foreground">Cook@123</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cook-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="cook-email"
                  type="email"
                  placeholder="cook@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cook-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="cook-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary">
              Login as Cook
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookLoginPage;
