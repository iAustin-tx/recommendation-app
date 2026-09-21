import { useEffect, useState } from "react";
import api from "../api/api";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../context/AuthContext";

function Items() {
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState([]);
  const [activities, setActivities] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search) {
        params.search = search;
      }

      if (type) {
        params.type = type;
      }

      const response = await api.get("/items", {
        params,
      });

      setItems(response.data.data.items);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load items"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    if (!isAuthenticated) {
      setActivities([]);
      return;
    }

    try {
      const response = await api.get(
        "/activities/me"
      );

      setActivities(
        response.data.data.activities || []
      );
    } catch (error) {
      console.error(
        "Unable to load activities:",
        error
      );
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  useEffect(() => {
    fetchActivities();
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const hasActivity = (itemId, action) => {
    return activities.some((activity) => {
      const activityItemId =
        typeof activity.item === "object"
          ? activity.item?._id
          : activity.item;

      return (
        activityItemId === itemId &&
        activity.action === action
      );
    });
  };

  return (
    <main>
      <h1>Explore</h1>

      <p>
        Browse products, courses and content.
      </p>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button type="submit">
          Search
        </button>
      </form>

      <br />

      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value)
        }
      >
        <option value="">All Types</option>
        <option value="product">
          Products
        </option>
        <option value="course">
          Courses
        </option>
        <option value="content">
          Content
        </option>
      </select>

      {loading && <p>Loading items...</p>}

      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        items.length === 0 && (
          <p>No items found.</p>
        )}

      <div className="items-grid">
        {items.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            initiallyLiked={hasActivity(
              item._id,
              "like"
            )}
            initiallySaved={hasActivity(
              item._id,
              "save"
            )}
          />
        ))}
      </div>
    </main>
  );
}

export default Items;
