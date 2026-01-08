import type { FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import type { BaseFieldProps } from './fieldProps';
import { getErrorByPath } from './formErrors';

const parseTags = (raw: string): string[] =>
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const stringifyTags = (tags: string[] | undefined): string =>
  (tags ?? []).join(', ');

export const SchlagwoerterField = <T extends FieldValues>({
  name,
  control,
  errors,
}: BaseFieldProps<T>) => {
  const fieldError = getErrorByPath<T>(errors, String(name));

  return (
    <Controller
      name={name as Path<T>}
      control={control}
      rules={{
        validate: (value: unknown) => {
          const tags = Array.isArray(value)
            ? (value as string[])
            : parseTags(String(value ?? ''));

          const tooLong = tags.some((w) => w.length > 32);
          return tooLong ? 'Jedes Schlagwort max. 32 Zeichen' : true;
        },
      }}
      render={({ field }) => {
        const tagsArray = Array.isArray(field.value)
          ? (field.value as string[])
          : [];

        return (
          <TextField
            fullWidth
            label="Schlagwörter (optional)"
            placeholder="Mehrere durch Komma trennen"
            value={stringifyTags(tagsArray)}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(parseTags(event.target.value))}
            error={Boolean(fieldError)}
            helperText={fieldError?.message ?? 'z.B. JAVASCRIPT, TYPESCRIPT'}
          />
        );
      }}
    />
  );
};
