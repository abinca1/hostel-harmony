 // Core types for the Hostel Management System
 
export type UserRole = 'admin' | 'warden' | 'cook';
 
 export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';
 
 export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';
 
 export type MealType = 'breakfast' | 'lunch' | 'dinner';
 
 export type DietaryTag = 'vegetarian' | 'vegan' | 'non-veg' | 'jain' | 'halal';

export type InventoryCategory =
  | 'grain'
  | 'vegetable'
  | 'fruit'
  | 'dairy'
  | 'spice'
  | 'meat'
  | 'seafood'
  | 'beverage'
  | 'other';
 
 export interface User {
   id: string;
   name: string;
   email: string;
   phone: string;
   role: UserRole;
   avatar?: string;
 }
 
 export interface Hostel {
   id: string;
   name: string;
   address: string;
   blocks: Block[];
 }
 
 export interface Block {
   id: string;
   name: string;
   hostelId: string;
   floors: Floor[];
 }
 
 export interface Floor {
   id: string;
   number: number;
   blockId: string;
   rooms: Room[];
 }
 
 export interface Room {
   id: string;
   number: string;
   floorId: string;
  category: 'single' | 'double' | 'triple' | 'suite' | 'dorm' | 'dormitory';
   status: RoomStatus;
   monthlyRent: number;
   beds: Bed[];
   amenities: string[];
 }
 
 export interface Bed {
   id: string;
   number: string;
   roomId: string;
   residentId?: string;
   resident?: Resident;
 }
 
 export interface Resident {
   id: string;
   name: string;
   email: string;
   phone: string;
   type: 'student' | 'professional';
   organization?: string;
   idType: 'aadhar' | 'passport' | 'college_id' | 'employee_id';
   idNumber: string;
   emergencyContact: {
     name: string;
     phone: string;
     relation: string;
   };
   moveInDate: string;
   moveOutDate?: string;
   roomId: string;
   bedId: string;
   mealPlan?: string;
   dietaryTags: DietaryTag[];
   avatar?: string;
 }
 
 export interface Payment {
   id: string;
   residentId: string;
   resident?: Resident;
   amount: number;
   type: 'rent' | 'security_deposit' | 'mess_fee' | 'late_fee' | 'other';
   status: PaymentStatus;
   dueDate: string;
   paidDate?: string;
   month: string;
   description?: string;
 }
 
 export interface EntryLog {
   id: string;
   residentId: string;
   resident?: Resident;
   type: 'entry' | 'exit';
   timestamp: string;
   method: 'qr' | 'manual';
   verifiedBy?: string;
 }
 
 export interface MealPlan {
   id: string;
   name: string;
   description: string;
   mealsIncluded: MealType[];
   monthlyPrice: number;
   isActive: boolean;
 }
 
 export interface MenuItem {
   id: string;
   name: string;
   mealType: MealType;
   dayOfWeek: number; // 0-6
   dietaryTags: DietaryTag[];
   calories?: number;
 }
 
 export interface MealAttendance {
   id: string;
   residentId: string;
   resident?: Resident;
   date: string;
   mealType: MealType;
   attended: boolean;
   optedOut: boolean;
   markedBy?: string;
 }
 
export interface LeaveRecord {
  id: string;
  residentId: string;
  resident?: Resident;
  startDate: string;
  endDate: string;
  reason?: string;
  markedBy?: string;
  markedAt?: string;
}

 export interface MealFeedback {
   id: string;
   residentId: string;
   date: string;
   mealType: MealType;
   rating: 1 | 2 | 3 | 4 | 5;
   comment?: string;
 }

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  unit: string;
  currentStock: number;
  minStock: number;
  supplier?: string;
  lastUpdated?: string;
}
 
 // Dashboard KPIs
 export interface DashboardKPIs {
   totalRooms: number;
   occupiedRooms: number;
   availableRooms: number;
   maintenanceRooms: number;
   occupancyRate: number;
   totalResidents: number;
   pendingPayments: number;
   overduePayments: number;
   monthlyRevenue: number;
   todayEntries: number;
   todayExits: number;
   mealOptOuts: number;
 }