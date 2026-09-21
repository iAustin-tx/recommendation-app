import { useEffect, useState } from "react";
import api from "../api/api";
import ItemCard from "../components/ItemCard";

function Recommendations() {
  const [recommendations, setRecommendations] =
    useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        // Get recommendations and current activities together
        const [recommendationResponse, activityResponse] =
          await Promise.all([
            api.get("/recommendations"),
            api.get("/activities/me"),
          ]);

        setRecommendations(
          recommendationResponse.data.data
            .recommendations || []
        );

        setActivities(
          activityResponse.data.data.activities || []
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load recommendations"
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

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

  if (loading) {
    return (
      <main>
        <p>Finding recommendations for you...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>For You</h1>

      <p>
        Recommendations based on your activity.
      </p>

      {error && <p>{error}</p>}

      {!error && recommendations.length === 0 && (
        <div>
          <h2>No recommendations yet</h2>

          <p>
            Explore some items first so we can learn
            what you're interested in.
          </p>
        </div>
      )}

      <div className="items-grid">
        {recommendations.map((item) => (
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

export default Recommendations;
