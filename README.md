# Uber Clone App

A mobile taxi booking application built with **React Native** and **Expo**, featuring real-time booking, payments, and location services.

## Features
- User registration and authentication via **Clerk**
- Book rides with real-time location tracking using **Google Maps**
- Payment integration with **Stripe**
- State management with **Zustand**
- Responsive UI styled with **TailwindCSS**
- Backend powered by **PostgreSQL** hosted on **NeonDB**

---

## Technologies Used
- **React Native & Expo** – Mobile app framework
- **PostgreSQL** – Database
- **Clerk** – Authentication
- **Stripe** – Payment gateway
- **Google Maps API** – Location services
- **NeonDB** – Cloud-hosted database
- **TailwindCSS** – UI styling
- **Zustand** – State management

---

## Setup & Installation

### 1. Clone the repository  
```bash
git clone https://github.com/your-username/uber-clone-app.git
cd uber-clone-app
```

### 2. run this command
```bash
npm install
# or
yarn install
```


### 3.Create a .env file in the root of the project with the following keys

```bash
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Database
DATABASE_URL=your_postgresql_database_url

# Server URL
EXPO_PUBLIC_SERVER_URL=https://your-server-url.com/

# Geo location API
EXPO_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key

# Stripe Keys
EXPO_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```
### 3. run the project

```bash
npx expo start
```
