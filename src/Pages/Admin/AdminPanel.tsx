import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Image,
  Text,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { uploadJewelry } from "../../firebaseUpload";

type UploadStatus = "idle" | "uploading" | "success" | "error";

const AdminPanel = () => {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("A imagem deve ser menor que 5MB.");
      return;
    }

    setErrorMessage("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image || !name) {
      setErrorMessage("Por favor, insira um nome e selecione uma imagem.");
      return;
    }

    setStatus("uploading");
    try {
      await uploadJewelry(image, name, price);
      setStatus("success");
      setImage(null);
      setName("");
      setPrice("");
      setPreview(null);
      setErrorMessage("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao enviar joia. Por favor, tente novamente."
      );
      console.error("Erro ao enviar joia:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Box p={4} maxW="md" mx="auto" >
      <Text fontSize="xl" mb={4} fontWeight="bold">
        Painel Administrativo
      </Text>

      {status === "success" && (
        <Alert.Root>
          <Alert.Indicator />
          <Alert.Content>
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>Joia enviada com sucesso!</AlertDescription>
          </Alert.Content>
        </Alert.Root>
      )}

      {errorMessage && (
        <Alert.Root>
          <Alert.Indicator />
          <Alert.Content>
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert.Content>
        </Alert.Root>
      )}

      <Input
        placeholder="Nome da joia"
        value={name}
        onChange={(e) => setName(e.target.value)}
        mb={4}
      />

      <Input
        placeholder="Preço da joia"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        mb={4}
      />

      <Box mb={4}>
        <Text mb={2}>Imagem da joia:</Text>
        <Input
          marginLeft="1px"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          border="none"
          p={1}
        />
      </Box>

      {preview && (
        <Image
          src={preview}
          alt="Preview da joia"
          boxSize="200px"
          objectFit="contain"
          mb={4}
          borderRadius="md"
        />
      )}

      <Button
        onClick={handleUpload}
        loading={status === "uploading"}
        loadingText="Enviando..."
        colorScheme="blue"
        width="full"
        disabled={!image || !name}
      >
        Upload Joia
      </Button>
    </Box>
  );
};

export default AdminPanel;
