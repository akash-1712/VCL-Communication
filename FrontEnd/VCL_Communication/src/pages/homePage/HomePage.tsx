import { useContext } from "react";
import AuthContext from "../../store/AuthContext";

function HomePage() {
  const { isLoggedIn, username } = useContext(AuthContext);

  return (
    <div className="text-center mt-4">
      <h1 className="text-2xl font-bold">
        {isLoggedIn ? `Welcome, ${username}!` : "Welcome, Guest!"}
      </h1>

      <div className="my-4">
        <h2 className="text-xl">VCL Communication</h2>
      </div>
    </div>
  );
}

export default HomePage;
