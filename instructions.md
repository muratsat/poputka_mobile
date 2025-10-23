## 1. Authentication Screen

**Purpose:** Secure user authentication using phone number and SMS verification.

**Flow:**

- **Step 1 - Phone Entry:** Users enter their phone number in international format. The screen features the RideShare branding with a combined car and users icon, establishing the dual-purpose nature of the app. A clean card interface prompts users to enter their phone number to receive a verification code.
- **Step 2 - Code Verification:** After submitting their phone number, users receive an SMS code and enter the 6-digit numeric verification code. The interface shows which phone number the code was sent to and provides a "Back" button to return to phone entry if needed.

**Design Features:** Gradient background from primary color to base, centered layout optimized for mobile, large touch-friendly buttons, and clear visual hierarchy with card-based UI.

---

## 2. Home Screen

**Purpose:** Browse and discover available trips from both drivers and passengers.

**Key Features:**

- **Search Functionality:** Real-time search bar to filter trips by city names in origin or destination
- **Filter Tabs:** Three-way filter to view "All" trips, "Drivers" only, or "Passengers" only
- **Trip Cards:** Compact horizontal layout displaying:

- Role badge (Driver/Passenger) with user name
- Price prominently displayed on the right
- Route with origin → destination using arrow icon
- Date, time, and available seats in a single line
- Car information (for driver trips)
- "Call driver/passenger" action button

**Design Features:** Sticky header for persistent search and filters, card-based layout with clear visual hierarchy, color-coded badges (primary for drivers, secondary for passengers), and accent color highlights for important information like price and location pins.

---

## 3. Create Trip Screen

**Purpose:** Multi-step form wizard for creating new trip postings.

**4-Step Flow:**

**Step 1 - Role Selection:**

- Choose between "I'm a driver" (offering rides) or "I'm a passenger" (looking for rides)
- Large, touch-friendly radio button cards with descriptions
- Visual feedback with border highlighting on selection

**Step 2 - Route Information:**

- Origin city/state input
- Destination city/state input
- Simple two-field form for quick entry

**Step 3 - Trip Details:**

- Departure date
- Departure time
- Number of seats available/needed
- Price per seat

**Step 4 - Additional Information:**

- For drivers: Car information and car year (optional)
- For all users: Additional comments textarea for extra details
- Final review before submission

**Design Features:** Progress indicator showing current step (1-4), contextual back button, validation preventing progression without required fields, step-specific titles and descriptions, and a final "Create trip" button with checkmark icon.

---

## 4. My Trips Screen

**Purpose:** Manage and view all user's trips across different statuses.

**Key Features:**

- **Status Filters:** Four-tab system to view Active, Done , Cancelled, or All trips
- **Trip Management:** Each trip card includes:

- Role and status badges with color coding (accent for active, primary for completed, destructive for cancelled)
- Full route information with separate origin and destination lines
- Date, time, seats, and price details
- Three-dot menu for actions (View details, Edit trip, Cancel trip)

**Trip Card Layout:**

- Vertical layout showing complete trip information
- Status-based color coding for quick visual scanning
- Contextual actions based on trip status (active trips can be edited/cancelled)
- Car information displayed for driver trips

**Design Features:** Sticky header with filter tabs, color-coded status badges for instant recognition, dropdown menu for trip actions, and empty state messaging when no trips match filters.

---

## 5. Profile Screen

**Purpose:** User profile management and app settings.

**Sections:**

**User Info Card:**

- Large avatar with initials
- User name and phone number
- Star rating with review count
- Professional presentation of user credentials

**Statistics Grid:**

- Three-column layout showing:

- Trips as driver (primary color)
- Trips as passenger (accent color)
- Total trips

- Quick overview of user activity

**Menu Options:**

- Edit profile
- My vehicles (for managing car information)
- Saved locations (for quick trip creation)
- Settings (app preferences)
- Log out button (prominent, outlined)

**Design Features:** Card-based sections with clear separation, icon-driven menu items for easy scanning, statistics presented in a grid for quick comprehension, and consistent spacing and typography throughout.

---

## Navigation Structure

The app uses a **bottom tab navigation** with four main sections:

1. **Home** (house icon) - Browse trips
2. **My Trips** (list icon) - Manage your trips
3. **Create** (plus icon, rightmost position) - Create new trip
4. **Profile** (user icon) - User settings and info

All screens use **100dvh** for optimal mobile viewport handling, ensuring the interface adapts properly to different mobile browsers and devices with dynamic toolbars.
