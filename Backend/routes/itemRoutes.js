const express = require("express");
const router = express.Router();

const db = require("../db");

// GET ITEM TYPES
router.get("/item-types", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM item_types");

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE PURCHASE WITH ITEMS

router.post("/purchase", async (req, res) => {
  try {
    const { purchase_date, items } = req.body;

    if (!purchase_date) {
      return res.status(400).json({
        message: "Purchase Date Required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "At least one item required",
      });
    }

    const [purchaseResult] = await db.query(
      "INSERT INTO purchases(purchase_date) VALUES(?)",
      [purchase_date],
    );

    const purchaseId = purchaseResult.insertId;

    for (const item of items) {
      const { name, item_type_id, stock_available } = item;

      if (!name || !item_type_id) {
        return res.status(400).json({
          message: "Item Name and Item Type Required",
        });
      }

      await db.query(
        `INSERT INTO items
        (purchase_id,name,stock_available,item_type_id)
        VALUES(?,?,?,?)`,
        [purchaseId, name, stock_available, item_type_id],
      );
    }

    res.json({
      message: "Purchase Saved",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL DATA USING JOIN

router.get("/items", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        i.id,
        i.name,
        p.purchase_date,
        i.stock_available,
        it.type_name
      FROM items i
      INNER JOIN purchases p
        ON i.purchase_id = p.id
      INNER JOIN item_types it
        ON i.item_type_id = it.id
      ORDER BY i.id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE

router.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name, item_type_id, stock_available } = req.body;

    if (!name || !item_type_id) {
      return res.status(400).json({
        message: "Required Fields Missing",
      });
    }

    await db.query(
      `
      UPDATE items
      SET
      name=?,
      item_type_id=?,
      stock_available=?
      WHERE id=?
      `,
      [name, item_type_id, stock_available, id],
    );

    res.json({
      message: "Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE

router.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM items WHERE id=?", [id]);

    res.json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
