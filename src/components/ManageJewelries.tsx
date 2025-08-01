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
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { IoLogOut } from "react-icons/io5";
import { Link } from "react-router-dom";

type ManageJewelriesProps = {
  switchToUploadPanel: () => void;
  switchToUploadForm: () => void;
  setEditingJewel: (jewel: Jewel | null) => void;
};

const ManageJewelries = ({
  switchToUploadPanel,

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

  useEffect(() => {
    loadJewelries();
  }, []);

  const handleAddNew = () => {
    setEditingJewel(null);
    switchToUploadPanel();
  };
  const handleLogout = async () => {
    await signOut(auth);
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
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mb={4}
          gap={4}
        >
          <Button onClick={handleAddNew} size="sm">
            Adicionar Nova Joia
          </Button>
          <Button onClick={handleLogout} colorScheme="red" h="36px">
            Sair
            <IoLogOut />
          </Button>
        </Box>

        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <InputGroup maxW="400px" startElement={<LuSearch />} mb={4}>
            <Input
              placeholder="Buscar joias"
              value={searchTerm}
              height="36px"
              w="150px"
              borderRadius={"lg"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </InputGroup>
        </Box>
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
                base: "60%",
                md: "100%",
                lg: "100%",
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
              <Text color="red.500" fontWeight="medium" mb={1}>
                {jewel.originalPrice}
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
                <Link to={`/admin/jewel/${jewel.id}`} >
                  <Button size="sm" flex={1} variant="outline" >
                    Editar
                  </Button>
                </Link>
                <Button
               
                  size="sm"
                  color={"red.400"}
                  
                  onClick={() => handleDelete(jewel.id)}
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
