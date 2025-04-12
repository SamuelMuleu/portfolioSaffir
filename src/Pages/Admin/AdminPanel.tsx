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
  Portal,
  createListCollection,
  Stack,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { uploadJewelry } from "../../firebaseUpload";
import ManageJewelries from "../../components/ManageJewelries";
import UploadJewelForm from "@/components/UploadJewelForm";
import { Jewel } from "@/types/Jewel";
import { GiJewelCrown } from "react-icons/gi";
type UploadStatus = "idle" | "uploading" | "success" | "error";

const AdminPanel = () => {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategories] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [showManagePanel, setShowManagePanel] = useState(false);

  const [editingJewel, setEditingJewel] = useState<Jewel | null>(null);
  const [showForm, setShowForm] = useState(false);

  const switchToManagePanel = () => {
    setShowManagePanel(true);
    setEditingJewel(null);
  };

  const switchToUploadPanel = () => {
    setEditingJewel(null);
    setShowForm(false);
    setShowManagePanel(false);
  };

  const switchToUploadForm = () => {
    setShowForm(true);
  };

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
      await uploadJewelry(image, name, price, category);
      setStatus("success");
      setImage(null);
      setName("");
      setPrice("");
      setCategories("");
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

  const items = createListCollection({
    items: [
      { label: "Correntaria", value: "correntaria" },
      { label: "Conjuntos", value: "conjuntos" },
      { label: "Alianças", value: "aliancas" },
      { label: "Aneis", value: "Aneis" },
      { label: "Brincos", value: "Brincos" },
      { label: "Pingentes", value: "Pingentes" },
    ],
  });

  const formatCurrency = (value: string) => {
    let digits = value.replace(/\D/g, "");
    digits = digits.padStart(3, "0");

    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseInt(digits) / 100);

    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    setPrice(formattedValue);
  };

  const handleEditJewel = (jewel: Jewel | null) => {
    setEditingJewel(jewel);
  };

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status]);
  return (
    <Box p={4} maxW="md" mx="auto">
      {showForm ? (
        <UploadJewelForm
          editingJewel={editingJewel}
          onSuccess={() => {
            setShowForm(false);
            setEditingJewel(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingJewel(null);
          }}
        />
      ) : showManagePanel ? (
        <ManageJewelries
          switchToUploadPanel={switchToUploadPanel}
          switchToUploadForm={switchToUploadForm}
          setEditingJewel={handleEditJewel}
        />
      ) : (
        <>
          <Button onClick={switchToManagePanel} color={"white"}>
          <GiJewelCrown />

            Gerenciar
          </Button>

      
          <Text fontSize="xl" mb={4} fontWeight="bold">
            Cadastrar Joia
          </Text>

          {status === "success" && (
            <Stack gap={4}>
              <Alert.Root status="success" variant="subtle" padding={2} mb={2}>
                <Alert.Indicator mt={"2"} />
                <Alert.Content>
                  <AlertTitle>Sucesso!</AlertTitle>
                  <AlertDescription>Joia enviada com sucesso!</AlertDescription>
                </Alert.Content>
              </Alert.Root>
            </Stack>
          )}

          {errorMessage && (
            <Alert.Root status="warning">
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
            placeholder="R$ 0,00"
            value={price}
            onChange={handleChange}
            mb={4}
          />

          <Box mb={4}>
            <Select.Root
              collection={items}
              onValueChange={({ value }) => {
                setCategories(value[0]);
              }}
              maxW="md"
              mx="auto"
              size="sm"
              width="320px"
            >
              <Select.HiddenSelect />
              <Select.Label>Selecione a Categoria</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText
                    maxW="md"
                    mx="auto"
                    placeholder="Selecione a Categoria"
                    color={"white"}
                  />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {items.items.map((item) => (
                      <Select.Item
                        key={item.value}
                        item={item}
                        _hover={{ bg: "#1c3050" }}
                        _selected={{ color: "white" }}
                        color="black"
                        justifyContent={"center"}
                        bg="#e8e2d2"
                        px={4}
                        py={2}
                      >
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>

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
            width="full"
            disabled={!image || !name}
          >
            Upload Joia
          </Button>
        </>
      )}
    </Box>
  );
};

export default AdminPanel;
