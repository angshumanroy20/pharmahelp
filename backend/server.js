const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');



const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/secure', protectedRoutes);

const prescriptionRoutes = require('./routes/prescriptionRoutes');
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/uploads', express.static('uploads')); // Serve uploaded files


const sideEffectRoutes = require('./routes/sideEffectRoutes');
app.use('/api/side-effects', sideEffectRoutes);


app.use('/api/prescriptions', prescriptionRoutes);
app.use('/uploads', express.static('uploads')); // serve uploaded files

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const medicineRoutes = require('./routes/medicineRoutes');
app.use('/api/medicines', medicineRoutes);

app.use('/api/dashboard', require('./routes/dashboardRoutes'));

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctor', doctorRoutes);



app.use((err, req, res, next) => {
    console.error("Unhandled error:", err); // ← This logs the backend crash
    res.status(500).json({ message: "Internal Server Error" });
  });
 
  
