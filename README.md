# MealMatch

## Project Overview

MealMatch is a mobile application project built to support food donation, pickup coordination, and access to available meals. The project includes a mobile frontend created with React Native and Expo, Firebase Authentication for Google Sign-In, and map/location planning using OpenStreetMap.

The main goal of the application is to provide a clean mobile interface where different users can access different parts of the system, including students, food donors, volunteers, and distributors.

My main contribution focused on the mobile/frontend side of the project, including UI implementation, navigation, authentication setup, map feature planning, testing, documentation, and deployment preparation.



## Technologies Used

- React Native
- Expo
- Expo Router
- TypeScript
- Firebase Authentication
- Google Sign-In
- Node.js
- npm
- Lucide React Native Icons
- React Query
- OpenStreetMap / map API planning



## Main Features

- Role-based entry screen
- Student and food donor sign-up flow
- Google authentication using Firebase
- Home screen with restaurant and meal listings
- Restaurant details screen
- Food donation form
- Profile screen
- Sign-out functionality
- Map-related pickup location feature
- Mobile design aligned with the website version
- Mock data structure for frontend testing
- App Store deployment preparation



## Project Structure

```text
mealmatch/

app/
  (tabs)/
    donate/
      _layout.tsx
      index.tsx
    home/
      _layout.tsx
      index.tsx
      details.tsx
    map/
      _layout.tsx
      index.tsx
    profile/
      _layout.tsx
      index.tsx
    _layout.tsx

  +native-intent.tsx
  +not-found.tsx
  _layout.tsx
  index.tsx
  sign-in.tsx

assets/
  images/
    adaptive-icon.png
    favicon.png
    icon.png
    splash-icon.png

constants/
  colors.ts

lib/
  firebase.ts

mocks/
  restaurants.ts

types/
  index.ts

.gitignore
app.json
babel.config.js
metro.config.js
package.json
tsconfig.json
eslint.config.js
```

### Folder Descriptions

**`app/`**
Contains the main application screens and routing structure. This project uses Expo Router, so routes are created based on the file and folder structure.

**`app/(tabs)/`**
Contains the main tab-based navigation sections:

- home
- map
- donate
- profile

**`constants/`**
Contains reusable constants such as the global color theme.

**`lib/`**
Contains Firebase setup and authentication configuration.

**`mocks/`**
Contains mock restaurant and meal data used for frontend development and testing.

**`types/`**
Contains TypeScript interfaces for application data such as restaurants, meals, donation forms, and user roles.

**`assets/`**
Contains app images, icons, and splash assets.



## Requirements

Before running the project, make sure these are installed:

- Node.js
- npm
- VS Code or another code editor
- Expo Go app, if testing on a phone
-  Press `i` to open iOS Simulator (macOS only, requires Xcode)

Check Node and npm:

```bash
node -v
npm -v
```



## Installation

### 1. Open the project folder

Example path:

```bash
cd C:\Users\purku\OneDrive\Desktop\mealmatch
```

Make sure the folder contains:

- package.json
- app/
- assets/
- constants/
- mocks/
- types/

### 2. Install dependencies

Because this project may have peer dependency conflicts, use:

```bash
npm install --legacy-peer-deps
```

### 3. Start the Expo development server

```bash
npx expo start
```

### 4. Run the app

After Expo starts:

- Press `w` to open the app in a web browser
- Scan the QR code with Expo Go to run on a phone
- Press `a` to open Android emulator, if configured

If there are cache issues, run:

```bash
npx expo start --clear
```



## Firebase Authentication Setup

This project uses Firebase Authentication for Google Sign-In.

### Firebase setup steps

1. Go to Firebase Console
2. Create or select a Firebase project
3. Register a Web App
4. Copy the Firebase configuration
5. Enable Google Sign-In under Authentication
6. Add the Firebase config into `lib/firebase.ts`

Example structure:

```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
```

### Authentication Notes

The authentication system uses Google Sign-In through Firebase Authentication.

