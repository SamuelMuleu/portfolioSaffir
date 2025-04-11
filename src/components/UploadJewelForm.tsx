import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Image,
  Text,
  Alert,
  Flex,
  createListCollection,
} from "@chakra-ui/react";
import { updateJewelry, uploadJewelry } from "@/firebaseUpload";
import { Select } from "@chakra-ui/react";
import { Jewel } from "@/types/Jewel";

type UploadJewelFormProps = {
  editingJewel: Jewel | null;
  onSuccess: () => void;
  onCancel: () => void;
};
type JewelCategory =
  | "correntaria"
  | "conjuntos"
  | "aliancas"
  | "aneis"
  | "brincos";

const UploadJewelForm = ({
  editingJewel,
  onSuccess,
  onCancel,
}: UploadJewelFormProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState<JewelCategory | "">("");

  const formatCurrency = (value: string) => {
    let digits = value.replace(/\D/g, "");
    digits = digits.padStart(3, "0");

    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseInt(digits) / 100);

    return formatted;
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    const unformatted = rawValue.replace(/\D/g, "");

    if (unformatted === "") {
      setPrice("");
      return;
    }

    const formattedValue = formatCurrency(unformatted);
    setPrice(formattedValue);
  };
  useEffect(() => {
    if (editingJewel) {
      setPrice(editingJewel.price);
      setName(editingJewel.name);
      setCategory(editingJewel.category);
      setPreview(editingJewel.imageBase64);
    }
  }, [editingJewel]);
  useEffect(() => {
    if (editingJewel) {
      setName(editingJewel.name);
      setPrice(editingJewel.price);
      setCategory(editingJewel.category);
      setPreview(editingJewel.imageBase64);
    } else {
      setName("");
      setPrice("");
      setCategory("");
      setPreview("");
      setImage(null);
    }
  }, [editingJewel]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async () => {
    if (!name) {
      setError("Por favor, insira um nome para a joia.");
      return;
    }

    setIsLoading(true);
    try {
      if (editingJewel) {
        await updateJewelry(editingJewel.id, {
          name,
          price,
          category,
          image: image || undefined,
        });
      } else {
        await uploadJewelry(image!, name, price, category);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };
  const items = createListCollection({
    items: [
      { label: "Correntaria", value: "correntaria" },
      { label: "Conjuntos", value: "conjuntos" },
      { label: "Alianças", value: "aliancas" },
      { label: "Aneis", value: "Aneis" },
      { label: "Brincos", value: "Brincos" },
    ],
  });
  const handleCategoryChange = (value: string[]) => {
    setCategory(value[0] as JewelCategory);
  };

  return (
    <Box>
      <Text fontSize="lg" mb={4} fontWeight="bold">
        {editingJewel ? "Editar Joia" : "Cadastrar Nova Joia"}
      </Text>

      {error && (
        <Alert.Root status="info" title="This is the alert title">
          <Alert.Indicator />
          <Alert.Title>This is the alert title</Alert.Title>
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
        onChange={handlePriceChange}
        mb={4}
      />

      <Select.Root
        size="sm"
        collection={items}
        onValueChange={({ value }) => handleCategoryChange(value)}
        defaultValue={category ? [category] : undefined}
      >
        <Select.HiddenSelect />
        <Select.Label />

        <Select.Control>
          <Select.Trigger>
            <Select.ValueText
              placeholder={category}
              mx="auto"
              color={"white"}
            />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
            <Select.ClearTrigger />
          </Select.IndicatorGroup>
        </Select.Control>

        <Select.Positioner>
          <Select.Content>
            {items.items.map((item) => (
              <Select.Item
                key={item.value}
                item={item}
                _hover={{ bg: "#1c3050" }}
                _selected={{ color: "white" }}
                color="white"
                px={4}
                py={2}
              >
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>

      <Box mb={4}>
        <Text mb={2}>Imagem da joia:</Text>
        <Input type="file" accept="image/*" onChange={handleFileChange} p={1} />
      </Box>

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          boxSize="200px"
          objectFit="contain"
          mb={4}
        />
      )}

      <Flex gap={2}>
        <Button
          onClick={handleSubmit}
          colorScheme="blue"
          flex={1}
          loading={isLoading}
        >
          {editingJewel ? "Atualizar" : "Cadastrar"}
        </Button>

        {editingJewel && (
          <Button onClick={onCancel} flex={1}>
            Cancelar
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default UploadJewelForm;
