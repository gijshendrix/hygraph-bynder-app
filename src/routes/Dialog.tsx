import { useLayoutEffect } from "react";
import { useUiExtensionDialog } from "@graphcms/app-sdk-react";
import { isMediaList, isMediaType, Media } from "../helpers";
import setNewRelicAttributes from "../utils/setNewRelicAttributes";

export type DialogReturn = Media | Media[] | null;
export type DialogProps = {
  isList: boolean;
  media: Media | Media[] | "";
  DEFAULT_DOMAIN: string;
  ASSET_TYPES: string[];
};

export default function BynderDialog() {
  setNewRelicAttributes();

  const { onCloseDialog, isList, media, DEFAULT_DOMAIN, ASSET_TYPES } =
    useUiExtensionDialog<DialogReturn, DialogProps>();

  useLayoutEffect(() => {
    // @ts-expect-error
    BynderCompactView.open({
      container: document.getElementById("bynder"),
      portal: {url: DEFAULT_DOMAIN || "", editable: false},
      language: "en_US",
      mode: isList ? "MultiSelect" : "SingleSelect",
      assetTypes: ASSET_TYPES, //["image", "video"],
      selectedAssets: isMediaList(media) ? media.map(item => item.databaseId) : isMediaType(media) ? [ media.databaseId ] : [],
      onSuccess: function (assets: Media[]) {
        if (isList) {
          if (isMediaList(media)) {
            onCloseDialog([...assets]);
          } else {
            // initial field value is an empty string
            const newArray = isMediaType(media)
              ? [...assets]
              : assets;
            onCloseDialog(newArray);
          }
        } else {
          onCloseDialog(assets[0]);
        }
      }
    });  

  }, [DEFAULT_DOMAIN, ASSET_TYPES, isList, media, onCloseDialog]);

  return (
    <div
      id="bynder"
      style={{
        height: "800px",
      }}
    />
  );
}