Originally, the plan was to restrict student sign-ups to `.edu` email addresses only. Later, the project pivoted to allow all email addresses, including `.edu` emails, to make the sign-up process more flexible for different user types such as students, food donors, volunteers, and community members.



## Map / Location Feature

This project uses **OpenStreetMap** instead of Google Maps for map-related planning and location features.

OpenStreetMap was used because it is open-source and provides flexible map data that can support pickup-location visualization and future routing features.

The map-related feature displays restaurant pickup locations and pickup status information, helping users and volunteers understand where food pickup locations are located.

### Future map improvements could include:

- Displaying live pickup locations
- Showing restaurant and volunteer locations on the map
- Converting addresses into coordinates using geocoding
- Calculating pickup routes
- Estimating travel distance and time
- Improving delivery or pickup tracking



## Important Screens

### Role Selection Screen
The role selection screen is the entry point of the app. It allows users to choose the type of user they are.

### Home Screen
The home screen displays restaurant and meal information using mock data.

### Restaurant Details Screen
The restaurant details screen shows more specific information about available meals, including descriptions, tags, allergens, and quantities.

### Donate Screen
The donate screen contains a form where food donors can enter food donation details.

### Map Screen
The map screen displays pickup-related location information and pickup status.

### Profile Screen
The profile screen displays user-related information and includes sign-out functionality.



## Mock Data

The project currently uses mock restaurant and meal data from:

```
mocks/restaurants.ts
```

This mock data was used to build and test the frontend before full backend connection.



## TypeScript Types

The TypeScript interfaces are stored in:

```
types/index.ts
```

These types define the structure of data such as:

- Restaurant
- Meal
- DonationForm
- UserRole

Using TypeScript helps keep the project organized and reduces errors during development.



## Deployment Preparation

The project was prepared for possible App Store deployment using Expo/EAS concepts.

Deployment preparation included:

- Reviewing Expo EAS build process
- Checking app configuration files
- Understanding iOS build requirements
- Reviewing App Store submission steps
- Preparing the app structure for future production builds

The app was not fully deployed to the App Store, but the deployment process was reviewed and prepared for future work.



## Common Commands

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the project:

```bash
npx expo start
```

Start with cleared cache:

```bash
npx expo start --clear
```

Run in web browser:

```bash
npx expo start
```

Then press:

```
w
```



## Troubleshooting

### npm dependency conflict

If npm gives dependency conflict errors, use:

```bash
npm install --legacy-peer-deps
```

### Expo cache issues

If the app does not update correctly or gives cache-related errors, run:

```bash
npx expo start --clear
```

### Wrong folder error

If Expo says it cannot find `package.json`, make sure you are inside the project folder:

```bash
cd C:\Users\purku\OneDrive\Desktop\mealmatch
```

Then run:

```bash
dir
```

You should see `package.json`.

### PowerShell script error

If PowerShell blocks npm or npx scripts, run PowerShell as administrator and use:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then close and reopen the terminal.



## Team Contribution Clarification

- **Patrick** worked on the backend implementation.
- **George** worked on the main website structure and skeleton.
- My work focused mainly on the **mobile-frontend** side, including React Native screens, navigation, UI design, Firebase authentication setup, map feature planning, testing, documentation, and deployment preparation.
- My website contribution focused mainly on design improvements, CSS styling, and UI consistency.



## AI Assistance Statement

AI was used as a development assistant during this project.

AI helped with:

- Fixing npm dependency conflicts
- Explaining Expo Router navigation
- Debugging terminal errors
- Structuring React Native components
- Understanding TypeScript types
- Creating sample UI layout ideas

The final implementation, project organization, testing, and integration were completed by me.



## Future Improvements

Possible future improvements include:

- Full backend integration
- Live restaurant and meal data
- Real-time pickup status updates
- Improved authentication roles
- OpenStreetMap-based routing
- Address autocomplete and geocoding
- Push notifications
- Full App Store deployment
- Better volunteer pickup tracking



## Author

**Aakrit Purkuti**
Computer Science
SUNY Plattsburgh
