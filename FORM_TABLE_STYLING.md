# Form & Table Styling Guide

This document describes the MUI-inspired form and table styling applied to the Customer Management page, matching the styling from the "main Typescript vala" admin template.

## Customer Form Styling

### Visual Enhancements

1. **Card Header**

   - Gradient background from primary to secondary color
   - Bold title with primary color
   - Border bottom for separation

2. **Section Headers**

   - Vertical accent line (primary for customer info, secondary for vehicle info)
   - Increased spacing and visual hierarchy

3. **Form Fields**

   - Consistent spacing with `gap-6`
   - Labels with required field indicators (red asterisk)
   - Custom focus states with primary color ring
   - Date picker inputs for MOT and Tax dates

4. **Auto-fill Button**

   - Search icon with compact "Auto-fill" label
   - Primary color outline style
   - Positioned inline with registration field

5. **Grid Layout**
   - 2 columns on medium screens for customer info
   - 3 columns on large screens for vehicle details
   - Fully responsive with mobile stacking

### Color Usage

```tsx
// Header gradient
className =
  "bg-gradient-to-r from-[hsl(var(--primary-light))] to-[hsl(var(--secondary-light))]";

// Required field asterisk
className = "text-[hsl(var(--error))]";

// Input focus state
className =
  "focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]";

// Primary button
className = "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/90]";
```

## Customer Table Styling

### Layout & Structure

1. **Table Header**

   - Search bar with icon
   - Filter button
   - Responsive layout (stacks on mobile)

2. **Table Head**

   - Light grey background `bg-[hsl(var(--grey-100))]`
   - Bold, semibold column headers
   - Organized columns:
     - Customer (with avatar)
     - Contact (phone & address)
     - Vehicle (registration & make/model)
     - Details (colour & fuel)
     - Status (MOT & Tax badges)
     - Actions (Edit & Delete)

3. **Table Body**
   - Row hover effect with grey background
   - Smooth transitions
   - Divider lines between rows

### Row Content

#### Customer Column

- **Avatar**: Circular gradient background with initial
- **Name**: Bold, primary font
- **Email**: Smaller, muted text below

```tsx
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white font-semibold">
  {customer.name.charAt(0).toUpperCase()}
</div>
```

#### Vehicle Column

- **Registration**: Monospace font in primary color
- **Make/Model**: Muted text

```tsx
<p className="font-mono font-semibold text-sm text-[hsl(var(--primary))]">
  {customer.registrationNumber}
</p>
```

#### Status Column

- **MOT Badge**:
  - Red (error) if expired
  - Green (success) if valid
- **Tax Badge**:
  - Orange (warning) if overdue
  - Blue (info) if valid

```tsx
<Badge
  variant="outline"
  className={`text-xs ${
    motExpired
      ? 'border-[hsl(var(--error))] text-[hsl(var(--error))] bg-[hsl(var(--error-light))]"'
      : 'border-[hsl(var(--success))] text-[hsl(var(--success))] bg-[hsl(var(--success-light))]"'
  }`}
>
  MOT: {customer.motExpiry}
</Badge>
```

#### Action Buttons

- **Edit**: Primary color outline with icon
- **Delete**: Error color outline with icon
- Icon-only buttons for compact display

### Features

1. **Search Functionality**

   - Live filtering by name, registration, email, or phone
   - Search icon positioned in input
   - Muted background for search field

2. **Status Indicators**

   - Color-coded badges for MOT and Tax
   - Automatic expiry detection
   - Visual warnings for overdue items

3. **Responsive Design**
   - Horizontal scrolling on small screens
   - Flexible column widths
   - Stacked form fields on mobile

## Components Used

### New Components

- `Badge` (created): Status indicators with color variants

### Enhanced Components

- `CustomerForm`: Gradient header, section dividers, better spacing
- `CustomersPage`: Search bar, filtered results, enhanced table

### UI Components

- `Card`, `CardHeader`, `CardContent`
- `Input` with search functionality
- `Button` with icon variants
- `Label` with required indicators
- `Badge` for status display

## Color Scheme Integration

The form and table fully integrate with the MUI-inspired color palette:

| Use Case           | Color Variable                         | Example                    |
| ------------------ | -------------------------------------- | -------------------------- |
| Primary actions    | `--primary`                            | Edit button, links         |
| Status success     | `--success`                            | Valid MOT                  |
| Status error       | `--error`                              | Expired MOT, Delete button |
| Status warning     | `--warning`                            | Overdue tax                |
| Status info        | `--info`                               | Valid tax                  |
| Background accents | `--primary-light`, `--secondary-light` | Form header gradient       |

## Before & After

### Before

- Basic table with minimal styling
- Plain form with standard inputs
- No visual hierarchy
- Limited status information
- Basic buttons without icons

### After

- Professional table with avatars and badges
- Enhanced form with gradient header and section dividers
- Clear visual hierarchy with color-coded elements
- Rich status indicators with expiry detection
- Icon buttons for better UX
- Search and filter capabilities
- Smooth hover effects and transitions

## Usage Example

```tsx
import { CustomerForm } from "@/components/customer-form";

// In your page
<CustomerForm
  onSuccess={handleSuccess}
  editData={editingCustomer}
  onCancel={handleCancel}
/>;
```

The form automatically applies MUI-inspired styling and validates required fields.

## Future Enhancements

1. **Sorting**: Add column sorting functionality
2. **Pagination**: Implement table pagination for large datasets
3. **Bulk Actions**: Select multiple customers for batch operations
4. **Export**: CSV/PDF export functionality
5. **Advanced Filters**: Filter by vehicle make, expiry dates, etc.
6. **Inline Editing**: Quick edit directly in table cells
7. **Activity Log**: Show recent customer interactions

## Files Modified

```
Fiver 250$/saas-starter/
├── app/(dashboard)/dashboard/customers/page.tsx (Enhanced)
├── components/
│   ├── customer-form.tsx (Redesigned)
│   └── ui/
│       └── badge.tsx (New)
```

All changes maintain compatibility with existing functionality while dramatically improving the visual presentation to match the MUI admin template quality.
