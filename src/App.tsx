import { Box, Center, Heading, Image } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./Pages/Catalog/Catalog";
import AdminPanel from "./Pages/Admin/AdminPanel";
import Login from "./Pages/Login/Login";
import logo from "./assets/logo.png";
import Footer from "./components/Footer";
import { JewelProvider } from "@/context/JewelProvider";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <JewelProvider>
      <Router>
        <Center>
          <Box textAlign="center" width="98vw">
            <Heading mb={4}>
              <Image
                src={logo}
                alt="logo"
                boxSize="200px"
                objectFit="contain"
                borderRadius="md"
                loading="lazy"
                width="100vw"
              />
            </Heading>

            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/jewel/:id" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />
            </Routes>
            <Footer />
          </Box>
        </Center>
      </Router>
    </JewelProvider>
  );
}

export default App;