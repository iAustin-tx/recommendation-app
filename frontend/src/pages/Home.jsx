import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            Personalized Recommendations
          </span>

          <h1>
            Discover things you'll actually
            enjoy.
          </h1>

          <p>
            Explore products, courses and content
            tailored to your interests and activity.
          </p>

          <div className="hero-actions">
            <Link
              to="/items"
              className="primary-link"
            >
              Explore Items
            </Link>

            {isAuthenticated ? (
              <Link
                to="/recommendations"
                className="secondary-link"
              >
                View Recommendations
              </Link>
            ) : (
              <Link
                to="/register"
                className="secondary-link"
              >
                Create Account
              </Link>
            )}
          </div>

          {isAuthenticated && (
            <p className="welcome-message">
              Welcome back, {user?.name}.
            </p>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Explore</h3>
          <p>
            Browse products, courses and useful
            content across different categories.
          </p>
        </div>

        <div className="feature-card">
          <h3>Interact</h3>
          <p>
            View, like and save items that interest
            you.
          </p>
        </div>

        <div className="feature-card">
          <h3>Discover</h3>
          <p>
            Get personalized recommendations based
            on your activity.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
