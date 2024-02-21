import UploadForm from "./components/UploadForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <ToastContainer />
      <div>Image Repository</div>
      <UploadForm />
    </div>
  );
}

export default App;
