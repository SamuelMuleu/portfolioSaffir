import { Box, Flex, Text, Link, Separator } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" mt={12} py={8}>
      <Box maxW="7xl" mx="auto" px={4}>
        <Separator mb={6} borderColor="gray.200" />

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="sm" color="gray.600">
            © {new Date().getFullYear()} Catálogo de Joias. Todos os direitos
            reservados.
          </Text>

          <Flex gap={6}>
            <Link
              href="https://www.instagram.com/saffir_atelierdejoias/"
              fontSize="sm"
              target="_blank"
              color="gray.600"
              _hover={{ color: "blue.500" }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                alt="Instagram"
                width="20"
              />
            </Link>
            <Link
              href="https://api.whatsapp.com/send?phone=5522997927387"
              fontSize="sm"
              target="_blank"
              color="gray.600"
              _hover={{ color: "blue.500" }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4c/WhatsApp_Logo_green.svg"
                alt="WhatsApp"
                width="20"
              />
            </Link>
          </Flex>
        </Flex>

        <Text mt={4} fontSize="xs" color="gray.400" textAlign="center">
          Desenvolvido por Samuel Muleu
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
