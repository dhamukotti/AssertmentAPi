const Order = require("../models/Order");
const Counter = require("../models/Counter");

const createOrder = async (req, res) => {
  try {
    const { product, quantity, status, priority, createdBy } = req.body;

    if (!createdBy) {
      return res.status(400).json({ message: "createdBy is required" });
    }

    const counter = await Counter.findOneAndUpdate(
      { name: "orders" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const newOrder = new Order({
      orderID: `ORD${counter.value.toString().padStart(3, "0")}`,
      product,
      quantity,
      status,
      priority,
      createdBy,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", orderID: newOrder.orderID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { product, quantity, status, priority, } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, {product, status,quantity, priority, updatedAt: Date.now() }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const orderstatus = async (req, res) => {
  try {
    let searchQuery = req.query.search || "";

    // Remove accidental double quotes from search query
    searchQuery = searchQuery.replace(/['"]+/g, "").trim(); 

    // Ensure the query is not empty before searching
    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const orders = await Order.find({
      product: searchQuery, // Exact match instead of regex
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No matching products found" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createOrder, getOrders, updateOrder, deleteOrder,orderstatus };
