import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

// Created once at module level: calling motion(Box) inside a component creates a new
// component type on every render, which remounts the whole subtree (and its images).
export const MotionBox = motion.create(Box);
