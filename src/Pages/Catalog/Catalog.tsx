import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Box,
  Image,
  Text,
  Spinner,
  Center,
  Grid,
  CloseButton,
  Dialog,
  Portal,
  AspectRatio,
} from "@chakra-ui/react";
import { Jewel, JewelCategory } from "@/types/Jewel";
import { CategoryFilter } from "@/components/CategoryFIlter";
import { PaginationControls } from "@/components/PaginationControls";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 8;

const Catalog = () => {
  const [jewels, setJewels] = useState<Jewel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJewel, setSelectedJewel] = useState<Jewel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);

  const MotionBox = motion(Box);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "joias"),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Jewel[];

        const validJewels = data.filter((jewel) => jewel.imageBase64);
        setJewels(validJewels);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao buscar joias:", err);
        setError("Não foi possível carregar as joias. Tente novamente.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const dynamicCategories = useMemo(() => {
    if (!jewels) return ["todos"];

    const allCategories = jewels.flatMap((jewel) =>
      Array.isArray(jewel?.categories) ? jewel.categories : []
    );

    return ["todos", ...Array.from(new Set(allCategories))];
  }, [jewels]);

  const filteredJewels = useMemo(() => {
    if (selectedCategory === "todos") {
      return jewels;
    }

    return jewels.filter((jewel) => {
      if (!jewel || !Array.isArray(jewel.categories)) {
        return false;
      }
      return jewel.categories.includes(selectedCategory as JewelCategory);
    });
  }, [jewels, selectedCategory]);

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
    <Box mb={8}>
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
        px={4}
        mb={4}
      >
        <CategoryFilter
          categories={dynamicCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
        />
      </Box>

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
            justifyContent={"center"}
            ml={{ md: 5 }}
            gap={6}
          >
            {paginatedJewels.map((jewel) => (
              <Box
                key={jewel.id}
                p={4}
                rounded="lg"
                _hover={{ transform: "scale(1.02)" }}
                transition="all 0.2s"
                borderColor={jewel.isPromotion ? "red.200" : "inherit"}
              >
                {jewel.isPromotion && (
                  <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                  >
                    <Box
                      position={"absolute"}
                      bg="red.500"
                      color="white"
                      px={2}
                      py={1}
                      w={"100px"}
                      ml={{
                        base: "2px",
                        md: "5px",
                        lg: "6px",
                      }}
                      mt={{
                        base: "5px",
                        md: "5px",
                        lg: "5px",
                      }}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                      zIndex={1}
                    >
                      {jewel.promotionTag || "PROMOÇÃO"}
                    </Box>
                  </MotionBox>
                )}
                <Dialog.Root
                  onOpenChange={(isOpen) => {
                    if (isOpen) setSelectedJewel(jewel);
                    else setSelectedJewel(null);
                  }}
                >
                  <Dialog.Trigger asChild>
                    <MotionBox
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      <AspectRatio ratio={1} maxW={{ base: "100%", md: "80%",lg:"90%" }}>
                      <Image
                        src={jewel.imageBase64}
                        alt={jewel.name}
                        objectFit="contain"
                        rounded="xs"
                        w={{ base: "100%", md: "300px" }}
                        h={{ base: "100%", md: "300px" }}
                        maxH={{ base: "100%", md: "350px" }}
                        mx="auto"
                        loading="lazy"
                        cursor="pointer"
                        transition="transform 0.2s"
                        _hover={{ transform: "scale(1.05)" }}
                      />
                      </AspectRatio>
                    </MotionBox>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content
                        bg="#e8e2d2"
                        maxW={{ base: "90vw", md: "600px" }}
                        mt="10px"
                        p={4}
                      >
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
                              <MotionBox
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9 }}
                                whileInView={{ opacity: 1, y: 0 }}
                              >
                                <Image
                                  src={selectedJewel.imageBase64}
                                  alt={selectedJewel.name}
                                  objectFit="contain"
                                  h={{ base: "60vh", md: "70vh" }}
                                  mt="-50px"
                                  w="100%"
                                />
                              </MotionBox>

                              {selectedJewel.isPromotion &&
                                selectedJewel.originalPrice ? (
                                <MotionBox
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.9 }}
                                  mt={4}
                                >
                                  <Box alignItems="center" gap={2} mb={1}>
                                    <Text
                                      color="red.500"
                                      fontWeight="bold"
                                      fontSize="lg"
                                    >
                                      {selectedJewel.price}
                                    </Text>
                                    <Text
                                      color="gray.500"
                                      textDecoration="line-through"
                                      fontSize="sm"
                                      mt={1}
                                    >
                                      {selectedJewel.originalPrice}
                                    </Text>
                                  </Box>
                                </MotionBox>
                              ) : (
                                <MotionBox
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.9 }}
                                >
                                  <Text
                                    color="blue.600"
                                    fontWeight="medium"
                                    mb={1}
                                  >
                                    {selectedJewel.price}
                                  </Text>
                                </MotionBox>
                              )}
                              <MotionBox
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.0 }}
                              >
                                <Box mt={4} p={4}>
                                  <Text
                                    fontSize="md"
                                    color="gray.700"
                                    lineHeight="tall"
                                    whiteSpace="pre-line"
                                  >
                                    Descrição:
                                  </Text>
                                  <Text mt={2}>
                                    {selectedJewel.description}
                                  </Text>
                                </Box>
                              </MotionBox>
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
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </>
      )}
    </Box>
  );
};

export default Catalog;
