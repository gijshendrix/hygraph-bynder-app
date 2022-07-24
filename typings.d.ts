interface Window {
  newrelic: {
    setCustomAttribute: (label: string, value: string) => void;
  };
}
