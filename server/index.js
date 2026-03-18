const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')
require('express-async-errors')

const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const { autoSeed } = require('./utils/autoSeed')

const authRoutes    = require('./routes/auth')
const reportRoutes  = require('./routes/report')
const challanRoutes = require('./routes/challan')
const detectRoutes  = require('./routes/detect')
const statsRoutes   = require('./routes/stats')

const app = express()

// Connect DB then auto seed demo users
connectDB().then(() => autoSeed())

// 🔥 DEBUG (optional - dekh lena logs me)
console.log("CLIENT_URL:", process.env.CLIENT_URL)

// ✅ CORS FIX (FINAL)
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

// ✅ Preflight fix
app.options("*", cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Snap & Report API running!', version: '2.0.0' })
})

// Routes
app.use('/api/auth',     authRoutes)
app.use('/api/reports',  reportRoutes)
app.use('/api/challans', challanRoutes)
app.use('/api/detect',   detectRoutes)
app.use('/api/stats',    statsRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`))