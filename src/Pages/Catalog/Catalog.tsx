import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Box,
  Image,
  Text,
  Spinner,
  Center,
  Button,
  ButtonGroup,
  Flex,
} from "@chakra-ui/react";

interface Jewel {
  id: string;
  name: string;
  price: string;
  category: string;
  imageBase64: string;
  createdAt?: Date;
}

const Catalog = () => {
  const [jewels, setJewels] = useState<Jewel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  useEffect(() => {
    const fetchJewels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "joias"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Jewel[];

        const validJewels = data.filter((jewel) => jewel.imageBase64);
        setJewels(validJewels);
      } catch (err) {
        console.error("Erro ao buscar joias:", err);
        setError("Não foi possível carregar as joias. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchJewels();
  }, []);

  const filteredJewels =
    selectedCategory === "todos"
      ? jewels
      : jewels.filter((jewel) => jewel.category === selectedCategory);

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  if (jewels.length === 0) {
    return (
      <Center h="200px">
        <Text>Nenhuma joia encontrada.</Text>
      </Center>
    );
  }

  return (
    <Center flexDirection="row" gap={6} p={4}>
      <Box p={4}>
        <Center mb={8}>
          <ButtonGroup attached variant="outline">
            <Button
              onClick={() => setSelectedCategory("todos")}
              _active={{ bg: "blue.500", color: "white" }}
              bg={selectedCategory === "todos" ? "blue.500" : undefined}
              color={selectedCategory === "todos" ? "white" : undefined}
            >
              Todos
            </Button>
            <Button
              onClick={() => setSelectedCategory("correntaria")}
              _active={{ bg: "blue.500", color: "white" }}
              bg={selectedCategory === "correntaria" ? "blue.500" : undefined}
              color={selectedCategory === "correntaria" ? "white" : undefined}
            >
              Correntaria
            </Button>
            <Button
              onClick={() => setSelectedCategory("conjuntos")}
              _active={{ bg: "blue.500", color: "white" }}
              bg={selectedCategory === "conjuntos" ? "blue.500" : undefined}
              color={selectedCategory === "conjuntos" ? "white" : undefined}
            >
              Conjuntos
            </Button>
            <Button
              onClick={() => setSelectedCategory("aliancas")}
              _active={{ bg: "blue.500", color: "white" }}
              bg={selectedCategory === "aliancas" ? "blue.500" : undefined}
              color={selectedCategory === "aliancas" ? "white" : undefined}
            >
              Alianças
            </Button>
          </ButtonGroup>
        </Center>

        {filteredJewels.length === 0 ? (
          <Center h="200px">
            <Text>Nenhuma joia encontrada nesta categoria.</Text>
          </Center>
        ) : (
          <Flex flexDirection="row" gap={6}>
            {filteredJewels.map((jewel) => (
              <Box
                key={jewel.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
                transition="all 0.2s"
              >
                <Image
                  src={jewel.imageBase64}
                  alt={jewel.name}
                  boxSize="200px"
                  objectFit="contain"
                  borderRadius="md"
                  mx="auto"
                  loading="lazy"
                />
                <Text mt={2} fontWeight="bold" textAlign="center">
                  {jewel.name}
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  {jewel.category}
                </Text>
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </Center>
  );
};

export default Catalog;
