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
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import { updateJewelry, uploadJewelry } from "@/firebaseUpload";
import { Select } from "@chakra-ui/react";
import { Jewel, JewelCategory } from "@/types/Jewel";
import { colorPalettes } from "@/compositions/lib/color-palettes";

type UploadJewelFormProps = {
  editingJewel: Jewel | null;
  onSuccess: () => void;
  onCancel: () => void;
};

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
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<JewelCategory[]>([]);
  const [isPromotion, setIsPromotion] = useState(false);
  const [originalPrice, setOriginalPrice] = useState("");

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
      console.log("Dados completos da joia:", editingJewel);
      setName(editingJewel.name);
      setPrice(editingJewel.price);
      setCategories(editingJewel.categories);
      setDescription(editingJewel.description);
      setPreview(editingJewel.imageBase64);
      setIsPromotion(
        editingJewel.isPromotion || editingJewel.categories.includes("Promoção" as JewelCategory)
      );

      if (editingJewel.originalPrice) {
        setOriginalPrice(editingJewel.originalPrice);
      }
    } else {
      setName("");
      setPrice("");
      setDescription("");
      setCategories([]);
      setPreview("");
      setImage(null);
      setIsPromotion(false);
      setOriginalPrice("");
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
  const handleOriginalPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value;
    const unformatted = rawValue.replace(/\D/g, "");

    if (unformatted === "") {
      setOriginalPrice("");
      return;
    }

    const formattedValue = formatCurrency(unformatted);
    setOriginalPrice(formattedValue);
  };
  const handleSubmit = async () => {
    if (!name || !description || categories.length === 0) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (isPromotion && !originalPrice) {
      setError("Por favor, informe o preço original para promoções.");
      return;
    }

    setIsLoading(true);

    try {
      if (editingJewel) {
        await updateJewelry(editingJewel.id, {
          name,
          price,
          categories: isPromotion
            ? [...new Set([...categories, "Promoção" as JewelCategory])]
            : categories.filter((cat) => cat !== "Promoção"),
          description,
          image: image || undefined,
          isPromotion,
          originalPrice: isPromotion ? originalPrice : undefined,
        });
      } else {
        if (!image) {
          setError("Por favor, selecione uma imagem.");
          return;
        }
        await uploadJewelry(
          image,
          name,
          price,
          isPromotion
            ? [...new Set([...categories, "Promoção" as JewelCategory])]
            : categories,
          description,
          isPromotion,
          isPromotion ? originalPrice : undefined
        );
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
      { label: "Aneis", value: "aneis" },
      { label: "Brincos", value: "brincos" },
    ],
  });

  const handleCategoryChange = (value: string[]) => {
    setCategories(value as JewelCategory[]);
  };

  return (
    <Box>
      <Text fontSize="lg" mb={4} fontWeight="bold">
        {editingJewel ? "Editar Joia" : "Cadastrar Nova Joia"}
      </Text>

      {error && (
        <Alert.Root status="info" title="Error">
          <Alert.Indicator />
          <Alert.Title>Error {error}</Alert.Title>
        </Alert.Root>
      )}

      <Input
        placeholder="Nome da joia"
        value={name}
        onChange={(e) => setName(e.target.value)}
        mb={4}
      />
      <Input
        placeholder="Descrição da joia"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        mb={4}
      />
      <Input
        placeholder="R$ 0,00"
        value={price}
        onChange={handlePriceChange}
        mb={4}
      />
      <Box mb={4}>
        {colorPalettes.map((colorPalette) => (
          <Stack
            align="center"
            key={colorPalette}
            direction="row"
            gap="10"
            width="full"
          >
            <Checkbox.Root
              checked={isPromotion}
              colorPalette={colorPalette}
              mb={4}
              onChange={(e) => {
                const checked = (e.target as HTMLInputElement).checked;
                setIsPromotion(checked);
                if (!checked) {
                  setOriginalPrice("");
                }
              }}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label> Produto de Promoção</Checkbox.Label>
            </Checkbox.Root>
          </Stack>
        ))}
      </Box>

      {isPromotion && (
        <Input
          placeholder="Preço original (ex: R$ 299,90)"
          value={originalPrice}
          onChange={handleOriginalPriceChange}
          mb={4}
        />
      )}
      <Select.Root
        size="sm"
        collection={items}
        onValueChange={({ value }) => handleCategoryChange(value)}
        defaultValue={categories}
        multiple
      >
        <Select.HiddenSelect />
        <Select.Label>Categorias</Select.Label>

        <Select.Control>
          <Select.Trigger>
            <Select.ValueText
              placeholder={
                categories.length > 0
                  ? categories.join(", ")
                  : "Selecione as categorias"
              }
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
                _selected={{ color: "black", bg: "#1c3050" }}
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
        <Button onClick={handleSubmit} flex={1} loading={isLoading}>
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
