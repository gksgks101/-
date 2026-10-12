export interface CityInfo {
  name: string;
  country: string;
  timezone: string;
  longitude: number;
  latitude: number;
}

export const CITIES: CityInfo[] = [
  { name: "서울", country: "대한민국", timezone: "Asia/Seoul", longitude: 126.978, latitude: 37.566 },
  { name: "안산", country: "대한민국", timezone: "Asia/Seoul", longitude: 126.83, latitude: 37.323 },
  { name: "수원", country: "대한민국", timezone: "Asia/Seoul", longitude: 127.029, latitude: 37.263 },
  { name: "인천", country: "대한민국", timezone: "Asia/Seoul", longitude: 126.705, latitude: 37.456 },
  { name: "부산", country: "대한민국", timezone: "Asia/Seoul", longitude: 129.075, latitude: 35.179 },
  { name: "대구", country: "대한민국", timezone: "Asia/Seoul", longitude: 128.601, latitude: 35.871 },
  { name: "대전", country: "대한민국", timezone: "Asia/Seoul", longitude: 127.385, latitude: 36.35 },
  { name: "광주", country: "대한민국", timezone: "Asia/Seoul", longitude: 126.853, latitude: 35.16 },
  { name: "울산", country: "대한민국", timezone: "Asia/Seoul", longitude: 129.311, latitude: 35.538 },
  { name: "제주", country: "대한민국", timezone: "Asia/Seoul", longitude: 126.531, latitude: 33.499 },
  { name: "춘천", country: "대한민국", timezone: "Asia/Seoul", longitude: 127.73, latitude: 37.881 },
  { name: "청주", country: "대한민국", timezone: "Asia/Seoul", longitude: 127.489, latitude: 36.642 },
  { name: "전주", country: "대한민국", timezone: "Asia/Seoul", longitude: 127.148, latitude: 35.824 },
  { name: "창원", country: "대한민국", timezone: "Asia/Seoul", longitude: 128.682, latitude: 35.228 },
  { name: "도쿄", country: "일본", timezone: "Asia/Tokyo", longitude: 139.691, latitude: 35.69 },
  { name: "베이징", country: "중국", timezone: "Asia/Shanghai", longitude: 116.407, latitude: 39.904 },
  { name: "상하이", country: "중국", timezone: "Asia/Shanghai", longitude: 121.474, latitude: 31.23 },
  { name: "뉴욕", country: "미국", timezone: "America/New_York", longitude: -74.006, latitude: 40.713 },
  { name: "로스앤젤레스", country: "미국", timezone: "America/Los_Angeles", longitude: -118.244, latitude: 34.052 },
  { name: "런던", country: "영국", timezone: "Europe/London", longitude: -0.128, latitude: 51.507 },
];

export function findCity(country: string, city: string): CityInfo {
  return (
    CITIES.find((item) => item.country === country && item.name === city) ??
    CITIES.find((item) => item.name === city) ??
    CITIES[0]
  );
}

export function citiesFor(country: string): CityInfo[] {
  return CITIES.filter((item) => item.country === country);
}

export const COUNTRIES = [...new Set(CITIES.map((item) => item.country))];
