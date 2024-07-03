import express from 'express';
import {

    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
    newOrder,
} from '../controllers/order.js';
import { authenticateUser, authRole } from '../middleware/authmiddleware.js';

const orderRouter = express.Router();

orderRouter.post('/order/new', authenticateUser, newOrder); // Create new order
orderRouter.get('/order/:id', authenticateUser, getSingleOrder); // Get a single order
orderRouter.get('/orders/me', authenticateUser, myOrders); // Get logged in user orders
orderRouter.get('/admin/orders', authenticateUser, authRole(['admin']), getAllOrders); // Get all orders
orderRouter.put('/admin/update/order/:id', authenticateUser, authRole(['admin']), updateOrder); // Update order status
orderRouter.delete('/admin/order/:id', authenticateUser, authRole(['admin']), deleteOrder); // Delete an order

export default orderRouter;
