let googleMapsScriptLoadingPromise;

export function loadGoogleMaps(apiKey) {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }
  if (!googleMapsScriptLoadingPromise) {
    googleMapsScriptLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google.maps);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return googleMapsScriptLoadingPromise;
}