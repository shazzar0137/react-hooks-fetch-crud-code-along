import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  // Fetch items from the server on initial render
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('http://localhost:4000/items');
        if (!res.ok) {
          throw new Error('Failed to fetch items');
        }
        const items = await res.json();
        setItems(items);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  // Add a new item
  const handleAddItem = async (newItem) => {
    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // Persist the new item to the server
    try {
      const response = await fetch('http://localhost:4000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Update an existing item
  const handleUpdateItem = async (updatedItem) => {
    const updatedItems = items.map((item) => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      } else {
        return item;
      }
    });
    setItems(updatedItems);

    // Persist the update to the server
    try {
      const response = await fetch(`http://localhost:4000/items/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Handle category change for filtering items
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Delete an item
  const handleDeleteItem = async (deletedItem) => {
    const updatedItems = items.filter(item => item.id !== deletedItem.id);
    setItems(updatedItems);

    // Persist the delete to the server
    try {
      const response = await fetch(`http://localhost:4000/items/${deletedItem.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Filter items based on the selected category
  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item 
            key={item.id} 
            item={item} 
            onUpdateItem={handleUpdateItem} 
            onDeleteItem={handleDeleteItem} 
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
