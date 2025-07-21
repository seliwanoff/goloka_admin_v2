import PhoneInputField from "@/components/settings-com/phone_input";
import CustomSelectField from "@/components/settings-com/select_field";
import TextField from "@/components/settings-com/text_field";
import { watch } from "fs";
import { FieldErrors, UseFormRegister, Control } from "react-hook-form";

export interface FormProps {
  errors: FieldErrors;
  data: Record<string, any>;
  register?: UseFormRegister<any>;
  control?: Control<any>;
  watch?: any;
  options?: Option[];
  disabled?: boolean;
}

type Option = {
  label: string;
  value: string | number;
};

interface InputProps {
  type: string;
  placeholder: string;
  required: boolean;
  err_message: string;
  onChange: (value: string | any) => void;
  value: string;
}

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  value: string;
};

const CustomInput = ({
  errors,
  data,
  register,
  control,
  watch,
  options,
  disabled,
}: FormProps) => {
  switch (data?.type) {
    case "select":
      return (
        <CustomSelectField
          {...{ errors, data, control, options }}
          disabled={disabled}
        />
      );
    case "phoneNo":
      return (
        <PhoneInputField {...{ errors, data, control }} disabled={disabled} />
      );

    default:
      return (
        <TextField {...{ errors, data, register, watch }} disabled={disabled} />
      );
  }
};

export default CustomInput;
