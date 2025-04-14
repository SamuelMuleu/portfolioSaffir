import { Box, Image, Text } from "@chakra-ui/react";


interface Jewel {
    name:string,
    image:string
    price:string;
    categories:string[];
}
const JewelCard = ({ name, image,price,categories }:Jewel) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      textAlign="center"
      boxShadow="md"
      _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
    >
      <Image src={image} alt={name} borderRadius="md" />
      <Text mt={2} fontSize="lg" fontWeight="bold">
        {name}
      </Text>
      <Text mt={2} fontSize="lg" fontWeight="bold">
        {price}
      </Text>
      <Text 
  fontSize="xs" 
  color="white" 
  bg="blue.500" 
  px={2} 
  py={1} 
  borderRadius="full"
  display="inline-block"
>
  {categories}
</Text>
    </Box>
  );
};

export default JewelCard;
