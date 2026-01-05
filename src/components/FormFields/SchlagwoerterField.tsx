// ...existing code...
import type { FieldValues, Control, FieldErrors, Path } from 'react-hook-form';
import { GenericField } from './GenericField';

interface SchlagwoerterFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function SchlagwoerterField<T extends FieldValues>({
  name,
  control,
  errors,
}: SchlagwoerterFieldProps<T>) {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Schlagwörter (optional)"
      placeholder="Mehrere durch Komma trennen"
      rules={{
        validate: (value?: string | string[]) => {
          if (!value || (Array.isArray(value) && value.length === 0))
            return true;
          const arr = Array.isArray(value)
            ? value
            : String(value)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
          if (arr.some((w) => w.length > 32))
            return 'Jedes Schlagwort max. 32 Zeichen';
          return true;
        },
      }}
      helperText="z.B. JAVASCRIPT, TYPESCRIPT"
    />
  );
}
// ...existing code...
