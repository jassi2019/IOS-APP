# Razorpay Configuration Guide

## ⚠️ Important: You Need Both Keys

You provided: `rzp_live_RhvQOAzK6nNUQm` (this is the **Key ID**)

You also need: **Razorpay Secret Key** (usually starts with a different format)

To find your Razorpay secret key:
1. Go to https://dashboard.razorpay.com/
2. Navigate to Settings → API Keys
3. You'll see both:
   - **Key ID**: `rzp_live_RhvQOAzK6nNUQm` ✅ (you have this)
   - **Key Secret**: `[HIDDEN - Click to reveal]` ❌ (you need this)

---

## 📝 Manual Configuration Steps

### **1. Mobile App Configuration**

**File:** `mobile-app-main/.env`

**Add/Update these lines:**
```env
# Backend API URL
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.4:8000

# Razorpay Configuration
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RhvQOAzK6nNUQm
```

**Note:** Mobile app only needs the Key ID, not the secret.

---

### **2. Backend Configuration**

**File:** `backend-main/.env`

**Add/Update these lines:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=education_app

# JWT Secret (IMPORTANT: Change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_RhvQOAzK6nNUQm
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE

# SMTP Configuration (Optional - for email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@educationapp.com
SMTP_SECURE=false
DEVELOPER_EMAILS=dev@example.com

# Swagger Configuration
SWAGGER_HOST=localhost:8000

# Canva Integration (Optional)
CANVA_AUTH_REDIRECT_URI=http://localhost:8000/api/v1/canva/callback
CANVA_CLIENT_ID=your_canva_client_id
CANVA_CLIENT_SECRET=your_canva_client_secret
CANVA_AUTHORIZED_PERSON_EMAIL=admin@example.com

# Environment
NODE_ENV=development
```

**Replace:**
- `YOUR_SECRET_KEY_HERE` with your actual Razorpay secret key
- `your-super-secret-jwt-key-change-this-in-production-12345` with a secure random string

---

## 🔐 Security Notes

### **IMPORTANT: You're Using LIVE Keys!**

The key `rzp_live_RhvQOAzK6nNUQm` is a **LIVE** Razorpay key, which means:
- ✅ Real payments will be processed
- ⚠️ Real money will be charged to customers
- ⚠️ You'll be charged Razorpay fees on transactions

### **Recommendation for Development:**

Use **TEST keys** instead for development:
- Test keys start with `rzp_test_`
- No real money is charged
- Safe for testing

To get test keys:
1. Go to Razorpay Dashboard
2. Switch to "Test Mode" (toggle at top)
3. Go to Settings → API Keys
4. Use the test keys for development

---

## ✅ Verification Steps

After adding the keys:

### **1. Verify Backend:**
```bash
cd backend-main
npm start
```

You should see:
```
✅ Razorpay initialized successfully
Server is running on port 8000 and accessible from network
```

### **2. Verify Mobile App:**

The Razorpay key will be used when users try to make payments in the app.

---

## 🚨 Troubleshooting

### **If Backend Shows Razorpay Error:**
- Check that both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are in `backend-main/.env`
- Make sure there are no extra spaces or quotes around the values
- Restart the backend server after updating `.env`

### **If Payments Don't Work in App:**
- Check that `EXPO_PUBLIC_RAZORPAY_KEY_ID` is in `mobile-app-main/.env`
- Restart Expo with `npx expo start --clear`
- Check console logs for Razorpay errors

---

## 📋 Complete Checklist

- [ ] Get Razorpay secret key from dashboard
- [ ] Update `mobile-app-main/.env` with Key ID
- [ ] Update `mobile-app-main/.env` with backend URL (port 8000)
- [ ] Update `backend-main/.env` with both Key ID and Secret
- [ ] Update `backend-main/.env` with JWT_SECRET
- [ ] Update `backend-main/.env` with database credentials
- [ ] Start PostgreSQL database
- [ ] Start backend server
- [ ] Restart Expo app
- [ ] Test payment flow

---

## 🔗 Useful Links

- Razorpay Dashboard: https://dashboard.razorpay.com/
- Razorpay API Docs: https://razorpay.com/docs/api/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/
