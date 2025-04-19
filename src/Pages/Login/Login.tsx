import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin/dashboard");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuário logado:", user);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Credenciais inválidas");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="400px" mx="auto" mt={20} p={4}>
      <VStack as="form" onSubmit={handleLogin}>
        <Heading size="lg">Acesso Administrativo</Heading>

        {error && <Text color="red.500">{error}</Text>}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          name="email"
        />

        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          name="password"
        />

        <Button type="submit" colorScheme="blue" width="100%" loading={loading}>
          Entrar
        </Button>
      </VStack>
    </Box>
  );
}
