import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { MAP } from '../utils/constants';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    onClick?: () => void;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  style?: React.CSSProperties;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = MAP.DEFAULT_CENTER,
  zoom = MAP.DEFAULT_ZOOM,
  markers = [],
  onMapClick,
  style = { width: '100%', height: '500px' },
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Google Maps API 로드
  useEffect(() => {
    // index.html에서 이미 스크립트를 로드하므로 window.google 확인만 함
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setLoading(false);
        return true;
      }
      return false;
    };

    // 즉시 확인
    if (checkGoogleMaps()) {
      return;
    }

    // 아직 로드되지 않았다면 interval로 체크
    const interval = setInterval(() => {
      if (checkGoogleMaps()) {
        clearInterval(interval);
      }
    }, 100);

    // 10초 후에도 로드되지 않으면 에러
    const timeout = setTimeout(() => {
      if (!window.google || !window.google.maps) {
        setError('Google Maps API를 로드할 수 없습니다.');
        setLoading(false);
        clearInterval(interval);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (loading || !mapRef.current || !window.google || map) return;

    try {
      const newMap = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      // 지도 클릭 이벤트
      if (onMapClick) {
        newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        });
      }

      setMap(newMap);
    } catch (err) {
      setError('지도를 초기화할 수 없습니다.');
      console.error('Map initialization error:', err);
    }
  }, [loading, center, zoom, onMapClick, map]);

  // 마커 업데이트
  useEffect(() => {
    if (!map) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
      });

      if (markerData.onClick) {
        marker.addListener('click', markerData.onClick);
      }

      markersRef.current.push(marker);
    });
  }, [map, markers]);

  // 지도 중심 이동
  useEffect(() => {
    if (!map) return;
    map.setCenter(center);
  }, [map, center]);

  // 줌 레벨 변경
  useEffect(() => {
    if (!map) return;
    map.setZoom(zoom);
  }, [map, zoom]);

  if (loading) {
    return (
      <Box
        sx={{
          ...style,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'grey.100',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={style}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return <Box ref={mapRef} sx={style} />;
};

export default GoogleMap;

