# Quick Start Guide - Booking System 🚀

## 📍 Access URLs

### Customer-Facing:

- **Landing Page**: `http://localhost:3001/`
- **Booking Form**: `http://localhost:3001/booking`

### Admin Dashboard:

- **All Bookings**: `http://localhost:3001/dashboard/bookings`
- **Booking Detail**: `http://localhost:3001/dashboard/bookings/[id]`

## 🎯 How It Works

### For Customers:

1. **Visit Website** → Click any "Book Appointment" button
2. **Fill Form**:
   - Name, Phone, Email
   - Car Registration
   - Select Services (MOT, Servicing, etc.)
   - Choose Date & Time
   - Add Optional Message
3. **Submit** → Booking saved to database
4. **Confirmation** → Success message displayed

### For Admins:

1. **Log in** → Navigate to `/dashboard/bookings`
2. **View Dashboard**:
   - See statistics (Total, Pending, Confirmed, Completed)
   - Browse all bookings in table
3. **Search & Filter**:
   - Search by name, email, phone, car reg
   - Filter by status or service type
4. **Manage Bookings**:
   - Click "View" on any booking
   - Review all details
   - Update status (Pending → Confirmed → Completed)
   - Contact customer (Call/Email buttons)

## 🎨 Status Workflow

```
New Booking
    ↓
🟡 PENDING (Customer submitted)
    ↓
🔵 CONFIRMED (Admin confirmed appointment)
    ↓
🟢 COMPLETED (Service finished)

OR

🔴 CANCELLED (Booking cancelled)
```

## 📊 Features Overview

### Customer Features:

✅ Easy booking form
✅ Multi-service selection
✅ Date/time picker
✅ Optional message field
✅ Real-time validation
✅ Success confirmation

### Admin Features:

✅ Booking dashboard with stats
✅ Advanced search & filters
✅ Detailed booking view
✅ Status management
✅ Quick contact actions
✅ Real-time updates

## 🔗 Integration Points

### "Book Appointment" Buttons Located At:

1. Hero Section (main CTA)
2. Hero Section (Quick Quote form)
3. Header (sticky button - always visible)
4. About Section ("Schedule Service")
5. Direct Page (`/booking`)

## 📝 Database Schema

```
bookings table:
- id (primary key)
- firstName, lastName
- phone, email
- carReg
- services (array: MOT, Servicing, etc.)
- bookDate, bookTime
- message (optional)
- status (pending/confirmed/completed/cancelled)
- createdAt, updatedAt
```

## 🚀 Test It Now!

### Quick Test Flow:

1. **Create a Booking**:

   ```
   Visit: http://localhost:3001/booking
   Fill form with test data
   Submit booking
   ```

2. **View in Dashboard**:

   ```
   Visit: http://localhost:3001/dashboard/bookings
   See your new booking in the list
   ```

3. **Manage Booking**:
   ```
   Click "View" on the booking
   Change status to "Confirmed"
   Click "Update Status"
   ```

## 📱 API Endpoints Reference

### Create Booking:

```
POST /api/bookings
Body: {firstName, lastName, phone, email, carReg, services[], bookDate, bookTime, message?}
```

### Get All Bookings:

```
GET /api/bookings
Returns: {success: true, bookings: [...]}
```

### Get Single Booking:

```
GET /api/bookings/[id]
Returns: {success: true, booking: {...}}
```

### Update Status:

```
PATCH /api/bookings/[id]
Body: {status: "confirmed"}
```

## 🎉 You're All Set!

Your booking system is fully functional and ready to accept customer appointments!

**Need help?** Check:

- `BOOKING_SYSTEM_IMPLEMENTATION.md` - Complete booking system docs
- `ADMIN_BOOKING_DASHBOARD.md` - Admin dashboard details
- `LANDING_PAGE_REDESIGN.md` - Landing page features

**Happy booking! 🎯✨**
