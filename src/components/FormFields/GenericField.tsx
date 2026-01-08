import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { getErrorByPath } from './formErrors';

export type Option = {
  value: string;
  label: string;
};

export type GenericFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  select?: boolean;
  options?: Option[];
  helperText?: string;
  sx?: SxProps<Theme>;
  rules?: RegisterOptions<T, Path<T>>;
};

export const GenericField = <T extends FieldValues>({
  name,
  control,
  errors,
  label,
  required,
  placeholder,
  type,
  select,
  options,
  helperText,
  sx,
  rules,
}: GenericFieldProps<T>) => {
  const fieldError = getErrorByPath<T>(errors, String(name));

  const labelText = required ? `${label} *` : label;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        if (type === 'checkbox') {
          return (
            <FormControlLabel
              sx={sx}
              label={label}
              control={
                <Checkbox
                  checked={Boolean(field.value)}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              }
            />
          );
        }

        return (
          <TextField
            {...field}
            sx={sx}
            fullWidth
            label={labelText}
            required={false}
            placeholder={placeholder}
            type={type}
            select={Boolean(select)}
            value={field.value ?? ''}
            onChange={(event) => field.onChange(event.target.value)}
            error={Boolean(fieldError)}
            helperText={fieldError?.message ?? helperText}
            InputLabelProps={type === 'date' ? { shrink: true } : undefined}
          >
            {select &&
              (options ?? []).map(({ value, label: optionLabel }) => (
                <MenuItem key={value} value={value}>
                  {optionLabel}
                </MenuItem>
              ))}
          </TextField>
        );
      }}
    />
  );
};
