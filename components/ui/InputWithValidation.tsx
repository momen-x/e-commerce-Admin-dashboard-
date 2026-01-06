import { Path, FieldValues, UseFormRegister } from "react-hook-form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Label } from "@/components/ui/label";

type TInputProps<TFieldValue extends FieldValues> = {
  label: string;
  name: Path<TFieldValue>;
  register: UseFormRegister<TFieldValue>;
  type?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  multiple?: boolean;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // ← Added this
};

const InputWithValidation = <TFieldValue extends FieldValues>({
  name,
  label,
  register,
  type = "text",
  error,
  placeholder,
  children,
  disabled,
  multiple,
  accept,
  onChange, // ← Added this
  
}: TInputProps<TFieldValue>) => {
  const registration = register(name);

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <InputGroup className="mt-2">
        <InputGroupInput
        hidden={type === "hidden"}
          type={type}
          placeholder={placeholder}
          {...registration}
          onChange={(e) => {
            registration.onChange(e); // Call react-hook-form's onChange
            onChange?.(e); // Call custom onChange if provided
          }}
          disabled={disabled}
          multiple={multiple}
          accept={accept}
        />
        <InputGroupAddon>{children}</InputGroupAddon>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </InputGroup>
    </div>
  );
};

export default InputWithValidation;
