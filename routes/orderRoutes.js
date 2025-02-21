const express = require('express');
const { createOrder, getOrders, updateOrder, deleteOrder,orderstatus } = require('../Controller/ordercontroller');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const jwt =  require('jsonwebtoken')

function verifytoken(req, res, next) {
    const beareHeader = req.headers['authorization'];
    if(typeof beareHeader !='undefined') {
     const bearer = beareHeader.split(' ')
     const bearerToken = bearer[1]
     req.token = bearerToken
      jwt.verify(bearerToken , 'secretkey' , (err, user) => {
          if(err) {
              res.json({error: 'unauthorzhied user'})
          }else {
            next();
          }
      })
    

    }else {
      res.json({
        error: 'Unauthorized user'
      })
    }
  }
router.post('/createorder',createOrder);
router.get('/orders', getOrders);
router.put('/updateorder/:id',  updateOrder);
router.delete('/deleteorder/:id', deleteOrder);
router.get("/Getordersearch", orderstatus);

module.exports = router;