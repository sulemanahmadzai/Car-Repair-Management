# Service Records - Auto-Fetch Customer Details

## Overview

Enhanced the service records system to automatically fetch and display customer information when a vehicle registration number is entered. This improves the admin workflow by showing relevant customer and vehicle details instantly.

## Implementation Summary

### 1. New API Endpoint ✓

**File:** `/app/api/customers/by-registration/route.ts`

Created a new GET endpoint to fetch customer details by vehicle registration number:

- **Endpoint:** `/api/customers/by-registration?registrationNumber={reg}`
- **Method:** GET
- **Authentication:** Required
- **Team Isolation:** Only returns customers from the user's team
- **Case Insensitive:** Automatically converts registration to uppercase

**Response:**

```json
{
  "customer": {
    "id": 1,
    "name": "John Doe",
    "mobileNumber": "1234567890",
    "make": "Toyota",
    "model": "Camry",
    "colour": "Blue",
    "fuelType": "Petrol",
    "motExpiry": "2025-12-31",
    "taxDueDate": "2025-11-30"
  },
  "found": true
}
```

### 2. Add Service Record Page ✓

**File:** `/app/(dashboard)/dashboard/service-records/add/page.tsx`

**Features Added:**

1. **Debounced Auto-Fetch**

   - Automatically fetches customer data 500ms after typing stops
   - Only triggers when registration number is 3+ characters
   - Shows loading spinner while fetching

2. **Customer Found Display**

   - Green success card with checkmark icon
   - Shows all available customer information:
     - Customer Name
     - Mobile Number
     - Vehicle Make
     - Vehicle Model
     - Colour
     - Fuel Type
     - MOT Expiry
     - Tax Due Date
   - Only displays fields that have data (optional fields)

3. **Customer Not Found Display**
   - Red alert card with warning icon
   - Clear message: "Customer Not Found"
   - Helper text: "No customer exists with this registration number. Please add the customer first."
   - Quick action button: "Go to Customers" - redirects to customer management page

### 3. Edit Service Record Page ✓

**File:** `/app/(dashboard)/dashboard/service-records/edit/[id]/page.tsx`

Applied the same auto-fetch functionality to the edit page:

- Same debounced fetching behavior
- Same customer found/not found displays
- Allows admin to verify customer details when editing existing records

## User Experience Flow

### Happy Path (Customer Exists)

1. Admin navigates to Add/Edit Service Record
2. Admin types vehicle registration number (e.g., "AB12CDE")
3. After 500ms pause, system automatically searches for customer
4. Loading spinner appears briefly
5. Green success card displays with customer details:
   - Name, Mobile, Make, Model, Colour, Fuel Type, MOT, Tax dates
6. Admin continues filling out the service record form

### Alternative Path (Customer Doesn't Exist)

1. Admin navigates to Add/Edit Service Record
2. Admin types vehicle registration number
3. After 500ms pause, system searches
4. Red alert card appears
5. Message shows: "Customer Not Found"
6. Admin has two options:
   - Click "Go to Customers" button to add the customer first
   - Cancel and add customer before creating service record

## Technical Details

### State Management

- `fetchingCustomer`: Boolean - shows loading state
- `customerData`: Object | null - stores fetched customer data
- `customerNotFound`: Boolean - triggers not found alert

### Debouncing

- 500ms delay prevents excessive API calls
- Cleanup function ensures only the latest request is processed
- Improves performance and user experience

### UI Components

- **Icons Used:**
  - `Loader2` - spinning loader during fetch
  - `CheckCircle` - success indicator
  - `AlertCircle` - warning indicator

### Styling

- Green theme for success (bg-green-50, border-green-200)
- Red theme for errors (bg-red-50, border-red-200)
- Consistent with orange primary theme
- Responsive grid layout for customer details

## Benefits

1. **Faster Workflow**: Admin doesn't need to manually look up customer details
2. **Reduced Errors**: Ensures customer exists before creating service records
3. **Better UX**: Clear visual feedback (loading, success, error states)
4. **Data Integrity**: Validates customer existence in real-time
5. **Easy Navigation**: Quick link to add missing customers

## Future Enhancements (Optional)

- Auto-populate mileage from last service record
- Show customer service history in the card
- Add option to create customer inline without leaving the page
- Cache recent customer lookups for faster subsequent searches

## Testing Checklist

- [ ] Enter valid registration - customer details display
- [ ] Enter invalid registration - not found message displays
- [ ] Loading spinner appears during fetch
- [ ] Debouncing works (no fetch on every keystroke)
- [ ] "Go to Customers" button navigates correctly
- [ ] Works on both Add and Edit pages
- [ ] Responsive on mobile devices
- [ ] Case-insensitive search (AB12CDE = ab12cde)
