 import { Header } from '@/components/layout/Header';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Switch } from '@/components/ui/switch';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Separator } from '@/components/ui/separator';
 import {
   Building2,
   Bell,
   CreditCard,
   Shield,
   Smartphone,
   Mail,
   MessageSquare,
   FileText,
   Download,
 } from 'lucide-react';
 
 const SettingsPage = () => {
   return (
     <div className="animate-fade-in">
       <Header
         title="Settings"
         subtitle="Manage hostel configuration and preferences"
       />
 
       <div className="p-4 md:p-6 space-y-6 max-w-4xl">
         {/* Hostel Info */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Building2 className="w-5 h-5" />
               Hostel Information
             </CardTitle>
             <CardDescription>Basic details about your hostel</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label>Hostel Name</Label>
                 <Input defaultValue="Green Valley Hostel" />
               </div>
               <div className="space-y-2">
                 <Label>Contact Number</Label>
                 <Input defaultValue="+91 80 1234 5678" />
               </div>
             </div>
             <div className="space-y-2">
               <Label>Address</Label>
               <Input defaultValue="123 University Road, Bangalore 560001" />
             </div>
             <Button>Save Changes</Button>
           </CardContent>
         </Card>
 
         {/* Notifications */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Bell className="w-5 h-5" />
               Notification Settings
             </CardTitle>
             <CardDescription>Configure how you receive alerts</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Mail className="w-5 h-5 text-muted-foreground" />
                 <div>
                   <p className="font-medium">Email Notifications</p>
                   <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                 </div>
               </div>
               <Switch defaultChecked />
             </div>
             <Separator />
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <MessageSquare className="w-5 h-5 text-muted-foreground" />
                 <div>
                   <p className="font-medium">SMS Notifications</p>
                   <p className="text-sm text-muted-foreground">Get text alerts for urgent matters</p>
                 </div>
               </div>
               <Switch defaultChecked />
             </div>
             <Separator />
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Smartphone className="w-5 h-5 text-muted-foreground" />
                 <div>
                   <p className="font-medium">Push Notifications</p>
                   <p className="text-sm text-muted-foreground">Mobile app notifications</p>
                 </div>
               </div>
               <Switch defaultChecked />
             </div>
           </CardContent>
         </Card>
 
         {/* Billing Settings */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <CreditCard className="w-5 h-5" />
               Billing Configuration
             </CardTitle>
             <CardDescription>Set up payment and billing rules</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label>Rent Due Day</Label>
                 <Input type="number" defaultValue="5" min="1" max="28" />
                 <p className="text-xs text-muted-foreground">Day of month when rent is due</p>
               </div>
               <div className="space-y-2">
                 <Label>Late Fee (%)</Label>
                 <Input type="number" defaultValue="5" min="0" max="100" />
                 <p className="text-xs text-muted-foreground">Percentage charged after due date</p>
               </div>
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <p className="font-medium">Auto-generate Monthly Bills</p>
                 <p className="text-sm text-muted-foreground">Automatically create bills on 1st of month</p>
               </div>
               <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <p className="font-medium">Payment Reminders</p>
                 <p className="text-sm text-muted-foreground">Send reminders before due date</p>
               </div>
               <Switch defaultChecked />
             </div>
           </CardContent>
         </Card>
 
         {/* Security */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Shield className="w-5 h-5" />
               Security & Access
             </CardTitle>
             <CardDescription>Manage access control settings</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="font-medium">QR Code Entry</p>
                 <p className="text-sm text-muted-foreground">Enable QR-based entry/exit tracking</p>
               </div>
               <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <p className="font-medium">Visitor Pre-registration</p>
                 <p className="text-sm text-muted-foreground">Require advance registration for visitors</p>
               </div>
               <Switch />
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <p className="font-medium">Late Entry Alerts</p>
                 <p className="text-sm text-muted-foreground">Notify warden for entries after 10 PM</p>
               </div>
               <Switch defaultChecked />
             </div>
           </CardContent>
         </Card>
 
         {/* Reports */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <FileText className="w-5 h-5" />
               Reports & Export
             </CardTitle>
             <CardDescription>Generate and download reports</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="grid gap-3 sm:grid-cols-2">
               <Button variant="outline" className="justify-start">
                 <Download className="w-4 h-4 mr-2" />
                 Occupancy Report
               </Button>
               <Button variant="outline" className="justify-start">
                 <Download className="w-4 h-4 mr-2" />
                 Revenue Report
               </Button>
               <Button variant="outline" className="justify-start">
                 <Download className="w-4 h-4 mr-2" />
                 Resident Directory
               </Button>
               <Button variant="outline" className="justify-start">
                 <Download className="w-4 h-4 mr-2" />
                 Defaulter List
               </Button>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 };
 
 export default SettingsPage;