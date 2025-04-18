import { Box, Center, Heading, Image } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./Pages/Catalog/Catalog";
import AdminPanel from "./Pages/Admin/AdminPanel";
import logo from "./assets/logo.png";
import Footer from "./components/Footer";
import {JewelProvider} from "@/context/JewelProvider";


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

              <Route path="/admin/dashboard" element={<AdminPanel />} />
              <Route path="/admin/jewel/:id" element={<AdminPanel />} />
            </Routes>
            <Footer />
          </Box>
        </Center>
      </Router>
    </JewelProvider>
  );
}

export default App;
