# Service & Job Records Management - Documentation

## Overview

The Service Records Management system is a comprehensive feature for garage staff/admin to log, track, and manage all service and job records. This system provides quick entry, easy lookup, and detailed record keeping for vehicle maintenance and repairs.

## Features Implemented

### 1. **Database Schema**

- **Table:** `service_records`
- **Fields:**
  - `id` - Auto-incrementing primary key
  - `team_id` - Foreign key to teams table
  - `vehicle_reg` - Vehicle registration number (VARCHAR 20)
  - `service_type` - Type of service performed (VARCHAR 50)
  - `mileage` - Vehicle mileage at service time (INTEGER)
  - `labour_hours` - Hours spent on the job (INTEGER)
  - `parts_used` - Array of parts used (JSONB)
  - `notes` - Service notes and diagnosis (TEXT)
  - `media_files` - Array of uploaded media URLs (JSONB)
  - `status` - Service status (default: "completed")
  - `created_by` - Foreign key to users table
  - `created_at` - Timestamp
  - `updated_at` - Timestamp

### 2. **API Endpoints**

#### GET `/api/service-records`

- **Description:** Fetch all service records for the current team
- **Query Parameters:**
  - `vehicleReg` - Filter by vehicle registration
  - `serviceType` - Filter by service type
- **Authentication:** Required
- **Returns:** Array of service records

#### POST `/api/service-records`

- **Description:** Create a new service record
- **Authentication:** Required
- **Body:**
  ```json
  {
    "vehicleReg": "AB12 CDE",
    "serviceType": "MOT",
    "mileage": 45000,
    "labourHours": 2,
    "partsUsed": ["Oil Filter", "Brake Pads"],
    "notes": "Replaced brake pads and oil filter",
    "status": "completed"
  }
  ```
- **Returns:** Created service record

#### GET `/api/service-records/[id]`

- **Description:** Fetch a single service record
- **Authentication:** Required
- **Returns:** Service record details

#### PUT `/api/service-records/[id]`

- **Description:** Update an existing service record
- **Authentication:** Required
- **Body:** Same as POST
- **Returns:** Updated service record

#### DELETE `/api/service-records/[id]`

- **Description:** Delete a service record
- **Authentication:** Required
- **Returns:** Success message

### 3. **Frontend Pages**

#### Service Records List (`/dashboard/service-records`)

- **Features:**
  - Search by vehicle registration or service type
  - Filter by service type (MOT, Full Service, Oil Change, Brake Repair, Custom)
  - Responsive table with:
    - Date
    - Vehicle Registration
    - Service Type
    - Mileage
    - Labour Hours
    - Status badge
    - Action buttons (View, Edit, Delete)
  - "Add New Record" button
  - Real-time data fetching with SWR

#### Add Service Record (`/dashboard/service-records/add`)

- **Features:**
  - Clean, vertical form layout
  - Section headers with dividers
  - Required fields: Vehicle Reg, Service Type
  - Optional fields: Mileage, Labour Hours
  - Parts Used:
    - Add multiple parts dynamically
    - Visual chips showing added parts
    - Remove parts individually
  - Notes textarea for diagnosis
  - Form validation
  - Loading states
  - Cancel and Submit buttons

#### Edit Service Record (`/dashboard/service-records/edit/[id]`)

- **Features:**
  - Pre-populated form with existing data
  - Same layout and features as Add page
  - Update functionality
  - Loading states

#### Service Record Detail (`/dashboard/service-records/[id]`)

- **Features:**
  - Gradient header with vehicle reg and service type
  - Status badge
  - Info cards showing:
    - Date
    - Mileage
    - Labour Hours
    - Service Type
  - Parts Used section (if applicable)
  - Notes & Diagnosis section (if applicable)
  - Record metadata (created/updated timestamps)
  - Edit and Delete buttons
  - Back navigation

### 4. **UI/UX Design**

#### Styling Approach

- **Color Scheme:** Orange theme from main TypeScript Vala project
- **Components:** Shadcn/ui components styled with Tailwind CSS
- **Forms:** Vertical layout with clear section headers
- **Tables:** Clean, responsive design with hover effects
- **Buttons:** Color-coded actions:
  - Orange: Primary actions (Add, Update)
  - Blue: View actions
  - Red: Delete actions
  - Gray: Cancel/Back actions
- **Badges:** Status indicators with color coding
- **Cards:** Clean white cards with subtle borders

#### Responsive Design

