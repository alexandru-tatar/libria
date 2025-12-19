import type {
  FieldValues,
  Control,
  FieldErrors,
  Path,
  RegisterOptions,
  FieldError,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { TextField, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

type Option = { value: string; label: string };

interface GenericFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  select?: boolean;
  options?: Option[];
  helperText?: string;
  sx?: SxProps<Theme>;
  rules?: RegisterOptions<T, Path<T>>;
}

function getErrorByPath<T extends FieldValues>(errors: FieldErrors<T> | undefined, path: Path<T> | string): FieldError | undefined {
  if (!errors) return undefined;
  const parts = String(path).split('.');
  let current: unknown = errors;
  for (const part of parts) {
    if (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, part)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  if (current && typeof current === 'object' && 'message' in (current as Record<string, unknown>)) {
    return current as FieldError;
  }
  return undefined;
}

export function GenericField<T extends FieldValues>({
  name,
  control,
  errors,
  label,
  placeholder,
  type,
  select,
  options,
  helperText,
  sx,
  rules,
}: GenericFieldProps<T>) {
  const key = String(name);
  const fieldError = getErrorByPath<T>(errors, key);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        if (type === 'checkbox') {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label={label}
              sx={sx}
            />
          );
        }

        return (
          <TextField
            {...field}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
            select={Boolean(select)}
            label={label}
            placeholder={placeholder}
            type={type}
            fullWidth
            error={Boolean(fieldError)}
            helperText={fieldError?.message ?? helperText}
            sx={sx}
          >
            {select &&
              options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
          </TextField>
        );
      }}
    />
  );
}
