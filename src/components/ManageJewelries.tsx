import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Image,
  Text,
  Flex,
  Spinner,
  Grid,
} from "@chakra-ui/react";
import { deleteJewelry } from "../firebaseUpload";

import { Jewel } from "@/types/Jewel";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

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

  const loadJewelries = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "joias"));
      const jewels = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          category: data.category,
          imageBase64: data.imageBase64,
        };
      });
      setJewelries(jewels);
    } catch (error) {
      console.error(error);
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
      console.error(error);
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
      <Button onClick={handleAddNew} colorScheme="blue" mb={4} size="sm">
        Adicionar Nova Joia
      </Button>

      {loading ? (
        <Flex justify="center" py={8}>
          <Spinner size="xl" />
        </Flex>
      ) : jewelries.length === 0 ? (
        <Text textAlign="center" py={8}>
          Nenhuma joia cadastrada.
        </Text>
      ) : (
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          mx={"auto"}
          justifyContent={"center"}
        >
          {jewelries.map((jewel) => (
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
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
              transition="all 0.2s"
            >
              <Image
                src={jewel.imageBase64}
                alt={jewel.name}
                boxSize="150px"
                objectFit="contain"
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
              <Text fontSize="sm" color="gray.500" mb={3}>
                {jewel.category}
              </Text>

              <Flex mt={3} gap={2}>
                <Button
                  size="sm"
                  colorScheme="blue"
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
