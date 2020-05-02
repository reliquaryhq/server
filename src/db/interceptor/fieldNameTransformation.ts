import camelcase from 'camelcase';
import { FieldType, InterceptorType, QueryResultRowType } from 'slonik';

interface ConfigurationType {
  /**
   * The only supported format is CAMEL_CASE.
   */
  format: 'CAMEL_CASE';

  /**
   * Tests whether the field should be formatted. The default behaviour is to
   * include all fields that match ^[a-z0-9_]+$ regex.
   */
  test?: (field: FieldType) => boolean;
}

interface FormattedFieldType {
  formatted: string;
  original: string;
}

const underscoreFieldRegex = /^[a-z0-9_]+$/;

const underscoreFieldTest = (field: FieldType): boolean =>
  underscoreFieldRegex.test(field.name);

const createFieldNameTransformationInterceptor = (
  configuration: ConfigurationType
): InterceptorType => {
  if (configuration.format !== 'CAMEL_CASE') {
    throw new Error('Unsupported format');
  }

  const fieldTest = configuration.test || underscoreFieldTest;

  return {
    transformRow: (context, query, row, fields): QueryResultRowType<string> => {
      if (!context.sandbox.formattedFields) {
        context.sandbox.formattedFields = fields.map((field) => ({
          formatted: fieldTest(field) ? camelcase(field.name) : field.name,
          original: field.name,
        }));
      }

      const formattedFields: FormattedFieldType[] =
        context.sandbox.formattedFields;

      const transformedRow: QueryResultRowType<string> = {};

      for (const field of formattedFields) {
        if (typeof field.formatted !== 'string') {
          throw new TypeError('Unexpected field name type');
        }

        transformedRow[field.formatted] = row[field.original];
      }

      return transformedRow;
    },
  };
};

export { createFieldNameTransformationInterceptor };
