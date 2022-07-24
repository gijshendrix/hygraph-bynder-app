import { useEffect, useState } from "react";
import { useApp, useFieldExtension } from "@graphcms/app-sdk-react";

import { FullScreenPreview } from "../../components/FullscreenPreview";
import { CloseModalButton } from "../../components/CloseModalButton";
import { isMediaList, Media, noop } from "../../helpers";

export function TableCellRenderer() {
  const {
    value: media,
    isExpanded,
    expand,
    field: { isList },
  } = useFieldExtension();

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(false);
  }, [isExpanded]);

  if (Array.isArray(media) ? media.length === 0 : Boolean(media) === false) {
    return null;
  }

  if (isExpanded && isList) {
    return (
      <TableAssetsPreviewModal
        media={media}
        closeModal={() => {
          expand(false);
          setIsTransitioning(true);
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        opacity: isTransitioning ? 0 : 1,
      }}
    >
      {isMediaList(media) ? (
        media.map((item: Media, index: number) => (
          <div
            key={item.databaseId + index}
            style={{
              width: 59,
              height: 59,
              marginRight: index === media.length - 1 ? 0 : 10,
            }}
          >
            <TableAsset
              media={item}
              onOpen={() => {
                expand(true);
                setIsTransitioning(true);
              }}
              isExpanded={false}
              onClose={noop}
            />
          </div>
        ))
      ) : (
        <div style={{ width: 59, height: 59 }}>
          <TableAsset
            isExpanded={isExpanded}
            onClose={() => {
              expand(false);
              setIsTransitioning(true);
            }}
            onOpen={() => {
              expand(true);
              setIsTransitioning(true);
            }}
            media={media}
          />
        </div>
      )}
    </div>
  );
}

function TableAsset({
  isExpanded,
  media,
  onOpen,
  onClose,
  style,
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

  return (
    <div
      tabIndex={0}
      onClick={onOpen}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          onOpen();
        }
      }}
      style={{
        width: 59,
        height: 59,
        flexShrink: 0,
        lineHeight: 0,
        ...style,
      }}
    >
      {media.type === "IMAGE" ? (
        <img 
          src={media.files["thumbnail"].url}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}        
          alt={media.description} 
        />          
      ) : media.type === "VIDEO" ? (
        <video 
          controls
          style={{
            width: "400",
            cursor: "pointer",
          }}
        >
          <source 
            type={"video/webm"}
            src={media.previewUrls[0]}
          />
        </video>        
      ) : null}
    </div>
  );
}

function TableAssetsPreviewModal({
  closeModal,
  media,
}: {
  media: Media[];
  closeModal: () => void;
}) {
  const [maximizedAsset, setMaximizedAsset] = useState<Media | null>(null);

  if (maximizedAsset) {
    return (
      <TableAsset
        media={maximizedAsset}
        isExpanded
        onOpen={noop}
        onClose={() => {
          setMaximizedAsset(null);
        }}
      />
    );
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
      }}
      onClick={closeModal}
    >
      <div
        style={{ margin: "auto" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <CloseModalButton closeModal={closeModal} />
        <div
          style={{
            display: "flex",
            borderRadius: "4px",
            backgroundColor: "white",
            maxWidth: "800px",
            maxHeight: "400px",
            padding: "16px",
            overflowY: "auto",
          }}
        >
          {media.map((item, index) => (
            <TableAsset
              isExpanded={false}
              media={item}
              key={item.databaseId + index}
              onOpen={() => {
                setMaximizedAsset(item);
              }}
              onClose={() => {
                setMaximizedAsset(null);
              }}
              style={{
                width: 250,
                height: 200,
                marginRight: index === media.length - 1 ? 0 : 16,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
