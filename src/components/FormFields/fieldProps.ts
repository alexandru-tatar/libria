import type { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';

export type BaseFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
};
