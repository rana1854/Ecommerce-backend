import Order from '../models/order.js';
import Product from '../models/product.js';

// Create new Order
export const newOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user.id,  // Use req.user.id to get the authenticated user's ID
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Order
export const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this Id",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get logged in user Orders
export const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });  // Use req.user.id to get the authenticated user's orders

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all Orders -- Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        let totalAmount = 0;

        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Order Status -- Admin
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this Id",
            });
        }

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "You have already delivered this order",
            });
        }

        if (req.body.status === "Shipped") {
            for (const item of order.orderItems) {
                await updateStock(item.product, item.quantity);
            }
        }
        order.orderStatus = req.body.status;

        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

// Delete Order -- Admin
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this Id",
            });
        }

        await order.remove();

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
