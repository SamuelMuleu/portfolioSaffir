import { Center, ButtonGroup, IconButton, Button } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <Center mt={8}>
    <ButtonGroup>
      <IconButton
        aria-label="Página anterior"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <LuChevronLeft />
      </IconButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "solid" : "outline"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <IconButton
        aria-label="Próxima página"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <LuChevronRight />
      </IconButton>
    </ButtonGroup>
  </Center>
);