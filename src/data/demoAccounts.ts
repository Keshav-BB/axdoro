import { User } from '../types';

export const DEMO_USER_CREDENTIALS = {
  name: 'Karthik Subramanian',
  phone: '9840123456',
  email: 'karthik.sub@gmail.com',
  password: 'axdoro2026',
  otp: '123456',
  tier: 'Obsidian VIP (450 Pts)',
};

export const DEMO_ADMIN_CREDENTIALS = {
  name: 'Vikramaditya Seth',
  role: 'Operations & Inventory Director',
  email: 'admin@axdoro.com',
  password: 'axdoroAdmin2026!',
  pin: '9922',
  avatar: 'VS',
};

export const DEMO_USER: User = {
  id: 'usr_849201',
  name: 'Karthik Subramanian',
  phone: '9840123456',
  email: 'karthik.sub@gmail.com',
  avatar: 'KS',
  loyaltyPoints: 450,
  tier: 'Obsidian VIP',
  preferredSize: 'L',
  addresses: [
    {
      id: 'addr_1',
      label: 'Home',
      street: '42, 2nd Main Road, Anna Nagar West',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      isDefault: true,
    },
    {
      id: 'addr_2',
      label: 'Office',
      street: 'Block B, DLF Cybercity, Manapakkam',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600089',
      isDefault: false,
    },
  ],
  joinedDate: 'January 2026',
};
