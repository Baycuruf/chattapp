import Icon from "../../components/Icon";






export const AppWrapper = ({ children }) => {
  

  return (
    <div className="App w-full grid justify-center items-center">
      <div className="app-header flex items-center justify-center text-center gap-4">
        <h1><Icon name="chatting-app" size={128}/> </h1>
      </div>

      <div className="app-container text-black border border-black">{children}</div>
      
    </div>
  );
};
