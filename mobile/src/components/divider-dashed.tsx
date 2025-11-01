import { Text } from "react-native";
import React from "react";
import { cn } from "utils/utils";

interface DividerDashedProps {
  className?: string;
}

const DividerDashed = ({ className = "" }: DividerDashedProps) => {
  return (
    <Text
      className={cn(
        "border-dashed w-full border-t border-[#068db6] -mb-5",
        className
      )}
    ></Text>
  );
};

export default DividerDashed;
