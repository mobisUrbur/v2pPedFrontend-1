import React, { useEffect, useState } from 'react';
import { Modal, CollisionWarning } from "../../component";
import { UrbrFront } from 'urbr_wasm';

const MainMap = () => {
  const [urbrFront, setUrbrFront] = useState(null);
  const [numParameters, setNumParameters] = useState(null);
  const [from, setFrom] = useState(null);

  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  const [modal1, setModal1] = useState(false);
  const mode = 'sils'; // 'real' or 'sils' (실제 위치 or SILS 위치)
  const [sessionUUID, setSessionUUID] = useState("");

  // 연오한테서 SILS 속 위치 받아오기
  const getSILSGPS = async () => {
    const url = 'http://47.186.58.92:52804/tasks/1';

    try {
      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Response from server:', response);

      const data = await response.json();
      setLat(data.lat);
      setLng(data.lng);

      console.log('SILS GPS:', data.lat, data.lng);

      const urbr       = new UrbrFront       (); // LSTM 수행하는 객체 만들기
      const out_buffer = UrbrFront.out_buffer(); // LSTM 출력 버퍼 (크기 100짜리 Float32Array)

      // 수행하고 나면 output에 100개가 담김
      urbr.inference(lat, lng, out_buffer);

      console.log(lat, lng, out_buffer);

      // 서버로 전송할 output
      setFrom(out_buffer);

    } catch (error) {
      console.error('Error getting position from SILS server:', error);
    }
  };

  useEffect(() => {
    // 현재 위치 가져오기 및 서버로 위치 전송
    const sendCurrentPositionToServer = async (position) => {
      const { latitude, longitude } = position.coords;
      const id = sessionStorage.getItem('user_id');
      setLat(latitude);
      setLng(longitude);

      const urbr       = new UrbrFront       (); // LSTM 수행하는 객체 만들기
      const out_buffer = UrbrFront.out_buffer(); // LSTM 출력 버퍼 (크기 100짜리 Float32Array)

      // 수행하고 나면 output에 100개가 담김
      urbr.inference(lat, lng, out_buffer);

      console.log(lat, lng, out_buffer);

      // 서버로 전송할 output
      setFrom(out_buffer);

      const url = 'http://localhost:8888/pedHandler';//'http://localhost:8888/pedHandler'; // 엔드포인트 주소에 맞게 수정

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            from: Array.from(out_buffer),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Retrieve session UUID from sessionStorage
        const storedSessionUUID = sessionStorage.getItem("user_id");
        setSessionUUID(storedSessionUUID);

        // Check for collision
        checkForCollision(storedSessionUUID, data.pedestrianUUIDs);
        console.log('Response from server:', data.pedestrianUUIDs);
      } catch (error) {
        console.error('Error sending position to server:', error);
      }
    };

    
    // 카카오 지도 렌더링
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(lat, lng), // 서울의 위도, 경도
      level: 1, // 지도 확대 레벨
    };

    const map = new window.kakao.maps.Map(container, options);
    var markerPosition = new window.kakao.maps.LatLng(lat, lng);
    var marker = new window.kakao.maps.Marker({
      position: markerPosition
    });
    marker.setMap(map);

    if (mode === 'real') {
      // 실제 위치 받아오기
      navigator.geolocation.getCurrentPosition(
        sendCurrentPositionToServer,
        (error) => {
          console.error('Error getting current position:', error.message);
        }
      );

       // 위치 업데이트 주기 설정 (예: 1초마다)
      const watchPositionOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
      const watchPositionId = navigator.geolocation.watchPosition(
        (position) => {
          sendCurrentPositionToServer(position);
        },
        (error) => {
          console.error('Error watching position:', error.message);
        },
        watchPositionOptions
      );

      const urbr       = new UrbrFront       (); // LSTM 수행하는 객체 만들기
      const out_buffer = UrbrFront.out_buffer(); // LSTM 출력 버퍼 (크기 100짜리 Float32Array)

      // 수행하고 나면 output에 100개가 담김
      urbr.inference(lat, lng, out_buffer);

      console.log(lat, lng, out_buffer);

      // 서버로 전송할 output
      setFrom(out_buffer);
      
      return () => {
        navigator.geolocation.clearWatch(watchPositionId);
      };
    } else {
       // 0.5초 간격으로 fetchData 가상 위치 받아오기
       const intervalId = setInterval(getSILSGPS, 500);

       // 컴포넌트가 언마운트될 때 clearInterval을 통해 interval 정리
       return () => clearInterval(intervalId);
    }

    // return () => {
    //   navigator.geolocation.clearWatch(watchPositionId);
    // };
  }, [lat, lng]);

	function checkForCollision(sessionUUID, serverUUIDs) {
    // console.log("check1")
		// Check if session UUID is present in server UUIDs
		const isCollision = serverUUIDs.includes(sessionUUID);

		if (isCollision) {
		  // Trigger collision warning
		  setModal1(true);
		}
    // console.log("check2")
	}

  return (
    <>
    <div id="map" style={{ width: '100%', height: '100%' }}></div>
    <Modal open={modal1} className="customOverlay">
      <div id="popIngredient" className="layerPopup pop_ingredient">
          <div className="popup">
              <div className="p_head botm">
                  <button type="button" className="b-close btn_close" onClick={() => setModal1()}>
                      <span>x</span>
                  </button>
              </div>
            <CollisionWarning />
            {/* <PushNotification /> */}
            {/* <Vibration /> */}
          </div>
      </div>
    </Modal>
    </>
  );
};

export default MainMap;
//<div id="map" style={{ width: '500%', height: '500%', marginLeft: '-200%', marginTop: '-300%', overflow: 'hidden'}}></div>