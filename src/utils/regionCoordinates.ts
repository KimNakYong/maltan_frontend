// 한국 주요 지역의 중심 좌표 데이터
export interface RegionCoordinate {
  city: string;
  cityName: string;
  district: string;
  districtName: string;
  latitude: number;
  longitude: number;
}

// 서울특별시 (city: "11")
const seoulDistricts: RegionCoordinate[] = [
  { city: "11", cityName: "서울특별시", district: "11110", districtName: "종로구", latitude: 37.5735, longitude: 126.9788 },
  { city: "11", cityName: "서울특별시", district: "11140", districtName: "중구", latitude: 37.5641, longitude: 126.9979 },
  { city: "11", cityName: "서울특별시", district: "11170", districtName: "용산구", latitude: 37.5326, longitude: 126.9905 },
  { city: "11", cityName: "서울특별시", district: "11200", districtName: "성동구", latitude: 37.5634, longitude: 127.0368 },
  { city: "11", cityName: "서울특별시", district: "11215", districtName: "광진구", latitude: 37.5385, longitude: 127.0823 },
  { city: "11", cityName: "서울특별시", district: "11230", districtName: "동대문구", latitude: 37.5744, longitude: 127.0399 },
  { city: "11", cityName: "서울특별시", district: "11260", districtName: "중랑구", latitude: 37.6063, longitude: 127.0926 },
  { city: "11", cityName: "서울특별시", district: "11290", districtName: "성북구", latitude: 37.5894, longitude: 127.0167 },
  { city: "11", cityName: "서울특별시", district: "11305", districtName: "강북구", latitude: 37.6397, longitude: 127.0256 },
  { city: "11", cityName: "서울특별시", district: "11320", districtName: "도봉구", latitude: 37.6688, longitude: 127.0471 },
  { city: "11", cityName: "서울특별시", district: "11350", districtName: "노원구", latitude: 37.6542, longitude: 127.0568 },
  { city: "11", cityName: "서울특별시", district: "11380", districtName: "은평구", latitude: 37.6027, longitude: 126.9291 },
  { city: "11", cityName: "서울특별시", district: "11410", districtName: "서대문구", latitude: 37.5791, longitude: 126.9368 },
  { city: "11", cityName: "서울특별시", district: "11440", districtName: "마포구", latitude: 37.5663, longitude: 126.9019 },
  { city: "11", cityName: "서울특별시", district: "11470", districtName: "양천구", latitude: 37.5170, longitude: 126.8664 },
  { city: "11", cityName: "서울특별시", district: "11500", districtName: "강서구", latitude: 37.5509, longitude: 126.8495 },
  { city: "11", cityName: "서울특별시", district: "11530", districtName: "구로구", latitude: 37.4954, longitude: 126.8874 },
  { city: "11", cityName: "서울특별시", district: "11545", districtName: "금천구", latitude: 37.4519, longitude: 126.8955 },
  { city: "11", cityName: "서울특별시", district: "11560", districtName: "영등포구", latitude: 37.5264, longitude: 126.8962 },
  { city: "11", cityName: "서울특별시", district: "11590", districtName: "동작구", latitude: 37.5124, longitude: 126.9393 },
  { city: "11", cityName: "서울특별시", district: "11620", districtName: "관악구", latitude: 37.4784, longitude: 126.9516 },
  { city: "11", cityName: "서울특별시", district: "11650", districtName: "서초구", latitude: 37.4837, longitude: 127.0324 },
  { city: "11", cityName: "서울특별시", district: "11680", districtName: "강남구", latitude: 37.5172, longitude: 127.0473 },
  { city: "11", cityName: "서울특별시", district: "11710", districtName: "송파구", latitude: 37.5145, longitude: 127.1059 },
  { city: "11", cityName: "서울특별시", district: "11740", districtName: "강동구", latitude: 37.5301, longitude: 127.1238 },
];

