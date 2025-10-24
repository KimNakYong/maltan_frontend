import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { CITIES, DISTRICTS, SelectedRegion } from '../utils/regionData';

interface RegionSelectorProps {
  selectedRegions: SelectedRegion[];
  onChange: (regions: SelectedRegion[]) => void;
  error?: string;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegions,
  onChange,
  error,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  // 선택 가능한 구 목록
  const availableDistricts = selectedCity ? DISTRICTS[selectedCity] || [] : [];

  // 시/도 선택 핸들러
  const handleCityChange = (event: SelectChangeEvent) => {
    const cityCode = event.target.value;
    setSelectedCity(cityCode);
    setSelectedDistrict(''); // 구 선택 초기화
  };

  // 구 선택 핸들러
  const handleDistrictChange = (event: SelectChangeEvent) => {
    const districtCode = event.target.value;
    setSelectedDistrict(districtCode);

    // 이미 3개를 선택했으면 추가 불가
    if (selectedRegions.length >= 3) {
      return;
    }

    // 이미 선택된 구인지 확인
    const alreadySelected = selectedRegions.some(
      (region) =>
        region.city === selectedCity && region.district === districtCode
    );

    if (alreadySelected) {
      return;
    }

    // 선택된 지역 추가
    const city = CITIES.find((c) => c.code === selectedCity);
    const district = availableDistricts.find((d) => d.code === districtCode);

    if (city && district) {
      const newRegion: SelectedRegion = {
        city: selectedCity,
        cityName: city.name,
        district: districtCode,
        districtName: district.name,
        priority: selectedRegions.length + 1, // 1, 2, 3
      };

      onChange([...selectedRegions, newRegion]);
      setSelectedDistrict(''); // 선택 초기화
    }
  };

  // 선택된 지역 삭제 핸들러
  const handleDeleteRegion = (index: number) => {
    const newRegions = selectedRegions.filter((_, i) => i !== index);
    // 우선순위 재조정
    const reorderedRegions = newRegions.map((region, i) => ({
      ...region,
      priority: i + 1,
    }));
    onChange(reorderedRegions);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
        관심 지역 선택 (최대 3개)
      </Typography>
      <Typography variant="caption" color="text.secondary" gutterBottom display="block" sx={{ mb: 2 }}>
        선택한 순서대로 우선순위가 지정됩니다. 해당 지역의 정보를 우선적으로 추천해드립니다.
      </Typography>

      {/* 시/도 선택 */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>시/도 선택</InputLabel>
        <Select
          value={selectedCity}
          label="시/도 선택"
          onChange={handleCityChange}
          disabled={selectedRegions.length >= 3}
        >
          <MenuItem value="">
            <em>선택하세요</em>
          </MenuItem>
          {CITIES.map((city) => (
            <MenuItem key={city.code} value={city.code}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 구/군 선택 */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>구/군 선택</InputLabel>
        <Select
          value={selectedDistrict}
          label="구/군 선택"
          onChange={handleDistrictChange}
          disabled={!selectedCity || selectedRegions.length >= 3}
        >
          <MenuItem value="">
            <em>선택하세요</em>
          </MenuItem>
          {availableDistricts.map((district) => {
            const isSelected = selectedRegions.some(
              (region) =>
                region.city === selectedCity &&
                region.district === district.code
            );
            return (
              <MenuItem
                key={district.code}
                value={district.code}
                disabled={isSelected}
              >
                {district.name} {isSelected && '(선택됨)'}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {/* 선택된 지역 표시 */}
      {selectedRegions.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            선택된 지역 ({selectedRegions.length}/3)
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {selectedRegions.map((region, index) => (
              <Chip
                key={`${region.city}-${region.district}`}
                label={`${region.priority}순위: ${region.cityName} ${region.districtName}`}
                onDelete={() => handleDeleteRegion(index)}
                color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'default'}
                variant={index === 0 ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* 안내 메시지 */}
      {selectedRegions.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          최소 1개 이상의 지역을 선택해주세요.
        </Alert>
      )}

      {selectedRegions.length === 3 && (
        <Alert severity="success" sx={{ mt: 2 }}>
          최대 3개의 지역을 선택하셨습니다.
        </Alert>
      )}
    </Box>
  );
};

export default RegionSelector;

