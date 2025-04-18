import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Image,
  Text,
  Flex,
  Spinner,
  Grid,
  InputGroup,
  Input,
} from "@chakra-ui/react";
import { deleteJewelry } from "../firebaseUpload";
import { Jewel } from "@/types/Jewel";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { LuSearch } from "react-icons/lu";

type ManageJewelriesProps = {
  switchToUploadPanel: () => void;
  switchToUploadForm: () => void;
  setEditingJewel: (jewel: Jewel | null) => void;
};

const ManageJewelries = ({
  switchToUploadPanel,
  switchToUploadForm,
  setEditingJewel,
}: ManageJewelriesProps) => {
  const [jewelries, setJewelries] = useState<Jewel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJewelries = useMemo(() => {
    return jewelries.filter(
      (jewel) =>
        jewel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jewel.categories.some(
          (category) =>
            category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jewel.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [jewelries, searchTerm]);

  const loadJewelries = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "joias"));
      const jewels = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          price: data.price || "",
          categories: Array.isArray(data.categories)
            ? data.categories
            : data.category
            ? [data.category]
            : [],
            originalPrice: data.originalPrice,
            description: data.description || "",
          imageBase64: data.imageBase64 || "",
        } as Jewel;
      });
      setJewelries(jewels);
    } catch (error) {
      console.error("Erro ao carregar joias:", error);
      alert("Erro ao carregar joias. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta joia?")) return;

    try {
      setDeletingId(id);
      await deleteJewelry(id);
      await loadJewelries();
    } catch (error) {
      console.error("Erro ao excluir joia:", error);
      alert("Erro ao excluir joia. Tente novamente mais tarde.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (jewel: Jewel) => {
    setEditingJewel(jewel);
    switchToUploadForm();
  };

  useEffect(() => {
    loadJewelries();
  }, []);

  const handleAddNew = () => {
    setEditingJewel(null);
    switchToUploadPanel();
  };

  return (
    <Box>
      <Flex
        mb={4}
        gap={4}
        alignItems={"center"}
        justifyContent={"center"}
        direction={{ base: "column", md: "row" }}
      >
        <Button onClick={handleAddNew} mb={4} size="sm">
          Adicionar Nova Joia
        </Button>

        <InputGroup maxW="400px" startElement={<LuSearch />} mb={4}>
          <Input
            placeholder="Buscar joia"
            value={searchTerm}
            height="36px"
            borderRadius={"lg"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </InputGroup>
      </Flex>

      {loading ? (
        <Flex justifyContent={"center"} alignItems={"center"} py={8}>
          <Spinner size="xl" />
        </Flex>
      ) : filteredJewelries.length === 0 ? (
        <Text textAlign="center" py={8}>
          {searchTerm ? "Nenhuma joia encontrada" : "Nenhuma joia cadastrada"}
        </Text>
      ) : (
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          justifyContent={"center"}
          alignItems={"center"}
          gap={4}
        >
          {filteredJewelries.map((jewel) => (
            <Box
              key={jewel.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              mx={"auto"}
              width={{
                base: "70%",
                md: "80%",
                lg: "90%",
              }}
              height={"100%"}
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
              transition="all 0.2s"
            >
              <Image
                src={jewel.imageBase64}
                alt={jewel.name}
                boxSize="150px"
                objectFit="contain"
                maxH="150px"
                mx="auto"
                mb={3}
                borderRadius="md"
              />
              <Text fontWeight="bold" fontSize="lg" mb={1}>
                {jewel.name}
              </Text>
              <Text color="blue.600" fontWeight="medium" mb={1}>
                {jewel.price}
              </Text>
              <Text color="gray.500" fontWeight="medium" mb={1}>
                {jewel.description}
              </Text>

              {jewel.categories.map((category) => (
                <Flex
                  key={category}
                  borderRadius="md"
                  fontSize="xs"
                  bg={category === "Promoção" ? "red.500" : "black"}
                  mt={2}
                  w="fit-content"
                  p={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                  color="white"
                  fontWeight="medium"
                >
                  {category}
                </Flex>
              ))}

              <Flex mt={3} gap={2}>
                <Button
                  size="sm"
                  onClick={() => handleEdit(jewel)}
                  flex={1}
                  variant="outline"
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  color={"red.400"}
                  onClick={() => handleDelete(jewel.id)}
                  flex={1}
                  loading={deletingId === jewel.id}
                  loadingText="Excluindo..."
                >
                  Excluir
                </Button>
              </Flex>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ManageJewelries;
