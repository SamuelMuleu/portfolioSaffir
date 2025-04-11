import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Box,
  Image,
  Text,
  Spinner,
  Center,
  Button,
  Grid,
  IconButton,
  ButtonGroup,
  CloseButton,
  Dialog,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Jewel } from "@/types/Jewel";

const ITEMS_PER_PAGE = 9;

const Catalog = () => {
  const [jewels, setJewels] = useState<Jewel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJewel, setSelectedJewel] = useState<Jewel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);

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

  const dynamicCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(jewels.map((jewel) => jewel.category))
    );
    return ["todos", ...uniqueCategories];
  }, [jewels]);

  const filteredJewels = useMemo(() => {
    return selectedCategory === "todos"
      ? jewels
      : jewels.filter((jewel) => jewel.category === selectedCategory);
  }, [jewels, selectedCategory]);

  // Paginação
  const paginatedJewels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJewels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJewels, currentPage]);

  const totalPages = Math.ceil(filteredJewels.length / ITEMS_PER_PAGE);

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
    <Box mb={8} display="flex" flexWrap="wrap" gap={1} justifyContent="center">
      <Center mb={2} px={{ base: 2, md: 0 }}>
        <Stack
          direction={{ base: "column", md: "row" }}
          align="center"
          overflowX={{ base: "visible", md: "visible" }}
          w="full"
        >
          {dynamicCategories.map((category) => (
            <Button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              w={{ base: "100%", md: "110px" }}
              bg={selectedCategory === category ? "#0e2d5b" : "transparent"}
              color={selectedCategory === category ? "white" : "gray.800"}
              textTransform="capitalize"
              fontSize={{ base: "sm", md: "md" }}
              _hover={{
                bg: selectedCategory === category ? "#0e2d5b" : "#e8e2d2",
              }}
            >
              {category}
            </Button>
          ))}
        </Stack>
      </Center>

      {paginatedJewels.length === 0 ? (
        <Center h="200px">
          <Text>Nenhuma joia encontrada nesta categoria.</Text>
        </Center>
      ) : (
        <>
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {paginatedJewels.map((jewel) => (
              <Box
                key={jewel.id}
                p={4}
                rounded="lg"
                _hover={{ transform: "scale(1.02)" }}
                transition="all 0.2s"
              >
                <Dialog.Root
                  onOpenChange={(isOpen) => {
                    if (isOpen) setSelectedJewel(jewel);
                    else setSelectedJewel(null);
                  }}
                >
                  <Dialog.Trigger asChild>
                    <Image
                      src={jewel.imageBase64}
                      alt={jewel.name}
                      objectFit="contain"
                      rounded="xs"
                      w={{ base: "10rem", md: "300px" }}
                      mx="auto"
                      loading="lazy"
                      cursor="pointer"
                      _hover={{ transform: "scale(1.05)" }}
                      transition="transform 0.2s"
                    />
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content bg="#e8e2d2" maxW="90vw" mt="10px" p={4}>
                        <Dialog.Header>
                          <Dialog.Title
                            color="#1c3050"
                            fontWeight={"bold"}
                          ></Dialog.Title>
                          <Dialog.CloseTrigger asChild>
                            <CloseButton
                              position="absolute"
                              right="8px"
                              top="8px"
                              fontWeight={"bold"}
                              color="white"
                            />
                          </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body>
                          {selectedJewel && (
                            <>
                              <Image
                                src={selectedJewel.imageBase64}
                                alt={selectedJewel.name}
                                objectFit="contain"
                                h={{ base: "70vh", md: "90vh" }}
                                mt="-50px"
                                w="100%"
                              />
                            </>
                          )}
                        </Dialog.Body>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
                <Text mt={2} fontWeight="bold" textAlign="center">
                  {jewel.name}
                </Text>
                <Text fontSize="sm" color="#1c3050" textAlign="center">
                  {jewel.price}
                </Text>
              </Box>
            ))}
          </Grid>

          {/* Controles de Paginação */}
          <Center mt={8}>
            <ButtonGroup>
              <IconButton
                bg={"#0e2d5b"}
                aria-label="Página anterior"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <LuChevronLeft />
              </IconButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    bg={"#0e2d5b"}
                    key={page}
                    variant={currentPage === page ? "solid" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <IconButton
                bg={"#0e2d5b"}
                aria-label="Próxima página"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <LuChevronRight />
              </IconButton>
            </ButtonGroup>
          </Center>
        </>
      )}
    </Box>
  );
};

export default Catalog;
