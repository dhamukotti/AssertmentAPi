const express = require('express');
const { login,getusers,updateUser, logout,registerUser,deleteUser} = require('../Controller/authcontroller'); // ✅ Ensure correct path

const router = express.Router();

router.post('/login', login);
router.get('/Getalluser',getusers)
router.put('/Updateuser/:id', updateUser);
router.post('/Register', registerUser);
router.delete('/UserDelete/:id', deleteUser);
router.post('/logout', logout);

module.exports = router;
