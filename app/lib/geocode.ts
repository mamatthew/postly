export async function geocode(postalCode: string, city: string) {
  const url = `https://geocoder.ca/?geoit=xml&address=${city}&postal=${postalCode}&json=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.latt && data.longt) {
      return { lat: parseFloat(data.latt), lng: parseFloat(data.longt) };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error geocoding the address:", error);
    return null;
  }
}
