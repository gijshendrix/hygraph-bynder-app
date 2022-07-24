import { useEffect } from "react";
import { CloseModalButton } from "./CloseModalButton";
import { Media } from "../helpers";

export function FullScreenPreview({
  media,
  onClose,
}: {
  media: Media;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keyup", handler);
    return () => {
      window.removeEventListener("keyup", handler);
    };
  }, [onClose]);

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        overflow: "auto",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <CloseModalButton closeModal={onClose} />

      {media.type === "IMAGE" ? (
         <img 
          src={media.files["webImage"].url}
          style={{ maxWidth: "100%", margin: "auto", maxHeight: "100%" }}          
          alt={media.description} 
        />        
      ) : media.type === "VIDEO" ? (
        <video 
        controls
        style={{
          width: "400",
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
