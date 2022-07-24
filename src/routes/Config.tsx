import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useApp } from "@graphcms/app-sdk-react";
import setNewRelicAttributes from "../utils/setNewRelicAttributes";

function Config() {
  setNewRelicAttributes();

  const { updateInstallation, installation } = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = ({ defaultDomain }) => {
    updateInstallation({
      status: "COMPLETED",
      config: { defaultDomain },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-group">
        <label>Bynder domain</label>
        <input
          {...register("defaultDomain", {
            required: true,
            value: installation?.config?.defaultDomain,
          })}
        />
        {errors?.defaultDomain?.type === "required" && (
          <p className="error">This field is required</p>
        )}
      </div>

      <input className="submit" type="submit" />
    </form>
  );
}

export default Config;
