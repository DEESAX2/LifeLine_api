import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import { adminRouter } from './routes/admin_routes.js'
import { authRouter } from './routes/auth_routes.js'
import { donorRouter } from './routes/donor_routes.js'
import { hospitalRouter } from './routes/hospital_routes.js'




const PORT = process.env.PORT || 9000;
const app = express()

const mongouri = process.env.MONGO_URI
mongoose.connect(mongouri)

await mongoose.connect(mongouri)

app.use(express.json());
app.use(cors())

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/donor', donorRouter)
app.use('/api/v1/hospital', hospitalRouter)



app.listen(PORT, () => {
   console.log(`Server is up on port ${PORT}`)
})
