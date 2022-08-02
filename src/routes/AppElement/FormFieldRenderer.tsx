import { useEffect, useState } from "react";
import { useFieldExtension } from "@graphcms/app-sdk-react";
import { FullScreenPreview } from "../../components/FullscreenPreview";
import { DialogProps, DialogReturn } from "../Dialog";
import { isMediaList, isMediaType, Media } from "../../helpers";

import bynderLogo from "../../bynder_logo_white.svg";

export function FormFieldRenderer() {
  const {
    value: media,
    // field.isList reveals whether a field handles multiple values
    field: { isList },
    onChange,
    onFocus,
    onBlur,
    openDialog,
  } = useFieldExtension();
  const { isExpanded, expand, installation } = useFieldExtension();

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(false);
  }, [isExpanded]);

  const [clickedMedia, setClickedMedia] = useState<Media>();
  // Note that in a form, an empty field's initial value is an empty string
  const showMedia = Array.isArray(media) ? media.length > 0 : Boolean(media);

  if (!installation) return null;
  const config = {
    DEFAULT_DOMAIN: installation.config.defaultDomain as string,
    //@ts-expect-error
    ASSET_TYPES: installation.config.assetTypes as string[],
  };
  console.log(config);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        opacity: isTransitioning ? 0 : 1,
      }}
    >
      {isExpanded ? null : (
        <button
          style={{
            cursor: "pointer",
            marginBottom: "10px",
            boxSizing: "border-box",
            userSelect: "none",
            color: "white",
            backgroundColor: "#3448c5e8",
            textAlign: "center",
            lineHeight: "16px",
            display: "inline-flex",
            border: "0px",
            borderRadius: "4px",
            fontWeight: 600,
            fontFamily:
              'Inter, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
            fontSize: "14px",
            verticalAlign: "middle",
            padding: "8px",
            whiteSpace: "nowrap",
            margin: "8px 0",
          }}
          onClick={() => {
            onFocus();
            openDialog<DialogReturn, DialogProps>("/dialog", {
              maxWidth: "90vw",
              isList,
              media,
              DEFAULT_DOMAIN: config.DEFAULT_DOMAIN,
              ASSET_TYPES: config.ASSET_TYPES,
            }).then((value) => {
              if (value) {
                onChange(value);
              }
              onBlur();
            });
          }}
        >
          <img
            src={bynderLogo}
            style={{
              maxWidth: "24px",
              marginLeft: "4px",
            }}
            alt="Bynder"
          />
          <span style={{ margin: "0px 10px" }}>{isList ? "Select assets" : media ? "Replace asset" : "Select asset"} from Bynder</span>
        </button>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 12px" }}>
        {showMedia &&
          (isMediaList(media) ? (
            media.map((item, index) => (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  position: "relative",
                  opacity:
                    isExpanded && item.databaseId !== clickedMedia?.databaseId
                      ? 0
                      : 1,
                }}
                key={item.databaseId + index}
              >
                <FormAsset
                  media={item}
                  isExpanded={
                    item.databaseId === clickedMedia?.databaseId && isExpanded
                  }
                  onOpen={() => {
                    // expand accepts a boolean that will be accessible as isExpanded
                    expand(true);
                    setIsTransitioning(true);
                    setClickedMedia(item);
                  }}
                  onClose={() => {
                    expand(false);
                    setIsTransitioning(true);
                    setClickedMedia(undefined);
                  }}
                />
                <button
                  style={{
                    marginLeft: "4px",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    userSelect: "none",
                    color: "#6663FD",
                    backgroundColor: "transparent",
                    textAlign: "center",
                    lineHeight: "14px",
                    display: "inline-flex",
                    border: "0px",
                    fontWeight: 500,
                    fontFamily: "sans-serif",
                    fontSize: "12px",
                    verticalAlign: "middle",
                    padding: "4px",
                  }}
                  onClick={() => {
                    const newValues = media.filter(
                      (value) => value.databaseId !== item.databaseId
                    );
                    onChange(newValues);
                  }}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <FormAsset
              isExpanded={
                media.databaseId === clickedMedia?.databaseId && isExpanded
              }
              onOpen={() => {
                expand(true);
                setIsTransitioning(true);
                setClickedMedia(media);
              }}
              onClose={() => {
                expand(false);
                setIsTransitioning(true);
                setClickedMedia(undefined);
              }}
              media={media}
            />
          ))}
      </div>
    </div>
  );
}

function FormAsset({
  media,
  onOpen,
  onClose,
  isExpanded,
}: {
  style?: React.CSSProperties;
  isExpanded: boolean;
  media: Media;
  onOpen: () => void;
  onClose: () => void;
}) {
  if (isExpanded) {
    return (
      <FullScreenPreview
        media={media}
        onClose={onClose}
      />
    );
  }
  if (media.type.toLowerCase() === "image")
    return (
      <button
        onClick={onOpen}
        style={{
          padding: 0,
          background: "transparent",
          cursor: "pointer",
          border: "1px solid lightgrey",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div>
        <img 
            src={media.files["thumbnail"].url}
            style={{
              height: "130px",
              background: "lightgrey"
            }}            
            alt={media.description} 
          />
        </div>
        <div
          style={{
            boxSizing: "border-box",
            padding: "4px 8px",
            fontWeight: "bold",
            textAlign: "left",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={media.name}
        >
          {media.name}
        </div>
      </button>
    );

  if (media.type.toLowerCase() === "video")
    return (
      <video 
        controls
        style={{
          width: "400px",
        }}
      >
        <source 
          type={"video/webm"}
          src={media.previewUrls[0]}
        />
      </video>
    );

  return null;
}
