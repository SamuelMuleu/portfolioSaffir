import { Box, Center, Heading, Image } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./Pages/Catalog/Catalog";
import AdminPanel from "./Pages/Admin/AdminPanel";

function App() {
  return (
    <Router>
      <Center>
        <Box textAlign="center" width="98vw">
          <Heading mb={4}>
            <Image
              src="../src/assets/logo.png"
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
        </Box>
      </Center>
    </Router>
  );
}

export default App;
