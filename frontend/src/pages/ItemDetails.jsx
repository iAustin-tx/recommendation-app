import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function ItemDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setError("");

        // Get item details
        const response = await api.get(`/items/${id}`);

        const itemData =
          response.data.data.item ||
          response.data.data;

        setItem(itemData);

        // Record a view only for logged-in users
        if (isAuthenticated) {
          try {
            await api.post("/activities", {
              itemId: id,
              action: "view",
            });
          } catch (activityError) {
            console.error(
              "Unable to record view:",
              activityError
            );
          }
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load item"
        );
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, isAuthenticated]);

  if (loading) {
    return <p>Loading item...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

  return (
    <main>
      <Link to="/items">← Back to Explore</Link>

      <h1>{item.title}</h1>

      <p>{item.description}</p>

      <p>
        <strong>Type:</strong> {item.type}
      </p>

      <p>
        <strong>Category:</strong>{" "}
        {item.category}
      </p>

      <p>
        <strong>Price:</strong>{" "}
        {item.price > 0
          ? `₦${item.price.toLocaleString()}`
          : "Free"}
      </p>

      {item.tags?.length > 0 && (
        <p>
          <strong>Tags:</strong>{" "}
          {item.tags.join(", ")}
        </p>
      )}
    </main>
  );
}

export default ItemDetails;
