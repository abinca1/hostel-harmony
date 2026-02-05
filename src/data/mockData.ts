 import {
   Hostel,
   Room,
   Resident,
   Payment,
   EntryLog,
   MealPlan,
   MenuItem,
   MealAttendance,
   DashboardKPIs,
 } from '@/types/hostel';
 
 // Mock Hostels with hierarchy
 export const mockHostels: Hostel[] = [
   {
     id: 'hostel-1',
     name: 'Green Valley Hostel',
     address: '123 University Road, Bangalore 560001',
     blocks: [
       {
         id: 'block-a',
         name: 'Block A',
         hostelId: 'hostel-1',
         floors: [
           {
             id: 'floor-1',
             number: 1,
             blockId: 'block-a',
             rooms: [],
           },
           {
             id: 'floor-2',
             number: 2,
             blockId: 'block-a',
             rooms: [],
           },
           {
             id: 'floor-3',
             number: 3,
             blockId: 'block-a',
             rooms: [],
           },
         ],
       },
       {
         id: 'block-b',
         name: 'Block B',
         hostelId: 'hostel-1',
         floors: [
           {
             id: 'floor-b1',
             number: 1,
             blockId: 'block-b',
             rooms: [],
           },
           {
             id: 'floor-b2',
             number: 2,
             blockId: 'block-b',
             rooms: [],
           },
         ],
       },
     ],
   },
 ];
 
 // Generate rooms
 export const mockRooms: Room[] = [
   // Block A, Floor 1
   { id: 'room-101', number: 'A-101', floorId: 'floor-1', category: 'single', status: 'occupied', monthlyRent: 8000, beds: [{ id: 'bed-101-1', number: '1', roomId: 'room-101', residentId: 'resident-1' }], amenities: ['AC', 'Attached Bathroom', 'WiFi'] },
   { id: 'room-102', number: 'A-102', floorId: 'floor-1', category: 'double', status: 'occupied', monthlyRent: 12000, beds: [{ id: 'bed-102-1', number: '1', roomId: 'room-102', residentId: 'resident-2' }, { id: 'bed-102-2', number: '2', roomId: 'room-102', residentId: 'resident-3' }], amenities: ['AC', 'Attached Bathroom', 'WiFi', 'Study Table'] },
   { id: 'room-103', number: 'A-103', floorId: 'floor-1', category: 'single', status: 'available', monthlyRent: 8000, beds: [{ id: 'bed-103-1', number: '1', roomId: 'room-103' }], amenities: ['AC', 'Attached Bathroom', 'WiFi'] },
   { id: 'room-104', number: 'A-104', floorId: 'floor-1', category: 'triple', status: 'maintenance', monthlyRent: 15000, beds: [{ id: 'bed-104-1', number: '1', roomId: 'room-104' }, { id: 'bed-104-2', number: '2', roomId: 'room-104' }, { id: 'bed-104-3', number: '3', roomId: 'room-104' }], amenities: ['Fan', 'Common Bathroom'] },
   { id: 'room-105', number: 'A-105', floorId: 'floor-1', category: 'double', status: 'reserved', monthlyRent: 12000, beds: [{ id: 'bed-105-1', number: '1', roomId: 'room-105' }, { id: 'bed-105-2', number: '2', roomId: 'room-105' }], amenities: ['AC', 'Attached Bathroom', 'WiFi'] },
   // Block A, Floor 2
   { id: 'room-201', number: 'A-201', floorId: 'floor-2', category: 'single', status: 'occupied', monthlyRent: 8500, beds: [{ id: 'bed-201-1', number: '1', roomId: 'room-201', residentId: 'resident-4' }], amenities: ['AC', 'Attached Bathroom', 'WiFi', 'Balcony'] },
   { id: 'room-202', number: 'A-202', floorId: 'floor-2', category: 'double', status: 'available', monthlyRent: 12500, beds: [{ id: 'bed-202-1', number: '1', roomId: 'room-202' }, { id: 'bed-202-2', number: '2', roomId: 'room-202' }], amenities: ['AC', 'Attached Bathroom', 'WiFi', 'Balcony'] },
   { id: 'room-203', number: 'A-203', floorId: 'floor-2', category: 'single', status: 'occupied', monthlyRent: 8500, beds: [{ id: 'bed-203-1', number: '1', roomId: 'room-203', residentId: 'resident-5' }], amenities: ['AC', 'Attached Bathroom', 'WiFi', 'Balcony'] },
   { id: 'room-204', number: 'A-204', floorId: 'floor-2', category: 'dormitory', status: 'occupied', monthlyRent: 20000, beds: [{ id: 'bed-204-1', number: '1', roomId: 'room-204', residentId: 'resident-6' }, { id: 'bed-204-2', number: '2', roomId: 'room-204', residentId: 'resident-7' }, { id: 'bed-204-3', number: '3', roomId: 'room-204' }, { id: 'bed-204-4', number: '4', roomId: 'room-204' }], amenities: ['Fan', 'Common Bathroom', 'Locker'] },
   // Block A, Floor 3
   { id: 'room-301', number: 'A-301', floorId: 'floor-3', category: 'single', status: 'available', monthlyRent: 9000, beds: [{ id: 'bed-301-1', number: '1', roomId: 'room-301' }], amenities: ['AC', 'Attached Bathroom', 'WiFi', 'Terrace Access'] },
   { id: 'room-302', number: 'A-302', floorId: 'floor-3', category: 'double', status: 'occupied', monthlyRent: 13000, beds: [{ id: 'bed-302-1', number: '1', roomId: 'room-302', residentId: 'resident-8' }, { id: 'bed-302-2', number: '2', roomId: 'room-302' }], amenities: ['AC', 'Attached Bathroom', 'WiFi', 'Terrace Access'] },
   // Block B rooms
   { id: 'room-b101', number: 'B-101', floorId: 'floor-b1', category: 'single', status: 'occupied', monthlyRent: 7500, beds: [{ id: 'bed-b101-1', number: '1', roomId: 'room-b101', residentId: 'resident-9' }], amenities: ['Fan', 'Attached Bathroom', 'WiFi'] },
   { id: 'room-b102', number: 'B-102', floorId: 'floor-b1', category: 'double', status: 'available', monthlyRent: 11000, beds: [{ id: 'bed-b102-1', number: '1', roomId: 'room-b102' }, { id: 'bed-b102-2', number: '2', roomId: 'room-b102' }], amenities: ['Fan', 'Common Bathroom', 'WiFi'] },
 ];
 
 // Mock Residents
 export const mockResidents: Resident[] = [
   { id: 'resident-1', name: 'Arjun Sharma', email: 'arjun.s@email.com', phone: '+91 98765 11111', type: 'student', organization: 'IIT Bangalore', idType: 'college_id', idNumber: 'IIT2024001', emergencyContact: { name: 'Ramesh Sharma', phone: '+91 98765 00001', relation: 'Father' }, moveInDate: '2024-01-15', roomId: 'room-101', bedId: 'bed-101-1', mealPlan: 'full-board', dietaryTags: ['vegetarian'] },
   { id: 'resident-2', name: 'Priya Patel', email: 'priya.p@email.com', phone: '+91 98765 22222', type: 'professional', organization: 'Infosys Ltd', idType: 'aadhar', idNumber: '1234-5678-9012', emergencyContact: { name: 'Suresh Patel', phone: '+91 98765 00002', relation: 'Father' }, moveInDate: '2024-02-01', roomId: 'room-102', bedId: 'bed-102-1', mealPlan: 'half-board', dietaryTags: ['vegetarian', 'jain'] },
   { id: 'resident-3', name: 'Vikram Singh', email: 'vikram.s@email.com', phone: '+91 98765 33333', type: 'student', organization: 'NIT Karnataka', idType: 'college_id', idNumber: 'NIT2024015', emergencyContact: { name: 'Harpreet Singh', phone: '+91 98765 00003', relation: 'Mother' }, moveInDate: '2024-01-20', roomId: 'room-102', bedId: 'bed-102-2', mealPlan: 'full-board', dietaryTags: ['non-veg'] },
   { id: 'resident-4', name: 'Sneha Reddy', email: 'sneha.r@email.com', phone: '+91 98765 44444', type: 'professional', organization: 'TCS', idType: 'employee_id', idNumber: 'TCS78542', emergencyContact: { name: 'Lakshmi Reddy', phone: '+91 98765 00004', relation: 'Mother' }, moveInDate: '2023-11-01', roomId: 'room-201', bedId: 'bed-201-1', mealPlan: 'no-meals', dietaryTags: [] },
   { id: 'resident-5', name: 'Amit Kumar', email: 'amit.k@email.com', phone: '+91 98765 55555', type: 'student', organization: 'VIT Bangalore', idType: 'college_id', idNumber: 'VIT2023089', emergencyContact: { name: 'Sunita Kumar', phone: '+91 98765 00005', relation: 'Mother' }, moveInDate: '2023-07-15', roomId: 'room-203', bedId: 'bed-203-1', mealPlan: 'full-board', dietaryTags: ['vegetarian'] },
   { id: 'resident-6', name: 'Rahul Mehta', email: 'rahul.m@email.com', phone: '+91 98765 66666', type: 'student', organization: 'Christ University', idType: 'college_id', idNumber: 'CHR2024102', emergencyContact: { name: 'Deepak Mehta', phone: '+91 98765 00006', relation: 'Father' }, moveInDate: '2024-01-10', roomId: 'room-204', bedId: 'bed-204-1', mealPlan: 'full-board', dietaryTags: ['vegetarian'] },
   { id: 'resident-7', name: 'Kavya Nair', email: 'kavya.n@email.com', phone: '+91 98765 77777', type: 'student', organization: 'Christ University', idType: 'college_id', idNumber: 'CHR2024103', emergencyContact: { name: 'Anand Nair', phone: '+91 98765 00007', relation: 'Father' }, moveInDate: '2024-01-10', roomId: 'room-204', bedId: 'bed-204-2', mealPlan: 'half-board', dietaryTags: ['non-veg'] },
   { id: 'resident-8', name: 'Sanjay Gupta', email: 'sanjay.g@email.com', phone: '+91 98765 88888', type: 'professional', organization: 'Wipro', idType: 'aadhar', idNumber: '9876-5432-1098', emergencyContact: { name: 'Meera Gupta', phone: '+91 98765 00008', relation: 'Wife' }, moveInDate: '2023-09-01', roomId: 'room-302', bedId: 'bed-302-1', mealPlan: 'full-board', dietaryTags: ['vegetarian'] },
   { id: 'resident-9', name: 'Neha Joshi', email: 'neha.j@email.com', phone: '+91 98765 99999', type: 'student', organization: 'PES University', idType: 'college_id', idNumber: 'PES2024045', emergencyContact: { name: 'Vikas Joshi', phone: '+91 98765 00009', relation: 'Father' }, moveInDate: '2024-02-15', roomId: 'room-b101', bedId: 'bed-b101-1', mealPlan: 'full-board', dietaryTags: ['vegetarian', 'jain'] },
 ];
 
 // Mock Payments
 export const mockPayments: Payment[] = [
   { id: 'pay-1', residentId: 'resident-1', amount: 8000, type: 'rent', status: 'paid', dueDate: '2024-02-05', paidDate: '2024-02-03', month: 'February 2024' },
   { id: 'pay-2', residentId: 'resident-2', amount: 6000, type: 'rent', status: 'paid', dueDate: '2024-02-05', paidDate: '2024-02-05', month: 'February 2024' },
   { id: 'pay-3', residentId: 'resident-3', amount: 6000, type: 'rent', status: 'overdue', dueDate: '2024-02-05', month: 'February 2024' },
   { id: 'pay-4', residentId: 'resident-4', amount: 8500, type: 'rent', status: 'pending', dueDate: '2024-02-10', month: 'February 2024' },
   { id: 'pay-5', residentId: 'resident-5', amount: 8500, type: 'rent', status: 'paid', dueDate: '2024-02-05', paidDate: '2024-02-01', month: 'February 2024' },
   { id: 'pay-6', residentId: 'resident-6', amount: 5000, type: 'rent', status: 'partial', dueDate: '2024-02-05', month: 'February 2024', description: 'Paid ₹3000, ₹2000 pending' },
   { id: 'pay-7', residentId: 'resident-1', amount: 16000, type: 'security_deposit', status: 'paid', dueDate: '2024-01-15', paidDate: '2024-01-15', month: 'January 2024' },
   { id: 'pay-8', residentId: 'resident-3', amount: 500, type: 'late_fee', status: 'pending', dueDate: '2024-02-15', month: 'February 2024' },
   { id: 'pay-9', residentId: 'resident-7', amount: 5000, type: 'rent', status: 'pending', dueDate: '2024-02-10', month: 'February 2024' },
   { id: 'pay-10', residentId: 'resident-8', amount: 6500, type: 'rent', status: 'paid', dueDate: '2024-02-05', paidDate: '2024-02-04', month: 'February 2024' },
 ];
 
 // Mock Entry Logs
 const today = new Date().toISOString().split('T')[0];
 export const mockEntryLogs: EntryLog[] = [
   { id: 'log-1', residentId: 'resident-1', type: 'exit', timestamp: `${today}T08:30:00`, method: 'qr' },
   { id: 'log-2', residentId: 'resident-2', type: 'exit', timestamp: `${today}T09:00:00`, method: 'qr' },
   { id: 'log-3', residentId: 'resident-3', type: 'exit', timestamp: `${today}T08:45:00`, method: 'manual', verifiedBy: 'Warden Kumar' },
   { id: 'log-4', residentId: 'resident-1', type: 'entry', timestamp: `${today}T13:30:00`, method: 'qr' },
   { id: 'log-5', residentId: 'resident-5', type: 'exit', timestamp: `${today}T10:00:00`, method: 'qr' },
   { id: 'log-6', residentId: 'resident-6', type: 'exit', timestamp: `${today}T09:15:00`, method: 'qr' },
   { id: 'log-7', residentId: 'resident-7', type: 'exit', timestamp: `${today}T09:30:00`, method: 'qr' },
   { id: 'log-8', residentId: 'resident-2', type: 'entry', timestamp: `${today}T14:00:00`, method: 'qr' },
   { id: 'log-9', residentId: 'resident-8', type: 'exit', timestamp: `${today}T08:00:00`, method: 'qr' },
   { id: 'log-10', residentId: 'resident-9', type: 'exit', timestamp: `${today}T07:45:00`, method: 'qr' },
 ];
 
 // Mock Meal Plans
 export const mockMealPlans: MealPlan[] = [
   { id: 'plan-full', name: 'Full Board', description: 'Breakfast, Lunch & Dinner included', mealsIncluded: ['breakfast', 'lunch', 'dinner'], monthlyPrice: 4500, isActive: true },
   { id: 'plan-half', name: 'Half Board', description: 'Breakfast & Dinner included', mealsIncluded: ['breakfast', 'dinner'], monthlyPrice: 3000, isActive: true },
   { id: 'plan-breakfast', name: 'Breakfast Only', description: 'Only breakfast included', mealsIncluded: ['breakfast'], monthlyPrice: 1500, isActive: true },
   { id: 'plan-none', name: 'No Meals', description: 'Opt out of mess facilities', mealsIncluded: [], monthlyPrice: 0, isActive: true },
 ];
 
 // Mock Menu Items (Weekly)
 export const mockMenuItems: MenuItem[] = [
   // Monday
   { id: 'menu-1', name: 'Idli Sambar, Coffee/Tea', mealType: 'breakfast', dayOfWeek: 1, dietaryTags: ['vegetarian'], calories: 350 },
   { id: 'menu-2', name: 'Rice, Dal, Sabzi, Roti, Curd', mealType: 'lunch', dayOfWeek: 1, dietaryTags: ['vegetarian'], calories: 650 },
   { id: 'menu-3', name: 'Chapati, Paneer Curry, Rice, Dal', mealType: 'dinner', dayOfWeek: 1, dietaryTags: ['vegetarian'], calories: 600 },
   // Tuesday
   { id: 'menu-4', name: 'Poha, Chai', mealType: 'breakfast', dayOfWeek: 2, dietaryTags: ['vegetarian'], calories: 300 },
   { id: 'menu-5', name: 'Rice, Sambar, Chicken Curry (Non-Veg)', mealType: 'lunch', dayOfWeek: 2, dietaryTags: ['non-veg'], calories: 700 },
   { id: 'menu-6', name: 'Roti, Mixed Veg, Rice', mealType: 'dinner', dayOfWeek: 2, dietaryTags: ['vegetarian'], calories: 550 },
   // Wednesday
   { id: 'menu-7', name: 'Dosa, Chutney, Sambar', mealType: 'breakfast', dayOfWeek: 3, dietaryTags: ['vegetarian'], calories: 400 },
   { id: 'menu-8', name: 'Biryani (Veg/Non-Veg), Raita', mealType: 'lunch', dayOfWeek: 3, dietaryTags: ['non-veg'], calories: 750 },
   { id: 'menu-9', name: 'Puri, Aloo Sabzi, Rice', mealType: 'dinner', dayOfWeek: 3, dietaryTags: ['vegetarian'], calories: 620 },
 ];
 
 // Mock Meal Attendance
 export const mockMealAttendance: MealAttendance[] = [
   { id: 'att-1', residentId: 'resident-1', date: today, mealType: 'breakfast', attended: true, optedOut: false },
   { id: 'att-2', residentId: 'resident-2', date: today, mealType: 'breakfast', attended: true, optedOut: false },
   { id: 'att-3', residentId: 'resident-3', date: today, mealType: 'breakfast', attended: false, optedOut: true },
   { id: 'att-4', residentId: 'resident-5', date: today, mealType: 'breakfast', attended: true, optedOut: false },
   { id: 'att-5', residentId: 'resident-6', date: today, mealType: 'breakfast', attended: true, optedOut: false },
   { id: 'att-6', residentId: 'resident-7', date: today, mealType: 'breakfast', attended: false, optedOut: false },
   { id: 'att-7', residentId: 'resident-8', date: today, mealType: 'breakfast', attended: true, optedOut: false },
   { id: 'att-8', residentId: 'resident-9', date: today, mealType: 'breakfast', attended: true, optedOut: false },
 ];
 
 // Calculate Dashboard KPIs
 export const mockDashboardKPIs: DashboardKPIs = {
   totalRooms: mockRooms.length,
   occupiedRooms: mockRooms.filter(r => r.status === 'occupied').length,
   availableRooms: mockRooms.filter(r => r.status === 'available').length,
   maintenanceRooms: mockRooms.filter(r => r.status === 'maintenance').length,
   occupancyRate: Math.round((mockRooms.filter(r => r.status === 'occupied').length / mockRooms.length) * 100),
   totalResidents: mockResidents.length,
   pendingPayments: mockPayments.filter(p => p.status === 'pending' && p.type === 'rent').length,
   overduePayments: mockPayments.filter(p => p.status === 'overdue').length,
   monthlyRevenue: mockPayments.filter(p => p.status === 'paid' && p.month === 'February 2024').reduce((sum, p) => sum + p.amount, 0),
   todayEntries: mockEntryLogs.filter(l => l.type === 'entry').length,
   todayExits: mockEntryLogs.filter(l => l.type === 'exit').length,
   mealOptOuts: mockMealAttendance.filter(a => a.optedOut).length,
 };
 
 // Helper to get resident by ID
 export const getResidentById = (id: string): Resident | undefined => {
   return mockResidents.find(r => r.id === id);
 };
 
 // Enrich payments with resident data
 export const getEnrichedPayments = (): Payment[] => {
   return mockPayments.map(p => ({
     ...p,
     resident: getResidentById(p.residentId),
   }));
 };
 
 // Enrich entry logs with resident data
 export const getEnrichedEntryLogs = (): EntryLog[] => {
   return mockEntryLogs.map(l => ({
     ...l,
     resident: getResidentById(l.residentId),
   }));
 };