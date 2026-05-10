# Traveloop Backend - Complete API Specification

## 📋 Current Status

**✅ READY FOR IMPLEMENTATION:**
- PostgreSQL connected via Prisma
- User table created
- Image upload middleware exists
- JWT authentication framework in place

---

## 🎯 Your Tasks (Backend Team)

### **CRITICAL - Must Do First:**

#### 1. **Update Auth Controller to Use Prisma**

**File:** `backend/controllers/authController.js`

Replace mock storage with Prisma queries:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SIGNUP
const register = async (data) => {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        mobileNo: data.mobileNo,
        city: data.city,
        country: data.country,
        dob: data.dob ? new Date(data.dob) : null,
        language: data.language,
        preferredCurrency: data.preferredCurrency,
        profilePhoto: data.profilePhoto
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return without password
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      message: 'User registered successfully',
      data: { token, user: userWithoutPassword }
    };
  } catch (error) {
    return { success: false, message: 'Error registering user', error: error.message };
  }
};

// LOGIN
const login = async (email, password) => {
  try {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      message: 'Login successful',
      data: { token, user: userWithoutPassword }
    };
  } catch (error) {
    return { success: false, message: 'Error logging in', error: error.message };
  }
};

// GET USER
const getMe = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const { password, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword };
  } catch (error) {
    return { success: false, message: 'Error fetching user', error: error.message };
  }
};

module.exports = { register, login, getMe };
```

#### 2. **Make Routes Async**

Update `backend/routes/auth.js`:

```javascript
router.post('/', async (req, res) => {
  const result = await createExpense(req.body, req.userId);
  // ... rest of code
});
```

---

## 📊 Database Models Needed

### **You Need to Add to `prisma/schema.prisma`:**

```prisma
model Trip {
  id              Int       @id @default(autoincrement())
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  
  name            String
  description     String?
  startDate       DateTime
  endDate         DateTime
  totalBudget     Float
  spentAmount     Float     @default(0)
  status          String    @default("planned") // planned, ongoing, completed
  
  stops           Stop[]
  expenses        Expense[]
  activities      Activity[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Stop {
  id              Int       @id @default(autoincrement())
  tripId          Int
  trip            Trip      @relation(fields: [tripId], references: [id], onDelete: Cascade)
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  
  city            String
  country         String?
  arrivalDate     DateTime
  departureDate   DateTime
  accommodation   String?
  notes           String?
  
  activities      Activity[]
  expenses        Expense[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Activity {
  id              Int       @id @default(autoincrement())
  stopId          Int
  stop            Stop      @relation(fields: [stopId], references: [id], onDelete: Cascade)
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  
  name            String
  description     String?
  category        String    // sightseeing, food, adventure, etc
  durationHours   Int       @default(2)
  estimatedCost   Float     @default(0)
  startTime       String?   // 09:00 format
  completed       Boolean   @default(false)
  completedAt     DateTime?
  notes           String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Expense {
  id              Int       @id @default(autoincrement())
  tripId          Int
  trip            Trip      @relation(fields: [tripId], references: [id], onDelete: Cascade)
  stopId          Int?
  stop            Stop?     @relation(fields: [stopId], references: [id], onDelete: SetNull)
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  
  category        String    // transport, accommodation, meals, activities, shopping, other
  amount          Float
  description     String?
  date            DateTime
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### **Update User Model to Have Relations:**

```prisma
model User {
  id                 Int      @id @default(autoincrement())
  firstName          String
  lastName           String
  email              String   @unique
  password           String
  mobileNo           String?
  city               String?
  country            String?
  dob                DateTime?
  language           String?
  preferredCurrency  String?
  profilePhoto       String?
  
  // Add these relations
  trips              Trip[]
  stops              Stop[]
  activities         Activity[]
  expenses           Expense[]
  
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

---

## 🚀 Implementation Steps

1. **Add models to `prisma/schema.prisma`**
2. **Run:** `npx prisma migrate dev --name add_trip_stop_activity_expense`
3. **Update auth controller** to use Prisma instead of mock storage
4. **Update other controllers** (trips, stops, activities, expenses, search) to use Prisma
5. **Test all endpoints** with PostgreSQL

---

## 📦 Install Dependencies

```bash
npm install bcrypt jsonwebtoken
npm install @prisma/client
```

---

## 🔗 API Endpoints (Ready to Implement)

### **Auth (UPDATE to use Prisma):**
- `POST /api/auth/register` - Signup with image upload
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user profile

### **Trips (BUILD with Prisma):**
- `POST /api/trips` - Create trip
- `GET /api/trips` - List user trips
- `GET /api/trips/:id` - Get single trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### **Stops (BUILD with Prisma):**
- `POST /api/stops` - Create stop
- `GET /api/stops?trip_id=X` - Get stops for trip
- `GET /api/stops/:id` - Get single stop
- `PUT /api/stops/:id` - Update stop
- `DELETE /api/stops/:id` - Delete stop

### **Expenses (BUILD with Prisma):**
- `POST /api/expenses` - Create expense
- `GET /api/expenses?trip_id=X` - Get trip expenses
- `GET /api/expenses/:tripId/summary?total_budget=X` - Budget summary
- `PUT /api/expenses/:id` - Update
- `DELETE /api/expenses/:id` - Delete

### **Activities (BUILD with Prisma):**
- `POST /api/extras/activities` - Create activity
- `GET /api/extras/activities?stop_id=X` - Get activities
- `PUT /api/extras/activities/:id` - Update
- `PATCH /api/extras/activities/:id/complete` - Mark complete
- `DELETE /api/extras/activities/:id` - Delete

### **Search (Ready - no DB needed yet):**
- `GET /api/search/cities?q=paris`
- `GET /api/search/cities/:name`
- `GET /api/search/activities?q=hiking`
- `GET /api/search/trending`
- `GET /api/search/recommendations?budget=5000`

---

## 📝 Important Notes

- **ALWAYS hash passwords** with bcrypt before storing
- **NEVER expose passwords** in responses
- **Use Prisma relations** - Don't make manual queries
- **Set up Cascade delete** for data consistency
- **Update timestamps** automatically with @updatedAt

---

## 🎬 Next Session

Once you implement auth with Prisma, the rest (trips, stops, activities, expenses) will follow the same pattern.

**Timeline for hackathon:**
- Day 1: Auth + Trips ✅ (Should be done today)
- Day 2: Stops + Activities + Expenses
- Day 3: Testing + Frontend Integration
- Day 4+: Polish + Bonus features

Good luck! 🚀
