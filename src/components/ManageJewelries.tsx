import { useState, useEffect } from "react";
import { Box, Button, Image, Text, Flex, Spinner } from "@chakra-ui/react";
import { deleteJewelry, getJewelries } from "../firebaseUpload";
import { toaster } from "./ui/toaster";

type Jewel = {
  id: string;
  name: string;
  price: string;
  category: string;
  imageBase64: string; // Alterado de imageUrl para imageBase64
};

type ManageJewelriesProps = {
  switchToUploadPanel: () => void;
  setEditingJewel: (jewel: Jewel | null) => void;
};

const ManageJewelries = ({ switchToUploadPanel, setEditingJewel }: ManageJewelriesProps) => {
  const [jewelries, setJewelries] = useState<Jewel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadJewelries = async () => {
    try {
      setLoading(true);
      const jewels = await getJewelries();
      setJewelries(jewels);
      toaster.create({
        title: "Sucesso",
        description: "Joias carregadas com sucesso",
        duration: 2000,
        type: "success",
        closable: true,
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Erro",
        description: "Falha ao carregar joias",
        type: "error",
        duration: 3000,
        closable: true,
      });
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
      toaster.create({
        title: "Sucesso",
        description: "Joia excluída com sucesso",
        duration: 2000,
        type: "success",
        closable: true,
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Erro",
        description: "Falha ao excluir joia",
        type: "error",
        duration: 3000,
        closable: true,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (jewel: Jewel) => {
    setEditingJewel(jewel);
    switchToUploadPanel();
  };

  useEffect(() => {
    loadJewelries();
  }, []);

  return (
    <Box>
      <Button 
        onClick={switchToUploadPanel} 
        colorScheme="blue" 
        mb={4}
        size="sm"
      >
        Adicionar Nova Joia
      </Button>

      {loading ? (
        <Flex justify="center" py={8}>
          <Spinner size="xl" />
        </Flex>
      ) : jewelries.length === 0 ? (
        <Text textAlign="center" py={8}>Nenhuma joia cadastrada.</Text>
      ) : (
        <Flex wrap="wrap" gap={4}>
          {jewelries.map((jewel) => (
            <Box 
              key={jewel.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              width={["100%", "calc(50% - 16px)", "calc(33.333% - 16px)"]}
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
              transition="all 0.2s"
            >
              <Image 
                src={jewel.imageBase64} // Alterado para imageBase64
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
                  colorScheme="red"
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
        </Flex>
      )}
    </Box>
  );
};

export default ManageJewelries;