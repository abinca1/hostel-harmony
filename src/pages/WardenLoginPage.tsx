import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';

const WardenLoginPage = () => {
  const navigate = useNavigate();
  const { setCurrentRole } = useApp();
  const [email, setEmail] = useState('warden@hostelhub.com');
  const [password, setPassword] = useState('Warden@123');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentRole('warden');
    navigate('/warden');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <CardTitle>Warden Login</CardTitle>
              <CardDescription>Sign in to the warden module</CardDescription>
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
                Email: <span className="font-semibold text-foreground">warden@hostelhub.com</span>
              </p>
              <p>
                Password: <span className="font-semibold text-foreground">Warden@123</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warden-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="warden-email"
                  type="email"
                  placeholder="warden@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warden-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="warden-password"
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
              Login as Warden
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WardenLoginPage;
