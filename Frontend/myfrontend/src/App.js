import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);

  const [purchaseDate, setPurchaseDate] = useState("");

  const [formItems, setFormItems] = useState([
    {
      name: "",
      item_type_id: "",
      stock_available: false,
    },
  ]);

  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    try {
      const typesRes = await axios.get("http://localhost:5000/api/item-types");

      const itemsRes = await axios.get("http://localhost:5000/api/items");

      setTypes(typesRes.data);
      setItems(itemsRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addItemRow = () => {
    setFormItems([
      ...formItems,
      {
        name: "",
        item_type_id: "",
        stock_available: false,
      },
    ]);
  };

  const resetForm = () => {
    setPurchaseDate("");

    setFormItems([
      {
        name: "",
        item_type_id: "",
        stock_available: false,
      },
    ]);

    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/items/${editId}`, {
          name: formItems[0].name,
          item_type_id: formItems[0].item_type_id,
          stock_available: formItems[0].stock_available,
        });

        alert("Item Updated Successfully");
      } else {
        await axios.post("http://localhost:5000/api/purchase", {
          purchase_date: purchaseDate,
          items: formItems,
        });

        alert("Purchase Saved Successfully");
      }

      loadData();
      resetForm();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);

      alert("Deleted Successfully");

      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setPurchaseDate(item.purchase_date?.split("T")[0]);

    setFormItems([
      {
        name: item.name,
        item_type_id: item.item_type_id,
        stock_available:
          item.stock_available === 1 || item.stock_available === true,
      },
    ]);
  };

  return (
    <div className="container">
      <h2>Inventory Management System</h2>

      <form onSubmit={handleSubmit}>
        {!editId && (
          <input
            type="date"
            required
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        )}

        {formItems.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Item Name"
              required
              value={item.name}
              onChange={(e) => {
                const temp = [...formItems];
                temp[index].name = e.target.value;
                setFormItems(temp);
              }}
            />

            <select
              required
              value={item.item_type_id}
              onChange={(e) => {
                const temp = [...formItems];
                temp[index].item_type_id = e.target.value;
                setFormItems(temp);
              }}
            >
              <option value="">Select Item Type</option>

              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))}
            </select>

            <label>
              Stock Available
              <input
                type="checkbox"
                checked={item.stock_available}
                onChange={(e) => {
                  const temp = [...formItems];

                  temp[index].stock_available = e.target.checked;

                  setFormItems(temp);
                }}
              />
            </label>
          </div>
        ))}

        {!editId && (
          <button type="button" onClick={addItemRow}>
            Add Item
          </button>
        )}

        <button type="submit">
          {editId ? "Update Item" : "Submit Purchase"}
        </button>

        {editId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>Purchase Date</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>

              <td>{item.name}</td>

              <td>{item.type_name}</td>

              <td>{new Date(item.purchase_date).toLocaleDateString()}</td>

              <td>{item.stock_available ? "Available" : "Out Of Stock"}</td>

              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>

                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
