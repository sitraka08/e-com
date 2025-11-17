import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React from "react";
import { cn } from "@/utils/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link"
  | "fab"
  | "chip"
  | "action";

type ButtonSize = "sm" | "default" | "lg" | "icon" | "iconSm";

type ActionColor = "blue" | "gray" | "red";

interface ButtonProps extends Omit<TouchableOpacityProps, "children"> {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
  fullWidth?: boolean;
  isActive?: boolean;
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: boolean;
  actionColor?: ActionColor;
}

export default function Button({
  label,
  className = "",
  loading,
  onPress,
  textClassName = "",
  disabled = false,
  variant = "primary",
  size = "default",
  fullWidth = false,
  isActive = false,
  icon,
  iconLeft,
  iconRight,
  iconOnly = false,
  actionColor = "blue",
  ...touchableProps
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-primary border-primary",
    secondary: "bg-white border-white",
    outline: "bg-transparent border-2 border-gray-300",
    ghost: "bg-gray-100 border-transparent",
    destructive: "bg-red-50 border-2 border-red-500",
    link: "bg-transparent border-transparent",
    fab: "bg-primary border-primary shadow-lg rounded-full",
    chip: isActive
      ? "bg-primary border-primary"
      : "bg-secondary border-[#b6def1bd]",
    action:
      actionColor === "blue"
        ? "bg-blue-50 border-blue-50"
        : actionColor === "red"
          ? "bg-red-50 border-red-50"
          : "bg-gray-100 border-gray-100",
  };

  const textColorStyles = {
    primary: "text-white",
    secondary: "text-primary",
    outline: "text-gray-700",
    ghost: "text-gray-700",
    destructive: "text-red-500",
    link: "text-primary",
    fab: "text-white",
    chip: isActive ? "text-white" : "text-gray-700",
    action:
      actionColor === "blue"
        ? "text-blue-600"
        : actionColor === "red"
          ? "text-red-600"
          : "text-gray-700",
  };

  const sizeStyles = {
    sm: iconOnly ? "w-8 h-8" : "py-2 px-3",
    default: iconOnly ? "w-10 h-10" : "py-3 px-4",
    lg: iconOnly ? "w-14 h-14" : "py-4 px-6",
    icon: "w-10 h-10 p-2",
    iconSm: "w-6 h-6 p-1",
  };

  // Text size styles
  const textSizeStyles = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
    icon: "text-sm",
    iconSm: "text-xs",
  };

  const borderRadiusStyles = {
    primary: "rounded-xl",
    secondary: "rounded-xl",
    outline: "rounded-xl",
    ghost: "rounded-lg",
    destructive: "rounded-2xl",
    link: "rounded-none",
    fab: "rounded-full",
    chip: "rounded-xl",
    action: "rounded-lg",
  };

  const isDisabled = loading || disabled;
  const opacity = isDisabled ? 0.5 : 1;

  const renderIcon = (iconElement: React.ReactNode) => {
    if (!iconElement) return null;
    return iconElement;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator
            color={
              variant === "primary" || variant === "fab" ? "#fff" : "#0174D8"
            }
            size="small"
          />
          {!iconOnly && label && (
            <Text
              className={cn(
                "font-fsemibold ml-2",
                textSizeStyles[size],
                textColorStyles[variant],
                textClassName
              )}
            >
              {label}
            </Text>
          )}
        </>
      );
    }

    if (iconOnly && (icon || iconLeft)) {
      return renderIcon(icon || iconLeft);
    }

    return (
      <>
        {iconLeft && <>{renderIcon(iconLeft)}</>}
        {icon && !iconLeft && !iconRight && <>{renderIcon(icon)}</>}
        {label && (
          <Text
            className={cn(
              "font-fsemibold",
              textSizeStyles[size],
              textColorStyles[variant],
              (iconLeft || icon) && !iconOnly ? "ml-2" : "",
              iconRight ? "mr-2" : "",
              textClassName
            )}
          >
            {label}
          </Text>
        )}
        {iconRight && <>{renderIcon(iconRight)}</>}
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isDisabled}
      style={{ opacity }}
      className={cn(
        "flex-row items-center justify-center border",
        variantStyles[variant],
        sizeStyles[size],
        borderRadiusStyles[variant],
        fullWidth ? "w-full" : "",
        className
      )}
      {...touchableProps}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
