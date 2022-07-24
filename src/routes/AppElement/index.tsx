import { useFieldExtension } from "@graphcms/app-sdk-react";
import { FormFieldRenderer } from "./FormFieldRenderer";
import { TableCellRenderer } from "./TableRenderer";
import setNewRelicAttributes from "../../utils/setNewRelicAttributes";

export default function AppElement() {
  setNewRelicAttributes();

  const { isTableCell } = useFieldExtension();
  if (isTableCell) {
    return <TableCellRenderer />;
  }

  return <FormFieldRenderer />;
}
