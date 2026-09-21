import { useEffect, useState } from "react";
import api from "../api/api";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/activities/me");

        setActivities(
          response.data.data.activities || []
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load activity history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <main>
        <p>Loading your activity...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>My Activity</h1>

      <p>
        Your recent interactions with items.
      </p>

      {error && <p>{error}</p>}

      {!error && activities.length === 0 && (
        <p>
          You don't have any activity yet.
          Explore some items to get started.
        </p>
      )}

      <div>
        {activities.map((activity) => {
          const item = activity.item;

          return (
            <div
              key={activity._id}
              className="activity-card"
            >
              <h3>
                {item?.title || "Item unavailable"}
              </h3>

              <p>
                <strong>Action:</strong>{" "}
                {activity.action}
              </p>

              {item?.type && (
                <p>
                  <strong>Type:</strong>{" "}
                  {item.type}
                </p>
              )}

              {item?.category && (
                <p>
                  <strong>Category:</strong>{" "}
                  {item.category}
                </p>
              )}

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  activity.createdAt
                ).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Activity;