- Mobile-friendly layouts
- Responsive tables with horizontal scrolling
- Collapsible filters on mobile
- Touch-friendly button sizes

### 5. **Navigation**

- **Sidebar:** Added "Service Records" menu item with Wrench icon
- **Position:** Between "Customers" and "Security"
- **Icon:** `<Wrench />` from lucide-react

## Admin Workflow

### 1. **Creating a Service Record**

1. Navigate to Service Records from sidebar
2. Click "Add New Record" button
3. Fill in vehicle registration (required)
4. Select service type (required)
5. Optionally add mileage and labour hours
6. Add parts used (optional)
7. Add notes/diagnosis (optional)
8. Click "Create Service Record"
9. Redirected to Service Records list

### 2. **Viewing Service Records**

1. Navigate to Service Records
2. Use search to filter by vehicle reg or service type
3. Use service type filter buttons
4. Click eye icon to view details
5. See comprehensive record information

### 3. **Editing Service Records**

1. From list or detail view, click Edit button
2. Modify any fields as needed
3. Add/remove parts
4. Update notes
5. Click "Update Service Record"
6. Redirected to detail view

### 4. **Deleting Service Records**

1. From list or detail view, click Delete button
2. Confirm deletion in dialog
3. Record permanently deleted
4. Redirected to list (if from detail view)

### 5. **Searching Records**

- **By Vehicle Reg:** Type registration number in search
- **By Service Type:** Click filter buttons
- **Combined:** Use both search and filters together

## Technical Implementation

### State Management

- **SWR:** For data fetching and caching
- **React State:** For form inputs and local UI state

### Data Validation

- Required fields enforced with HTML5 validation
- Server-side validation in API routes
- Type safety with TypeScript

### Error Handling

- Try-catch blocks in API routes
- User-friendly error messages
- Loading states during async operations

### Authentication

- All API routes protected with `getUser()` and `getTeamForUser()`
- Team-based data isolation
- User-specific record tracking (createdBy field)

## Database Migration

The service_records table was created with the following migration:

```bash
npm run db:generate  # Generated migration file
npm run db:migrate   # Applied to database
```

Migration file: `lib/db/migrations/0003_sudden_dragon_lord.sql`

## Service Types Supported

1. **MOT** - Ministry of Transport test
2. **Full Service** - Comprehensive vehicle service
3. **Oil Change** - Oil and filter replacement
4. **Brake Repair** - Brake system maintenance
5. **Custom** - Any other service type

## Future Enhancements (Not Yet Implemented)

### File Upload Support

- Upload photos/videos of vehicle/work
- Store in Supabase Storage or AWS S3
- Display media in detail view
- Gallery component for multiple images

### Additional Features

- Export records to PDF
- Email reports to customers
- Service history timeline
- Cost tracking and invoicing
- Reminder system for future services
- Print functionality
- Bulk operations
- Advanced filtering and sorting

## File Structure

```
app/
├── (dashboard)/
│   └── dashboard/
│       └── service-records/
│           ├── page.tsx                    # List view
│           ├── add/
│           │   └── page.tsx                # Add form
│           ├── edit/
│           │   └── [id]/
│           │       └── page.tsx            # Edit form
│           └── [id]/
│               └── page.tsx                # Detail view
├── api/
│   └── service-records/
│       ├── route.ts                        # GET all, POST
│       └── [id]/
│           └── route.ts                    # GET one, PUT, DELETE
components/
└── dashboard/
    └── Sidebar.tsx                         # Updated with menu item
lib/
└── db/
    ├── schema.ts                           # Updated with serviceRecords table
    └── migrations/
        └── 0003_sudden_dragon_lord.sql     # Migration file
```

## Dependencies Used

- **Next.js** - Framework
- **React** - UI library
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **SWR** - Data fetching
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Lucide React** - Icons
- **TypeScript** - Type safety

## Notes for Developers

1. **Team Isolation:** All queries filter by teamId to ensure data privacy
2. **Real-time Updates:** SWR automatically revalidates data on focus/reconnect
3. **Type Safety:** All database types are inferred from Drizzle schema
4. **Responsive Design:** All pages work on mobile, tablet, and desktop
5. **Accessibility:** Semantic HTML and ARIA labels where needed
6. **Performance:** Efficient queries with proper indexing (teamId foreign key)

## Conclusion

The Service Records Management system provides a complete solution for garage staff to efficiently manage service records with a clean, intuitive interface that matches the overall application design. The system is production-ready and can be extended with additional features as needed.
