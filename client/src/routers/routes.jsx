import { BrowserRouter, Routes, Route} 
from "react-router-dom"
import Home from "../pages/Home";
import Proveedores from "../pages/Proveedores";
import Bajas from "../pages/Bajas";
import Cliente from "../pages/Cliente";
import Historial from "../pages/Historial";
import Inventario from "../pages/Inventario";
import Mantenimiento from "../pages/Mantenimiento";
import Pedidos from "../pages/Pedidos";
import Tipo_prenda from "../pages/Tipo_prenda";

export function MyRoutes() {
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/Proveedores" element={<Proveedores/>} />
            <Route path="/Bajas" element={<Bajas/>} />
            <Route path="/Cliente" element={<Cliente/>} />
            <Route path="/Historial" element={<Historial/>} />
            <Route path="/Inventario" element={<Inventario/>} />
            <Route path="/Mantenimiento" element={<Mantenimiento/>} />
            <Route path="/Pedidos" element={<Pedidos/>} />
            <Route path="/Tipo_prenda" element={<Tipo_prenda />} />

        </Routes>
        </BrowserRouter>
    );
} 