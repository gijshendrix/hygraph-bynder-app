import { FieldValues, SubmitHandler, useForm, NestedValue } from "react-hook-form";
import { useApp } from "@graphcms/app-sdk-react";
import setNewRelicAttributes from "../utils/setNewRelicAttributes";

function Config() {
  setNewRelicAttributes();

  type FormValues = {
    defaultDomain: string;
    assetTypes: string[];
  };  

  const { updateInstallation, installation } = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  
  const onSubmit: SubmitHandler<FormValues> = data => {
    updateInstallation({
      status: "COMPLETED",
      config: { 
        "defaultDomain": data.defaultDomain,
        //@ts-expect-error
        "assetTypes": data.assetTypes,
      },
    });
  };

  const assetTypeLabels = ["Image", "Video", "Document", "Audio"];

  console.log(installation?.config);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-group">
        <label className="input-label" >Bynder domain</label>
        <input
          {...register("defaultDomain", {
            required: true,
            value: installation?.config?.defaultDomain as string | undefined,
          })}
        />
        {errors?.defaultDomain?.type === "required" && (
          <p className="error">This field is required</p>
        )}
      </div>

      <div className="input-group">
        <label className="input-label" >Allowed asset types</label>

        <div className="checkbox-group">
          { assetTypeLabels.map( (item) =>
            <label className="checkbox-label" key={item.toLowerCase()}><input 
              className="checkbox-input"
              type="checkbox"
              value={item.toLowerCase()}
              //@ts-expect-error
              defaultChecked={installation?.config?.assetTypes?.includes(item.toLowerCase())}
              {...register("assetTypes", {
                required: true,
              })}
              />
              {item}
            </label> 
          )}
        </div>      
        { Boolean(errors?.assetTypes) && (
            <p className="error">This field is required</p>
        )}          
      </div>

      <input className="submit" type="submit" />
    </form>
  );
}

export default Config;
