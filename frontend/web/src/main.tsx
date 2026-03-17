import { createRoot } from "react-dom/client";
import { APP_NAME } from "@/constants";
import App from "./App";
import "./index.css";

document.title = APP_NAME;

createRoot(document.getElementById("root")!).render(<App />);
