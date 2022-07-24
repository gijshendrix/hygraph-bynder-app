export function CloseModalButton({ closeModal }: { closeModal: () => void }) {
  return (
    <button
      type="button"
      style={{
        cursor: "pointer",
        userSelect: "none",
        backgroundColor: "transparent",
        textAlign: "center",
        lineHeight: "16px",
        display: "inline-flex",
        border: "0px",
        position: "absolute",
        right: "10px",
        top: "10px",
        fontWeight: 500,
        background: "white",
        color: "black",
        fontSize: "16px",
        borderRadius: "4px",
        padding: "4px 8px",
        verticalAlign: "middle",
        margin: 0,
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
      }}
      onKeyPress={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.key === "Enter") {
          closeModal();
        }
      }}
    >
      Close
    </button>
  );
}
