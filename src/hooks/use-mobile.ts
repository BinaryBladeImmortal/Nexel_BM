import { useMediaQuery } from "react-responsive";

export function useMobile() {
  return useMediaQuery({ maxWidth: 768 });
}