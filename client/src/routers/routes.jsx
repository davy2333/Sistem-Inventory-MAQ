import { BrowserRouter, Routes, Route} 
from "react-router-dom"
import Home from "../pages/Home";
import Proveedores from "../pages/Proveedores";

export function MyRoutes() {
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/Proveedores" element={<Proveedores/>} />
 
        </Routes>
        </BrowserRouter>
    );
} 