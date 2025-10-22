import { useState, useEffect } from 'react';

/**
 * Google Maps API 로드 훅
 */
export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // index.html에서 이미 스크립트를 로드하므로 window.google 확인만 함
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
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
        clearInterval(interval);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return { isLoaded, error };
};

/**
 * 사용자 현재 위치 가져오기 훅
 */
export const useCurrentLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('브라우저가 위치 정보를 지원하지 않습니다.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message || '위치 정보를 가져올 수 없습니다.');
        setLoading(false);
      }
    );
  };

  return { location, error, loading, getCurrentLocation };
};

/**
 * 장소 검색 훅
 */
export const usePlacesSearch = (map: google.maps.Map | null) => {
  const [results, setResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNearby = (
    location: { lat: number; lng: number },
    radius: number = 1000,
    type?: string
  ) => {
    if (!map) {
      setError('지도가 초기화되지 않았습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    const service = new google.maps.places.PlacesService(map);

    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius,
      type,
    };

    service.nearbySearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setResults(results);
      } else {
        setError('장소를 검색할 수 없습니다.');
        setResults([]);
      }
      setLoading(false);
    });
  };

  const searchByText = (query: string) => {
    if (!map) {
      setError('지도가 초기화되지 않았습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    const service = new google.maps.places.PlacesService(map);

    const request: google.maps.places.TextSearchRequest = {
      query,
    };

    service.textSearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setResults(results);
      } else {
        setError('장소를 검색할 수 없습니다.');
        setResults([]);
      }
      setLoading(false);
    });
  };

  return { results, loading, error, searchNearby, searchByText };
};

/**
 * 거리 계산 훅
 */
export const useDistanceCalculator = () => {
  const calculateDistance = (
    from: { lat: number; lng: number },
    to: { lat: number; lng: number }
  ): number => {
    const service = new google.maps.DistanceMatrixService();

    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [new google.maps.LatLng(from.lat, from.lng)],
          destinations: [new google.maps.LatLng(to.lat, to.lng)],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response: google.maps.DistanceMatrixResponse | null, status: google.maps.DistanceMatrixStatus) => {
          if (status === google.maps.DistanceMatrixStatus.OK && response) {
            const distance = response.rows[0].elements[0].distance.value; // 미터 단위
            resolve(distance);
          } else {
            reject(new Error('거리를 계산할 수 없습니다.'));
          }
        }
      );
    }) as any;
  };

  return { calculateDistance };
};

