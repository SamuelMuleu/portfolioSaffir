import { Button, Stack, Center } from "@chakra-ui/react";

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory
}: {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) => (
  <Center mb={2}   px={{ base: 2, md: 0 }}>
    <Stack direction={{ base: "column", md: "row" }} align="center" w="full">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onSelectCategory(category)}
          w={{ base: "100%", md: "100px" }}
          bg={selectedCategory === category ? "#0e2d5b" : "transparent"}
          color={selectedCategory === category ? "white" : "gray.800"}
          textTransform="capitalize"
          fontSize={{ base: "sm", md: "md" }}
          size={"sm"}
          mx={{ base: "0", md: "-2", lg: "0" }}

          _hover={{
            bg: selectedCategory === category ? "#0e2d5b" : "#e8e2d2",
          }}
        >
          {category}
        </Button>
      ))}
    </Stack>
  </Center>
);