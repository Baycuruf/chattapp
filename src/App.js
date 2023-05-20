import { Toaster } from "react-hot-toast";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { auth } from "./firebase";
import { useEffect } from "react";


function App() {
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      
    });

    return () => unsubscribe();
  }, []);
  const showRoutes = useRoutes(routes);
  
  return (
    <div className="bg-[#d70000] text-[white]">
        <Toaster position="top-right" />
        {showRoutes}
      </div>
  );
}

export default App;