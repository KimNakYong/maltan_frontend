import React from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AttractionsIcon from '@mui/icons-material/Attractions';
import HotelIcon from '@mui/icons-material/Hotel';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';

export interface PlaceCategory {
  code: string;
  name: string;
  icon: React.ReactElement;
  description: string;
}

/**
 * 주변장소 카테고리 정의
 * - 음식점: 레스토랑, 카페, 바 등 음식 관련 장소
 * - 관광지: 명소, 박물관, 공원 등 관광 명소
 * - 숙박: 호텔, 펜션, 게스트하우스 등 숙박 시설
 * - 쇼핑: 쇼핑몰, 시장, 상점 등 쇼핑 관련 장소
 * - 문화: 극장, 갤러리, 문화센터 등 문화 시설
 */
export const PLACE_CATEGORIES: PlaceCategory[] = [
  {
    code: 'RESTAURANT',
    name: '음식점',
    icon: <RestaurantIcon />,
    description: '레스토랑, 카페, 바 등 음식 관련 장소',
  },
  {
    code: 'TOURIST',
    name: '관광지',
    icon: <AttractionsIcon />,
    description: '명소, 박물관, 공원 등 관광 명소',
  },
  {
    code: 'ACCOMMODATION',
    name: '숙박',
    icon: <HotelIcon />,
    description: '호텔, 펜션, 게스트하우스 등 숙박 시설',
  },
  {
    code: 'SHOPPING',
    name: '쇼핑',
    icon: <ShoppingBagIcon />,
    description: '쇼핑몰, 시장, 상점 등 쇼핑 관련 장소',
  },
  {
    code: 'CULTURE',
    name: '문화',
    icon: <TheaterComedyIcon />,
    description: '극장, 갤러리, 문화센터 등 문화 시설',
  },
];

/**
 * 카테고리 코드로 카테고리 정보 찾기
 */
export const getCategoryByCode = (code: string): PlaceCategory | undefined => {
  return PLACE_CATEGORIES.find((category) => category.code === code);
};

/**
 * 카테고리 이름으로 카테고리 정보 찾기
 */
export const getCategoryByName = (name: string): PlaceCategory | undefined => {
  return PLACE_CATEGORIES.find((category) => category.name === name);
};

