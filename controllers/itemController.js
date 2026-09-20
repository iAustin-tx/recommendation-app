const Item = require("../models/Item");

const createItem = async (req, res) => {
  try {
    const { title, description, type, category, tags, imageUrl, price } = req.body || {};
    if (!title || !description || !type || !category) {
      return res.status(400).json({ success: false, message: "Title, description, type and category are required", data: null });
    }
    const item = await Item.create({
      title, description, type, category,
      tags: tags || [], imageUrl: imageUrl || "", price: price || 0,
      createdBy: req.user._id,
    });
    return res.status(201).json({ success: true, message: "Item created successfully", data: { item } });
  } catch (error) {
    console.error("Create item error:", error);
    return res.status(500).json({ success: false, message: "Unable to create item", data: null });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || !item.isActive) {
      return res.status(404).json({ success: false, message: "Item not found", data: null });
    }
    return res.status(200).json({ success: true, message: "Item retrieved successfully", data: { item } });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid item ID", data: null });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found", data: null });
    }
    const allowedFields = ["title", "description", "type", "category", "tags", "imageUrl", "price", "isActive"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });
    await item.save();
    return res.status(200).json({ success: true, message: "Item updated successfully", data: { item } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to update item", data: null });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found", data: null });
    }
    await item.deleteOne();
    return res.status(200).json({ success: true, message: "Item deleted successfully", data: null });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid item ID", data: null });
  }
};

const getItems = async (req, res) => {
  try {
    const {
      search,
      type,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {
      isActive: true,
    };

    // Filter by item type
    if (type) {
      const allowedTypes = ["product", "course", "content"];

      if (!allowedTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid item type",
          data: null,
        });
      }

      filter.type = type;
    }

    // Filter by category
    if (category) {
      filter.category = category.toLowerCase();
    }

    // Search
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const pageNumber = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const totalItems = await Item.countDocuments(filter);

    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(
      totalItems / limitNumber
    );

    return res.status(200).json({
      success: true,
      message: "Items retrieved successfully",
      data: {
        items,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalItems,
          itemsPerPage: limitNumber,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get items error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve items",
      data: null,
    });
  }
};

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem };
