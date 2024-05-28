import { useState } from "react";

export const useInput = () => {
  const [value, setValue] = useState<string>("");

  const removeLetter = () => {
    if (!value) {
      return;
    }

    setValue((word) => word.substring(0, word.length - 1));
  };

  return { value, setValue, removeLetter };
};
