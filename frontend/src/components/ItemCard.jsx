import {
  useEffect,
  useState,
} from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ItemCard({
  item,
  initiallyLiked = false,
  initiallySaved = false,
}) {
  const { isAuthenticated } = useAuth();

  const [liked, setLiked] = useState(
    initiallyLiked
  );

  const [saved, setSaved] = useState(
    initiallySaved
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLiked(initiallyLiked);
  }, [initiallyLiked]);

  useEffect(() => {
    setSaved(initiallySaved);
  }, [initiallySaved]);

  const handleActivity = async (action) => {
    if (!isAuthenticated) {
      setMessage("Please login first");
      return;
    }

    try {
      setMessage("");

      await api.post("/activities", {
        itemId: item._id,
        action,
      });

      if (action === "like") {
        setLiked(true);
        setMessage("Item liked");
      }

      if (action === "save") {
        setSaved(true);
        setMessage("Item saved");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Unable to record activity";

      // If backend says it already exists,
      // reflect that in the UI.
      if (
        action === "like" &&
        error.response?.status === 409
      ) {
        setLiked(true);
      }

      if (
        action === "save" &&
        error.response?.status === 409
      ) {
        setSaved(true);
      }

      setMessage(errorMessage);
    }
  };

  const removeActivity = async (action) => {
    try {
      setMessage("");

      await api.delete("/activities", {
        data: {
          itemId: item._id,
          action,
        },
      });

      if (action === "like") {
        setLiked(false);
        setMessage("Item unliked");
      }

      if (action === "save") {
        setSaved(false);
        setMessage("Item unsaved");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to remove activity"
      );
    }
  };

  return (
    <article className="item-card">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="item-image"
        />
      ) : (
        <div className="item-image-placeholder">
          {item.type === "course" && "??"}
          {item.type === "product" && "???"}
          {item.type === "content" && "??"}
        </div>
      )}

      <div className="item-card-body">
        <div className="item-card-header">
          <span className={`type-badge ${item.type}`}>
            {item.type}
          </span>

          <span className="category-badge">
            {item.category}
          </span>
        </div>

        <h3>{item.title}</h3>

        <p className="item-description">
          {item.description}
        </p>

        <p className="item-price">
          {item.price > 0
            ? `?${item.price.toLocaleString()}`
            : "Free"}
        </p>

        {item.tags?.length > 0 && (
          <div className="item-tags">
            {item.tags.map((tag) => (
              <span key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="item-actions">
          <Link
            to={`/items/${item._id}`}
            className="details-link"
          >
            View Details
          </Link>

          {isAuthenticated && (
            <>
              <button
                type="button"
                onClick={() =>
                  liked
                    ? removeActivity("like")
                    : handleActivity("like")
                }
                className={
                  liked ? "active-action" : ""
                }
              >
                {liked ? "? Unlike" : "? Like"}
              </button>

              <button
                type="button"
                onClick={() =>
                  saved
                    ? removeActivity("save")
                    : handleActivity("save")
                }
                className={
                  saved ? "active-action" : ""
                }
              >
                {saved ? "? Unsave" : "?? Save"}
              </button>
            </>
          )}
        </div>

        {message && (
          <p className="activity-message">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}

export default ItemCard;
