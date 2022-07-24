export default function setNewRelicAttributes() {
  if (
    typeof window !== "undefined" &&
    typeof window.xprops !== "undefined" &&
    typeof window.newrelic !== "undefined"
  ) {
    window.newrelic.setCustomAttribute(
      "projectId",
      window.xprops.context?.project?.id
    );
    window.newrelic.setCustomAttribute(
      "environmentId",
      window.xprops.context?.environment?.id
    );
    window.newrelic.setCustomAttribute(
      "gcmsAppApiId",
      (window.xprops as any).installation?.app?.apiId
    );
    window.newrelic.setCustomAttribute("xprops", JSON.stringify(window.xprops));
  }
}