// 부산광역시 (city: "26")
const busanDistricts: RegionCoordinate[] = [
  { city: "26", cityName: "부산광역시", district: "26110", districtName: "중구", latitude: 35.1063, longitude: 129.0323 },
  { city: "26", cityName: "부산광역시", district: "26140", districtName: "서구", latitude: 35.0979, longitude: 129.0246 },
  { city: "26", cityName: "부산광역시", district: "26170", districtName: "동구", latitude: 35.1295, longitude: 129.0454 },
  { city: "26", cityName: "부산광역시", district: "26200", districtName: "영도구", latitude: 35.0914, longitude: 129.0679 },
  { city: "26", cityName: "부산광역시", district: "26230", districtName: "부산진구", latitude: 35.1627, longitude: 129.0533 },
  { city: "26", cityName: "부산광역시", district: "26260", districtName: "동래구", latitude: 35.2048, longitude: 129.0784 },
  { city: "26", cityName: "부산광역시", district: "26290", districtName: "남구", latitude: 35.1360, longitude: 129.0843 },
  { city: "26", cityName: "부산광역시", district: "26320", districtName: "북구", latitude: 35.1975, longitude: 128.9896 },
  { city: "26", cityName: "부산광역시", district: "26350", districtName: "해운대구", latitude: 35.1631, longitude: 129.1635 },
  { city: "26", cityName: "부산광역시", district: "26380", districtName: "사하구", latitude: 35.1044, longitude: 128.9747 },
  { city: "26", cityName: "부산광역시", district: "26410", districtName: "금정구", latitude: 35.2429, longitude: 129.0927 },
  { city: "26", cityName: "부산광역시", district: "26440", districtName: "강서구", latitude: 35.2119, longitude: 128.9802 },
  { city: "26", cityName: "부산광역시", district: "26470", districtName: "연제구", latitude: 35.1764, longitude: 129.0818 },
  { city: "26", cityName: "부산광역시", district: "26500", districtName: "수영구", latitude: 35.1454, longitude: 129.1134 },
  { city: "26", cityName: "부산광역시", district: "26530", districtName: "사상구", latitude: 35.1528, longitude: 128.9910 },
  { city: "26", cityName: "부산광역시", district: "26710", districtName: "기장군", latitude: 35.2446, longitude: 129.2219 },
];

// 인천광역시 (city: "28")
const incheonDistricts: RegionCoordinate[] = [
  { city: "28", cityName: "인천광역시", district: "28110", districtName: "중구", latitude: 37.4738, longitude: 126.6216 },
  { city: "28", cityName: "인천광역시", district: "28140", districtName: "동구", latitude: 37.4739, longitude: 126.6432 },
  { city: "28", cityName: "인천광역시", district: "28177", districtName: "미추홀구", latitude: 37.4636, longitude: 126.6505 },
  { city: "28", cityName: "인천광역시", district: "28185", districtName: "연수구", latitude: 37.4106, longitude: 126.6782 },
  { city: "28", cityName: "인천광역시", district: "28200", districtName: "남동구", latitude: 37.4476, longitude: 126.7314 },
  { city: "28", cityName: "인천광역시", district: "28237", districtName: "부평구", latitude: 37.5070, longitude: 126.7218 },
  { city: "28", cityName: "인천광역시", district: "28245", districtName: "계양구", latitude: 37.5379, longitude: 126.7377 },
  { city: "28", cityName: "인천광역시", district: "28260", districtName: "서구", latitude: 37.5453, longitude: 126.6759 },
];

// 전체 지역 데이터
export const regionCoordinates: RegionCoordinate[] = [
  ...seoulDistricts,
  ...busanDistricts,
  ...incheonDistricts,
];

// 영문 코드 -> 숫자 코드 매핑
const districtCodeMap: { [key: string]: string } = {
  // 서울특별시
  'jongno': '11110',
  'jung': '11140',
  'yongsan': '11170',
  'seongdong': '11200',
  'gwangjin': '11215',
  'dongdaemun': '11230',
  'jungnang': '11260',
  'seongbuk': '11290',
  'gangbuk': '11305',
  'dobong': '11320',
  'nowon': '11350',
  'eunpyeong': '11380',
  'seodaemun': '11410',
  'mapo': '11440',
  'yangcheon': '11470',
  'gangseo': '11500',
  'guro': '11530',
  'geumcheon': '11545',
  'yeongdeungpo': '11560',
  'dongjak': '11590',
  'gwanak': '11620',
  'seocho': '11650',
  'gangnam': '11680',
  'songpa': '11710',
  'gangdong': '11740',
  // 부산광역시
  'busanjung': '26110',
  'busanseo': '26140',
  'busandong': '26170',
  'yeongdo': '26200',
  'busanjin': '26230',
  'dongnae': '26260',
  'busannam': '26290',
  'busanbuk': '26320',
  'haeundae': '26350',
  'saha': '26380',
  'geumjeong': '26410',
  'busangangseo': '26440',
  'yeonje': '26470',
  'suyeong': '26500',
  'sasang': '26530',
  'gijang': '26710',
  // 인천광역시
  'incheunjung': '28110',
  'incheondong': '28140',
  'michuhol': '28177',
  'yeonsu': '28185',
  'namdong': '28200',
  'bupyeong': '28237',
  'gyeyang': '28245',
  'incheonseo': '28260',
};

// 지역 코드로 좌표 찾기 (영문 코드와 숫자 코드 모두 지원)
export const getCoordinatesByDistrict = (district: string): RegionCoordinate | undefined => {
  // 영문 코드인 경우 숫자 코드로 변환
  const numericCode = districtCodeMap[district] || district;
  return regionCoordinates.find(region => region.district === numericCode);
};

// 도시 코드로 중심 좌표 찾기 (해당 도시의 첫 번째 구)
export const getCoordinatesByCity = (city: string): RegionCoordinate | undefined => {
  return regionCoordinates.find(region => region.city === city);
};

// 기본 좌표 (서울 시청)
export const DEFAULT_COORDINATE = {
  latitude: 37.5665,
  longitude: 126.9780,
};

